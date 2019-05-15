/*
 * RexPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Button, Modal, Tabs, Select, Radio, Alert} from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { makeSelectNetwork } from '../LanguageProvider/selectors'
import axios from 'axios'
import {
  formItemLayout,
  getNewApi,
  GetNewRpc,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'
import config from './../../config'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const confirm = Modal.confirm

export class RexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      scatterStatus: false,
      GetTransactionButtonScatterState: false,
      newtransaction: {},
      resourseType: 1,
      tabsKey: '1',
      isHiddenGetTransactionButton: true,
      nowBaseSymbol: 'EOS',
      choiceResourseType: 1,
      buyRexByFundStatus: false,
      buyRexByCpuStatus: false,
      buyRexByNetStatus: false,
      sellRexByFundStatus: false,
      accountMount: '',
      accountCpuMount: '',
      accountNetMount: '',
      accountData: {},
      modalVisible: false, // 请前往代理弹框
      rexPrice: 0, // rex 折算价
      totalRexNum: 0, // rex资金池数量
      rexAmount: 0, // rex 余额
      choiceDepositType: 1, // deposit or withdraw
      choiceBuySellRex: 1 // buy or sell rex
    }
  }

  /**
   * 链接scatter
   * */
  componentDidMount () {
    for(let i = 0; i < config.netWorkConfig.length; i++) {
      if(this.props.SelectedNetWork === config.netWorkConfig[i].networkName) {
        this.setState({nowBaseSymbol: config.netWorkConfig[i].BaseSymbol})
      }
    }
    this.getRexPrice()
  }

  getRexPrice=async ()=>{
    this.setState({rexPrice: 0})

    for(let i = 0; i < config.netWorkConfig.length; i++) {
      if(config.netWorkConfig[i].networkName === this.props.SelectedNetWork) {
        var result = await GetNewRpc(config.netWorkConfig[i].Endpoint).get_table_rows({json: true, code: 'eosio', scope: 'eosio', table: 'rexpool', limit: 10, index_position: 1, key_type: '', show_payer: false})
      }
    }
    let data = result.rows[0]
    let totalRexNum = Number(data.total_lent.split(' ')[0]) + Number(data.total_unlent.split(' ')[0])
    let rexprice = (Number(data.total_lent.split(' ')[0]) + Number(data.total_unlent.split(' ')[0])) / Number(data.total_rex.split(' ')[0])
    this.setState({rexPrice: rexprice, totalRexNum: totalRexNum})
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
    for(let i = 0; i < config.netWorkConfig.length; i++) {
      if(nextProps.SelectedNetWork === config.netWorkConfig[i].networkName) {
        this.setState({nowBaseSymbol: config.netWorkConfig[i].BaseSymbol})
      }
    }
    if(nextProps.SelectedNetWork !== this.props.SelectedNetWork) {
      setTimeout(()=>{
        this.accountBulr()
        this.getRexPrice()
      }, 500)
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { account, paymoneyamount, receivecpuaccount, resoursestoreMoney, buyAccount, buyCPUAmount, buyNetAmount} = values
    this.setState({
      GetTransactionButtonState: !!account && !!paymoneyamount && !!receivecpuaccount && !!resoursestoreMoney })
    // this.setState({buyRexByFundStatus:  this.state.choiceResourseType===1})
  };

  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    (async ()=>{
      try{
        this.setState({ scatterStatus: false })
        if (!this.state.GetTransactionButtonState) {
          return
        }
        // rend module
        if(this.state.tabsKey === '3' && this.state.resourseType == 1) {
          this.rentcpu()
          return
        }else if(this.state.tabsKey === '3' && this.state.resourseType == 2) {
          this.rentnet()
          return
        }
        //
        const values = this.props.form.getFieldsValue()
        const { account, permission, proposer, proposalName} = values
        var data = {
          owner: account,
          amount: amount
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'withdraw',
              authorization: [
                {
                  actor: account,
                  permission: permission
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()

  };

  getRexAmount = async (account)=>{
    this.setState({rexAmount: 0})
    for(let i = 0; i < config.netWorkConfig.length; i++) {
      if(config.netWorkConfig[i].networkName === this.props.SelectedNetWork) {
        let result = await GetNewRpc(config.netWorkConfig[i].Endpoint).get_table_rows({'json': true, 'code': 'eosio', 'scope': 'eosio', 'table': 'rexbal', 'lower_bound': account, 'upper_bound': account, 'limit': 1})
        let data = result.rows[0]
        try{
          this.setState({rexAmount: data.rex_balance})
        }catch(err){
          console.log('err ',err)
        }
      }
    }
  }

  checkaccount = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({account: value})
    callback()
    return
  }

  checkpermission = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({permission: value})
    callback()
    return
  }

  callback = key => {
    this.setState({tabsKey: key})
    // if(key == "1" || key == "2"){
    //   this.setState({isHiddenGetTransactionButton:false})
    // }else{
    //   this.setState({isHiddenGetTransactionButton:true})
    // }
  };

  deposit = ()=>{
    (async ()=>{
      try{

        const values = this.props.form.getFieldsValue()
        const { account, transactionAmount} = values
        var data = {
          owner: account,
          amount: Number(transactionAmount).toFixed(4) + ' ' + this.state.nowBaseSymbol
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'deposit',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        console.log('tr desposit', tx)
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()
  }

  withdraw =()=>{
    (async ()=>{
      try{

        const values = this.props.form.getFieldsValue()
        const { account, transactionAmount} = values
        var data = {
          owner: account,
          amount: Number(transactionAmount).toFixed(4) + ' ' + this.state.nowBaseSymbol
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'withdraw',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        console.log('tx withdraw', tx)

        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()
  }

  buyrex=()=>{
    if(!this.checkAccountStatus()) {
      return
    }
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { account, buyAccount} = values
        var data = {
          amount: Number(buyAccount).toFixed(4) + ' ' + this.state.nowBaseSymbol,
          from: account
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'buyrex',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        console.log('tx buyrex')
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  sellrex=()=>{
    if(!this.checkAccountStatus()) {
      return
    }
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { account, buyAccount} = values
        var data = {
          rex: Number(buyAccount).toFixed(4) + ' REX',
          from: account
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'sellrex',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        console.log('tx sellrex')
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  rentcpu=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { account, paymoneyamount, receivecpuaccount, resoursestoreMoney} = values
        var data = {
          from: account,
          receiver: receivecpuaccount,
          loan_payment: Number(paymoneyamount).toFixed(4) + ' ' + this.state.nowBaseSymbol,
          loan_fund: Number(resoursestoreMoney).toFixed(4) + ' ' + this.state.nowBaseSymbol
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'rentcpu',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  rentnet=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { account, paymoneyamount, receivecpuaccount, resoursestoreMoney} = values
        var data = {
          from: account,
          receiver: receivecpuaccount,
          loan_payment: Number(paymoneyamount).toFixed(4) + ' ' + this.state.nowBaseSymbol,
          loan_fund: Number(resoursestoreMoney).toFixed(4) + ' ' + this.state.nowBaseSymbol
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'rentnet',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  unstaketorex=()=>{
    if(!this.checkAccountStatus()) {
      return
    }
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { account, buyCPUAmount, buyNetAmount} = values
        // 2 is cpu and 3 is net
        if(this.state.choiceResourseType == 2) {
          var data = {
            owner: account,
            receiver: account,
            from_net: Number(buyNetAmount).toFixed(4) + ' ' + this.state.nowBaseSymbol || '0 ' + this.state.nowBaseSymbol,
            from_cpu: Number(buyCPUAmount).toFixed(4) + ' ' + this.state.nowBaseSymbol || '0 ' + this.state.nowBaseSymbol
          }
        }

        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'unstaketorex',
              authorization: [
                {
                  actor: account,
                  permission: 'active'
                }
              ],
              data
            }
          ]
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        console.log('tx unstaketorex')
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  accountBulr=()=>{
    (async ()=>{
      this.setState({
        accountData: '',
        accountMount: '',
        accountCpuMount: '',
        accountNetMount: ''
      })
      const values = this.props.form.getFieldsValue()
      const { account} = values
      for(let i = 0; i < config.netWorkConfig.length; i++) {
        if(config.netWorkConfig[i].networkName === this.props.SelectedNetWork) {
          var accountData = await GetNewRpc(config.netWorkConfig[i].Endpoint).get_account(account)
        }
      }
      this.getRexAmount(account) // 获得eos rex余额
      this.setState({
        accountData: accountData,
        accountMount: accountData.core_liquid_balance,
        accountCpuMount: accountData.total_resources.cpu_weight,
        accountNetMount: accountData.total_resources.net_weight
      })
    })()
  }

  checkAccountStatus=()=>{
    console.log('this.state.accountData。voter_info ', this.state.accountData)
    if(this.state.accountData.voter_info.producers.length < 21 && !this.state.accountData.voter_info.proxy) {
      this.setState({modalVisible: true})
      return false
    }
    return true
  }

  onChangeDepositType=(e)=>{
    this.setState({choiceDepositType: e.target.value})
  }

  depositHandle=()=>{
    if(this.state.choiceDepositType === 1) {
      this.deposit()
    }else{
      this.withdraw()
    }
  }

  onChangeBuySellRex=(e)=>{
    this.setState({choiceBuySellRex: e.target.value})
  }

  handleOk=()=>{
    const values = this.props.form.getFieldsValue()
    const { account} = values
    this.props.history.push({
      pathname: '/proxy',
      state: {
        accountname: account
      }
    })
  }

  buyAndSellrex=()=>{
    if(this.state.choiceBuySellRex === 1 && this.state.choiceResourseType === 1) {
      this.buyrex()
    }else if(this.state.choiceBuySellRex === 1 && this.state.choiceResourseType === 2) {
      this.unstaketorex()
    }else if(this.state.choiceBuySellRex === 2) {
      this.sellrex()
    }
  }

  onChangeType = (e) => {
    this.setState({
      resourseType: e.target.value
    })
  }

  onChangeResourseType = (e) => {
    this.setState({
      choiceResourseType: e.target.value
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const CreatorAccountNamePlaceholder = this.state.formatMessage(
      messages.CreatorAccountNamePlaceholder,
    )
    const ProposalFirstOne = this.state.formatMessage(messages.ProposalFirstOne)
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const RexPageEOSAmount = this.state.formatMessage(
      utilsMsg.RexPageEOSAmount,
    )
    const RexPageCPUAmount = this.state.formatMessage(
      utilsMsg.RexPageCPUAmount,
    )
    const RexPageNetAmount = this.state.formatMessage(
      utilsMsg.RexPageNetAmount,
    )
    const RexPageAccountManage = this.state.formatMessage(
      messages.RexPageAccountManage,
    )
    const RexPageStoreFund = this.state.formatMessage(
      messages.RexPageStoreFund,
    )
    const RexPageDeposit = this.state.formatMessage(
      messages.RexPageDeposit,
    )
    const RexPageWithdraw = this.state.formatMessage(
      messages.RexPageWithdraw,
    )
    const RexPageRexManage = this.state.formatMessage(
      messages.RexPageRexManage,
    )
    const RexPageMoneyAmount = this.state.formatMessage(
      messages.RexPageMoneyAmount,
    )
    const RexPageBuyrex = this.state.formatMessage(
      messages.RexPageBuyrex,
    )
    const RexPageSellrex = this.state.formatMessage(
      messages.RexPageSellrex,
    )
    const RexPageRent = this.state.formatMessage(
      messages.RexPageRent,
    )
    const RexPageRentResourse = this.state.formatMessage(
      messages.RexPageRentResourse,
    )
    const RexPageCancelStake = this.state.formatMessage(
      messages.RexPageCancelStake,
    )

    const RexPageResourseReceive = this.state.formatMessage(
      messages.RexPageResourseReceive,
    )
    const RexPageHandleTraction = this.state.formatMessage(
      messages.RexPageHandleTraction,
    )
    const RexPageModalAttention = this.state.formatMessage(
      messages.RexPageModalAttention,
    )
    const RexPageModalContent = this.state.formatMessage(
      messages.RexPageModalContent,
    )
    const RexPageDepositBalance = this.state.formatMessage(
      messages.RexPageDepositBalance,
    )
    const RexPageWithdrawBalance = this.state.formatMessage(
      messages.RexPageWithdrawBalance,
    )
    const RexPageRexAccountBalance = this.state.formatMessage(
      messages.RexPageRexAccountBalance,
    )
    const RexPageRexpayment = this.state.formatMessage(
      messages.RexPageRexpayment,
    )
    const RexPageStakedCpu = this.state.formatMessage(
      messages.RexPageStakedCpu,
    )
    const RexPageStakedNet = this.state.formatMessage(
      messages.RexPageStakedNet,
    )
    const RexPageBuyandSold = this.state.formatMessage(
      messages.RexPageBuyandSold,
    )
    const RexPageSoldAmount = this.state.formatMessage(
      messages.RexPageSoldAmount,
    )
    const RexPageCpuQuantity = this.state.formatMessage(
      messages.RexPageCpuQuantity,
    )
    const RexPageNetQuantity = this.state.formatMessage(
      messages.RexPageNetQuantity,
    )
    const RexPageRexPrice = this.state.formatMessage(
      messages.RexPageRexPrice,
    )
    const RexPageRexTotalAmount = this.state.formatMessage(
      messages.RexPageRexTotalAmount,
    )
    const RexPageRexNowAmount = this.state.formatMessage(
      messages.RexPageRexNowAmount,
    )
    const RexPageActionMethod = this.state.formatMessage(
      messages.RexPageActionMethod,
    )
    const RexPageMustRequired = this.state.formatMessage(
      messages.RexPageMustRequired,
    )
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    const CopyAlertFirstMessage = this.state.formatMessage(
      utilsMsg.CopyAlertFirstMessage,
    )
    const CopyAlertFirstDescription = this.state.formatMessage(
      utilsMsg.CopyAlertFirstDescription,
    )
    const CopyAlertFirstDescriptionLast = this.state.formatMessage(
      messages.CopyAlertFirstDescriptionLast,
    )
    return (
      <LayoutContent>
        <Col span={12}>
          <Card title={ProducersDealTranscation} bordered={false}>

            <div style={{border: '1px solid #91d5ff', padding: '10px 15px', backgroundColor: '#e6f7ff', borderRadius: '3px'}}>
              <span style={{display: 'block', lineHeight: '22px'}}>
                {CopyAlertFirstDescription}
              </span>
              <span style={{display: 'block', lineHeight: '22px'}}>
                {CopyAlertFirstDescriptionLast}
              </span>
            </div>
            <Tabs defaultActiveKey="1" onChange={this.callback} style={{marginTop: '10px'}}>
              <TabPane tab={RexPageAccountManage} key="1">
                <FormItem {...formItemLayout}>
                  <div style={{textAlign: 'center'}}>
                    {/* <span>操作方式：</span> */}
                    <RadioGroup onChange={this.onChangeDepositType} value={this.state.choiceDepositType}>
                      <Radio value={1}>{RexPageDeposit}</Radio>
                      <Radio value={2}>{RexPageWithdraw}</Radio>
                    </RadioGroup>
                  </div>
                </FormItem>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired,
                        validator: this.checkaccount
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      onBlur={this.accountBulr}
                      placeholder={CreatorAccountNamePlaceholder}
                    />,
                  )}
                </FormItem>
                {this.state.choiceDepositType === 1 ? (
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transactionAmount', {
                      rules: [
                        {
                          required: true,
                          message: RexPageMustRequired
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={RexPageDepositBalance}
                      />,
                    )}
                  </FormItem>
                ) : (
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transactionAmount', {
                      rules: [
                        {
                          required: true,
                          message: RexPageMustRequired
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={RexPageWithdrawBalance}
                      />,
                    )}
                  </FormItem>
                )}

                <FormItem>
                  <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button type="primary" onClick={this.depositHandle}>{RexPageHandleTraction}</Button>
                  </div>
                </FormItem>
              </TabPane>
              <TabPane tab={RexPageRexManage} key="2">
                <FormItem {...formItemLayout}>
                  <div style={{textAlign: 'center'}}>
                    {/* <span>操作方式：</span> */}
                    <RadioGroup onChange={this.onChangeBuySellRex} value={this.state.choiceBuySellRex}>
                      <Radio value={1}>{RexPageBuyrex}</Radio>
                      <Radio value={2}>{RexPageSellrex}</Radio>
                    </RadioGroup>
                  </div>
                </FormItem>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      onBlur={this.accountBulr}
                      placeholder={CreatorAccountNamePlaceholder}
                    />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout}>
                  <div>
                    <div>{RexPageRexPrice} : {this.state.rexPrice.toFixed(8) || 0} (EOS/REX)</div>
                    <div>{RexPageRexTotalAmount} : {this.state.totalRexNum || 0} EOS</div>
                  </div>
                  {!this.state.accountMount && !this.state.accountCpuMount && !this.state.accountNetMount ? null : (
                    <div>
                      <div>{RexPageEOSAmount} : <span >{this.state.accountMount}</span></div>
                      <div>{RexPageCPUAmount} : <span >{this.state.accountCpuMount}</span></div>
                      <div>{RexPageNetAmount} : <span >{this.state.accountNetMount}</span></div>
                      {/* {this.state.rexAmount?( */}
                      <div>{RexPageRexNowAmount} : <span>{this.state.rexAmount}</span></div>
                      {/* ):null} */}
                    </div>
                  )}
                  <div style={{marginTop: '13px'}}>
                    <span>{RexPageRexpayment}</span>&nbsp;
                    <RadioGroup onChange={this.onChangeResourseType} value={this.state.choiceResourseType}>
                      {this.state.choiceBuySellRex === 1 ? (
                        <div>
                          <Radio value={1}>{RexPageRexAccountBalance}</Radio>
                          <Radio value={2}>{RexPageStakedCpu}</Radio>
                        </div>
                      ) : (
                        <div>
                          <Radio value={1}>{RexPageRexNowAmount}</Radio>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                </FormItem>
                {this.state.choiceResourseType == 1 && this.state.choiceBuySellRex == 1 ? (
                  <div>
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('buyAccount', {
                        rules: [
                          {
                            required: true,
                            message: RexPageMustRequired
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          placeholder={RexPageBuyandSold}
                        />,
                      )}
                    </FormItem>
                    <FormItem>
                      <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <Button type="primary" onClick={this.buyAndSellrex}
                          disabled={this.state.buyRexByFundStatus}
                        >{RexPageHandleTraction}</Button>
                        {/* <Button type="primary" onClick={this.sellrex}>{RexPageSellrex}</Button> */}
                      </div>
                    </FormItem>
                  </div>
                ) : null}

                {this.state.choiceResourseType == 1 && this.state.choiceBuySellRex == 2 ? (
                  <div>
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('buyAccount', {
                        rules: [
                          {
                            required: true,
                            message: RexPageMustRequired
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          placeholder={RexPageSoldAmount}
                        />,
                      )}
                    </FormItem>
                    <FormItem>
                      <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <Button type="primary" onClick={this.buyAndSellrex}
                          disabled={this.state.buyRexByFundStatus}
                        >{RexPageHandleTraction}</Button>
                        {/* <Button type="primary" onClick={this.sellrex}>{RexPageSellrex}</Button> */}
                      </div>
                    </FormItem>
                  </div>
                ) : null}
                {/* 资源 */}
                {this.state.choiceResourseType == 2 ? (
                  <div>
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('buyCPUAmount', {
                        rules: [
                          {
                            required: true,
                            message: RexPageMustRequired
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          placeholder={RexPageCpuQuantity}
                        />,
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('buyNetAmount', {
                        rules: [
                          {
                            required: true,
                            message: RexPageMustRequired
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          placeholder={RexPageNetQuantity}
                        />,
                      )}
                    </FormItem>
                    <FormItem>
                      <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <Button type="primary" onClick={this.unstaketorex} >{RexPageHandleTraction}</Button>
                      </div>
                    </FormItem>
                  </div>
                ) : null}
              </TabPane>
              <TabPane tab={RexPageRent} key="3">
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={CreatorAccountNamePlaceholder}
                    />,
                  )}
                </FormItem>
                <FormItem>
                  <span>{RexPageRentResourse}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <RadioGroup onChange={this.onChangeType} value={this.state.resourseType}>
                    <Radio value={1}>CPU</Radio>
                    <Radio value={2}>NET</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('receivecpuaccount', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={RexPageResourseReceive}
                    />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('paymoneyamount', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={RexPageMoneyAmount}
                    />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('resoursestoreMoney', {
                    rules: [
                      {
                        required: true,
                        message: RexPageMustRequired
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={RexPageStoreFund}
                    />,
                  )}
                </FormItem>
                <FormItem>
                  <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button type="primary" onClick={this.handleGetTransaction}>{RexPageHandleTraction}</Button>
                  </div>
                </FormItem>
              </TabPane>
              {/* <TabPane tab={RexPageCancelStake} key="4">
               <FormItem {...formItemLayout}>
                {getFieldDecorator('denystake', {
                  rules: [
                    {
                      required: true,
                      message: CreatorAccountNamePlaceholder,
                      validator: this.checkaccount
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder={CreatorAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('cpu', {
                  rules: [
                    {
                      required: true,
                      message: "CPU",
                      validator: this.checkpermission
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder="CPU"
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('net', {
                  rules: [
                    {
                      required: true,
                      message: "NET",
                      validator: this.checkpermission
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder="NET"
                  />,
                )}
              </FormItem>
              <FormItem>
                  <div style={{display:"flex",justifyContent:"space-around"}}>
                    <Button type="primary" onClick={this.handleGetTransaction}>{RexPageHandleTraction}</Button>
                  </div>
                </FormItem>
            </TabPane> */}
            </Tabs>

            <NewDealGetQrcode
              eos={this.state.eos}
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              GetTransactionButtonClick={this.handleGetTransaction}
              GetTransactionButtonState={
                this.state.GetTransactionButtonState
              }
              QrCodeValue={this.state.QrCodeValue}
              SelectedNetWork={this.props.SelectedNetWork}
              transaction={this.state.transaction}
              newtransaction={this.state.newtransaction}
              voteByScatterClick={this.voteByScatter}
              scatterStatus={this.state.scatterStatus}
              GetTransactionButtonScatterState={
                this.state.GetTransactionButtonScatterState
              }
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={ProducersSendTranscation} bordered={false}>
            <NewScanQrcode
              eos={this.state.eos}
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              SelectedNetWork={this.props.SelectedNetWork}
              transaction={this.state.newtransaction}
              isHiddenGetTransactionButton={this.state.isHiddenGetTransactionButton}
            />
          </Card>
        </Col>
        <Modal
          title={RexPageModalAttention}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={()=>this.setState({modalVisible: false})}
        >
          <p>{RexPageModalContent}</p>

        </Modal>
      </LayoutContent>
    )
  }
}

RexPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const RexPageIntl = injectIntl(RexPage)
const RexPageForm = Form.create()(RexPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(RexPageForm)
