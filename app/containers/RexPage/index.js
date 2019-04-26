/*
 * RexPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Button, Modal, Tabs, Select ,Radio } from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { makeSelectNetwork } from '../LanguageProvider/selectors'
import {
  formItemLayout,
  getNewApi,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

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
      GetTransactionButtonScatterState: true,
      newtransaction:{},
      resourseType:'',
      tabsKey: "1",
      isHiddenGetTransactionButton: false
    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () {}
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { rentcpuaccount, paymoneyamount,receivecpuaccount ,resoursestoreMoney} = values
    this.setState({
      GetTransactionButtonState: !!rentcpuaccount && !!paymoneyamount && !!receivecpuaccount && !!resoursestoreMoney })
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
        if(this.state.tabsKey === "3" && this.state.resourseType == 1){
          this.rentcpu()
          return;
        }else if(this.state.tabsKey === "3" && this.state.resourseType == 2){
          this.rentnet()
          return;
        }
        //
        const values = this.props.form.getFieldsValue()
        const { account, permission, proposer, proposalName} = values
        var data = {
          owner: account,
          amount: amount,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()

  };

  checkaccount = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({account : value})
    callback();
    return
  }

  checkpermission = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({permission : value})
    callback();
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
        // if (!this.state.GetTransactionButtonState) {
        //   return
        // }
        const values = this.props.form.getFieldsValue()
        const { account, transactionAmount} = values
        var data = {
          owner: account,
          amount: Number(transactionAmount).toFixed(4)+' EOS',
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        console.log('tr ',tx)
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
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
          amount: Number(transactionAmount).toFixed(4)+' EOS',
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()
  }

  buyrex=()=>{
    (async ()=>{
      try{
        // this.setState({ scatterStatus: false })
        // if (!this.state.GetTransactionButtonState) {
        //   return
        // }
        const values = this.props.form.getFieldsValue()
        const { accountBuyRex, buyAccount} = values
        var data = {
          amount: Number(buyAccount).toFixed(4)+" EOS",
          from: accountBuyRex
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'buyrex',
              authorization: [
                {
                  actor: accountBuyRex,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }
  sellrex=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { accountBuyRex, buyAccount} = values
        var data = {
          rex: Number(buyAccount).toFixed(4)+" REX",
          from: accountBuyRex
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'sellrex',
              authorization: [
                {
                  actor: accountBuyRex,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  rentcpu=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { rentcpuaccount, paymoneyamount,receivecpuaccount ,resoursestoreMoney} = values
        var data = {
          from: rentcpuaccount,
          receiver: receivecpuaccount,
          loan_payment:  Number(paymoneyamount).toFixed(4)+ ' EOS',
          loan_fund: Number(resoursestoreMoney).toFixed(4)+' EOS',
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'rentcpu',
              authorization: [
                {
                  actor: rentcpuaccount,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  rentnet=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { rentcpuaccount, paymoneyamount,receivecpuaccount ,resoursestoreMoney} = values
        var data = {
          from: rentcpuaccount,
          receiver: receivecpuaccount,
          loan_payment:  Number(paymoneyamount).toFixed(4)+ ' EOS',
          loan_fund: Number(resoursestoreMoney).toFixed(4)+' EOS',
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'rentnet',
              authorization: [
                {
                  actor: rentcpuaccount,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  unstaketorex=()=>{
    (async ()=>{
      try{
        const values = this.props.form.getFieldsValue()
        const { accountBuyRex, buyAccount} = values
        var data = {
          amount: Number(buyAccount).toFixed(4)+" EOS",
          from: accountBuyRex
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio',
              name: 'unstaketorex',
              authorization: [
                {
                  actor: accountBuyRex,
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
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  }

  onChangeType = (e) => {
    this.setState({
      resourseType: e.target.value,
    });
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
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    return (
      <LayoutContent>
        <Col span={12}>
          <Card title={ProducersDealTranscation} bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab={RexPageAccountManage} key="1">
              <FormItem {...formItemLayout}>
                {getFieldDecorator('account', {
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
                {getFieldDecorator('transactionAmount', {
                  rules: [
                    {
                      required: true,
                      message: "",
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
                <div style={{display:"flex",justifyContent:"space-around"}}>
                  <Button type="primary" onClick={this.deposit}>{RexPageDeposit}</Button>
                  <Button type="primary" onClick={this.withdraw}>{RexPageWithdraw}</Button>
                </div>
              </FormItem>

            </TabPane>
            <TabPane tab={RexPageRexManage} key="2">
              <FormItem {...formItemLayout}>
                  {getFieldDecorator('accountBuyRex', {
                    rules: [
                      {
                        required: true,
                        message: CreatorAccountNamePlaceholder,
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
                  {getFieldDecorator('buyAccount', {
                    rules: [
                      {
                        required: true,
                        message: {RexPageMoneyAmount},
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
              <FormItem>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                  <Button type="primary" onClick={this.buyrex}>{RexPageBuyrex}</Button>
                  <Button type="primary" onClick={this.sellrex}>{RexPageSellrex}</Button>
                </div>
              </FormItem>
            </TabPane>
            <TabPane tab={RexPageRent} key="3">
              <FormItem {...formItemLayout}>
                  {getFieldDecorator('rentcpuaccount', {
                    rules: [
                      {
                        required: true,
                        message: CreatorAccountNamePlaceholder,
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
                        message: {RexPageResourseReceive},
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
                      message: "",
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
                      message: "",
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
                  <div style={{display:"flex",justifyContent:"space-around"}}>
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
