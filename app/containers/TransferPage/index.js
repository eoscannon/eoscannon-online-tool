/*
 * TransferPage
 *
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  Form,
  Icon,
  Input,
  Select,
  Card,
  Col,
  Row,
  message,
  Tooltip,
  AutoComplete
} from 'antd'
import eosioAbi from './abi'
import eosIqAbi from './iqAbi'
import adcAbi from './adcAbi'
import {
  formItemLayout,
  getEos,
  symbolList,
  symbolListWorbli,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'
import { storage } from '../../utils/storage'
import { makeSelectNetwork } from '../LanguageProvider/selectors'

const FormItem = Form.Item
const { Option } = Select

export class TransferPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      addSymbol: false,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      contract: 'eosio.token',
      number: '',
      symbol: '',
      code: '',
      dataSource: [],
      transferSymbolSelect: '',
      TransferForm: [], //   本地账号数据
      FromAccount:[],
      selectLanguage: 'main'
    }
  }
  // init page
  componentDidMount () {
    //获取URL 参数
   if( this.props.location.search ){
    this.setState({addSymbol : true})
    const query = this.props.location.search 

    const arr = query.split('?')[1].split('&') // ['?s=', 'f=7']
    var newArr = {}
    for(let i in arr){
      let data = arr[i].split('=')
      newArr[data[0]] = data[1]
    }

    // 接收到数据后插入表格
    try{
      this.props.form.setFieldsValue({
        FromAccountName:newArr.from,
        ToAccountName:newArr.to,
        transferQuantity:newArr.amount,
        transferMemo:newArr.memo,
       })
    }catch(err){
      console.log('err === ',err)
    }
   
    setTimeout(()=>{
      try{
        this.props.form.setFieldsValue({
          transferSymbolCustom: newArr.token,
          transferContractCustom: newArr.contract,
          transferDigitCustom:  4
        })
        let digt = newArr.amount.split('.')[1].length
        this.props.form.setFieldsValue({
          transferDigitCustom: digt || 4
        })
        }catch(err){
          console.log('err == ',err)
        }
      },500)
   }
  
   //从account search page来的参数获取
    if (this.props.location.state) {
      console.log('this.props.location.state== ',this.props.location.state)
      const state = this.props.location.state.name.split(' ')
      var len
      try{
        len = state[0].split('.')[1].length
      }catch(err) {
        console.log('err:', err)
        len = 0
      }
      this.setState({
        selectLanguage: this.props.SelectLanguage
      })

      // const state = this.props.location.state.name.split(' ')
      setTimeout(() => {
        if (state[1] === 'EOS') {
          this.props.form.setFieldsValue({
            FromAccountName: this.props.location.state.account,
            transferQuantity: state[0]
          })
        } else {
          this.setState({
            addSymbol: true
          })
          this.props.form.setFieldsValue({
            FromAccountName: this.props.location.state.account,
            transferSymbolCustom: state[1],
            transferQuantity: state[0],
            transferDigitCustom: len,
            transferContractCustom: this.props.location.state.address
          })
        }
      }, 300)
    }
    if(storage.getTransferForm()) {
      this.setState({
        TransferForm: storage.getTransferForm() || [],
        FromAccount: storage.getFromAccount() || []
      })
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
    if(nextProps.SelectLanguage !== this.props.SelectLanguage) {
      this.setState({
        selectLanguage: nextProps.SelectLanguage
      })
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { FromAccountName, ToAccountName, transferQuantity } = values
    this.setState({
      GetTransactionButtonState:
        !!FromAccountName && !!ToAccountName && !!transferQuantity
    })
    // let oldValue = this.props.form.getFieldsValue()
    // if(transferQuantity && oldValue.transferQuantity !== transferQuantity){
    //   let item = transferQuantity.replace(/\,/g, "");
    //   // this.props.form.setFieldsValue({transferQuantity: item})
    // }
  };

  toggle = () => {
    this.setState({
      addSymbol: !this.state.addSymbol
    })
  };

  onSelect = (value) => {
    let data = value.split(' ')
    this.props.form.setFieldsValue({
      transferMemo: data[1],
      ToAccountName: data[0]
    })
  }
  onSelectFromAccount = (value) =>{
    this.props.form.setFieldsValue({
      FromAccountName: value
    })
  }

  setTransferForm = (TransferForm) =>{
    this.setState({
      TransferForm: TransferForm,
    })
  }

  // 排除空字段
  testKong = (FromAccountName) =>{
    var reg = /(^\s+)|(\s+$)|\s+/g
    return reg.test(FromAccountName)
  }
  
  // 自定义交易 func
  handleCustomTransaction = eos => {
    const values = this.props.form.getFieldsValue()
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      // transferSymbol,
      transferSymbolCustom,
      transferContractCustom,
      transferDigitCustom
    } = values

    var newToAccountName
    if(this.testKong(ToAccountName)) {
      newToAccountName = ToAccountName.split(' ')[0]
    }else{
      newToAccountName = ToAccountName
    }
    if (
      !transferSymbolCustom ||
      !transferContractCustom ||
      transferDigitCustom === '' ||
      transferDigitCustom === undefined
    ) {
      message.warning(this.state.formatMessage(messages.SymbolAttentionInfo))
      return
    }
 
    // 判断是否为自定义symbol
    eos
      .getAbi(transferContractCustom.toLowerCase())
      .then(res => {
        eos.fc.abiCache.abi(transferContractCustom, res.abi)
      })
      .catch(err => {
        message.error(`${err}`)
      })
    eos
      .transaction(
        {
          actions: [
            {
              account: transferContractCustom,
              name: 'transfer',
              authorization: [
                {
                  actor: FromAccountName,
                  permission: 'active'
                }
              ],
              data: {
                from: FromAccountName,
                to: newToAccountName,
                quantity: `${Number(transferQuantity).toFixed(
                  Number(transferDigitCustom),
                )} ${transferSymbolCustom.toUpperCase()}`,
                memo: transferMemo || ''
              }
            }
          ]
        },
        {
          sign: false,
          broadcast: false
        },
      )
      .then(tr => {
        this.setState({
          eos,
          transaction: tr.transaction
        })
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };
  /**
   * 使用scatter投票
   * */
  voteByScatter = eos => {
    // const eos = global.EosByScatter;
    const account = global.AccountByScatter
    const values = this.props.form.getFieldsValue()
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      // transferSymbol,
      transferSymbolCustom,
      transferContractCustom,
      transferDigitCustom
    } = values
    // 判断是否为自定义symbol
    eos
      .getAbi(transferContractCustom.toLowerCase())
      .then(res => {
        eos.fc.abiCache.abi(transferContractCustom, res.abi)
      })
      .catch(err => {
        message.error(`${err}`)
      })
    eos
      .voteproducer({
        actions: [
          {
            account: transferContractCustom,
            name: 'transfer',
            authorization: [`${account.name}@${account.authority}`],
            data: {
              from: FromAccountName,
              to: ToAccountName,
              quantity: `${Number(transferQuantity).toFixed(
                Number(transferDigitCustom),
              )} ${transferSymbolCustom.toUpperCase()}`,
              memo: transferMemo || ''
            }
          }
        ]
      })
      .then(tr => {
        console.log(tr)
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransactionByScatter = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = global.EosByScatter
    const account = global.AccountByScatter
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      transferSymbol
    } = values
    let transferDigit = 4
    // let transferContract;
    if (this.state.addSymbol) {
      this.voteByScatter(eos)
      return
    }
    const transferContract = this.state.contract

    if (
      transferContract !== 'eosio' &&
      transferContract !== 'eosio.token'
    ) {
      if (transferContract.toUpperCase() === 'EVERIPEDIAIQ') {
        transferDigit = 3
        eos.fc.abiCache.abi(transferContract, eosIqAbi)
      } else if (transferContract.toUpperCase() === 'CHALLENGEDAC') {
        eos.fc.abiCache.abi(transferContract, adcAbi)
      } else {
        eos.fc.abiCache.abi(transferContract, eosioAbi)
      }
    }
    eos
      .transaction(
        {
          actions: [
            {
              account: transferContract,
              name: 'transfer',
              authorization: [
                {
                  actor: FromAccountName,
                  permission: 'active'
                }
              ],
              data: {
                from: FromAccountName,
                to: ToAccountName,
                quantity: `${Number(transferQuantity).toFixed(
                  Number(transferDigit),
                )} ${transferSymbol.label.toUpperCase()}`,
                memo: transferMemo || ''
              }
            }
          ]
        },
        { authorization: [`${account.name}@${account.authority}`] },
      )
      .then(tr => {
        console.log('tr.transaction==', tr.transaction)
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      transferSymbol
    } = values
    let transferDigit = 4
    // let transferContract;
    var itemQuantity = transferQuantity.replace(/,/g, "");
    this.props.form.setFieldsValue({transferQuantity: itemQuantity})

    if (this.state.addSymbol) {
      this.handleCustomTransaction(eos)
      return
    }
    let firstSymbol = transferSymbol.split('(')
    var newContract = firstSymbol[1].split(')')
    var newSymbol = transferSymbol.split(' ')
    this.setState({
      contract: newContract[0]
    })

    var newToAccountName
    if(this.testKong(ToAccountName)) {
      newToAccountName = ToAccountName.split(' ')[0]
    }else{
      newToAccountName = ToAccountName
    }
    const transferContract = newContract[0].trim()
    if (
      newContract[0] !== 'eosio' &&
      newContract[0] !== 'eosio.token'
    ) {
      if (transferContract.toUpperCase() === 'EVERIPEDIAIQ') {
        transferDigit = 3
        eos.fc.abiCache.abi(transferContract, eosIqAbi)
      } else if (transferContract.toUpperCase() === 'CHALLENGEDAC') {
        eos.fc.abiCache.abi(transferContract, adcAbi)
      } else {
        eos.fc.abiCache.abi(transferContract, eosioAbi)
      }
    }


    eos
      .transaction(
        {
          actions: [
            {
              account: transferContract,
              name: 'transfer',
              authorization: [
                {
                  actor: FromAccountName,
                  permission: 'active'
                }
              ],
              data: {
                from: FromAccountName,
                to: newToAccountName,
                quantity: `${Number(itemQuantity).toFixed(
                  Number(transferDigit),
                )} ${newSymbol[0].toUpperCase()}`,
                memo: transferMemo || ''
              }
            }
          ]
        },
        {
          sign: false,
          broadcast: false
        },
      )
      .then(tr => {
        console.log('tr.transaction==', tr.transaction)
        this.setState({
          eos,
          transaction: tr.transaction
        })
      })
      .catch(err => {
        console.log('err', err)
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  // 去重
  unique=(arr)=> {
    var result = {}
    var finalResult = []
    for(let i = 0; i < arr.length;i++) {
      result[arr[i].out] = arr[i]
    }
    for(let item in result) {
      finalResult.push(result[item])
    }
    return finalResult
  }

  checkFromAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({FromAccountName : value})
    callback();
    return
  }

  checkToAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({ToAccountName : value})
    callback();
    return
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const TransferFromAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferFromAccountNamePlaceholder,
    )
    const TransferToAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferToAccountNamePlaceholder,
    )
    const TransferQuantityPlaceholder = this.state.formatMessage(
      messages.TransferQuantityPlaceholder,
    )
    const TransferSymbolPlaceholder = this.state.formatMessage(
      messages.TransferSymbolPlaceholder,
    )
    const TransferMemoPlaceholder = this.state.formatMessage(
      messages.TransferMemoPlaceholder,
    )
    const SymbolCustom = this.state.formatMessage(messages.SymbolCustom)
    const TransferSymbolHolder = this.state.formatMessage(
      messages.TransferSymbolHolder,
    )
    const TransferContractHolder = this.state.formatMessage(
      messages.TransferContractHolder,
    )
    const TransferDigitHolder = this.state.formatMessage(
      messages.TransferDigitHolder,
    )
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const transfer = this.state.formatMessage(utilsMsg.HeaderMenuTransfer)

    const children = symbolList.map(item => (
      <Option key={item.symbol + ' (' + item.contract + ')'} label={item.contract}>{item.symbol} ({item.contract})</Option>
    ))
    const childrenTest = symbolListWorbli.map(item => (
      <Option key={item.symbol + ' (' + item.contract + ')'} label={item.contract}>{item.symbol} ({item.contract})</Option>
    ))

    var {TransferForm ,FromAccount} = this.state
    TransferForm = this.unique(TransferForm)
    const childrenAccount = TransferForm.map((data, index) => (
      <Option key={data.out + ' ' + data.memo}>{data.out}</Option>
    ))
    const AccountFrom = FromAccount.map((data, index) => (
      <Option key={data}>{data}</Option>
    ))

    return (
      <LayoutContent>
        <Row gutter={16}>
          <Col span={12}>
            <Card title={ProducersDealTranscation+"("+transfer+")"} bordered={false}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('FromAccountName', {
                  rules: [
                    {
                      required: true,
                      message: TransferFromAccountNamePlaceholder,
                      validator: this.checkFromAccountName
                    }
                  ]
                })(
                  <AutoComplete
                    onSelect={this.onSelectFromAccount}
                    style={{ width: '100%' }}
                    dataSource={AccountFrom}
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  >
                  <Input
                    maxLength={12}
                    prefix={
                      <Tooltip
                        placement="top"
                        title={TransferFromAccountNamePlaceholder}
                      >
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      </Tooltip>
                    }
                    placeholder={TransferFromAccountNamePlaceholder}
                  />
                  </AutoComplete>,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('ToAccountName', {
                  rules: [
                    {
                      required: true,
                      message: TransferToAccountNamePlaceholder,
                      validator: this.checkToAccountName 
                    }
                  ]
                })(
                  <AutoComplete
                    onSelect={this.onSelect}
                    style={{ width: '100%' }}
                    dataSource={childrenAccount}
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  >
                    <Input
                      maxLength={12}
                      prefix={
                        <Tooltip
                          placement="top"
                          title={TransferToAccountNamePlaceholder}
                        >
                          <Icon
                            type="user"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        </Tooltip>
                      }
                      placeholder={TransferToAccountNamePlaceholder}
                    />
                  </AutoComplete>

                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('transferQuantity', {
                  rules: [
                    { required: true, message: TransferQuantityPlaceholder }
                  ]
                })(
                  <Input
                    prefix={
                      <Tooltip
                        placement="top"
                        title={TransferQuantityPlaceholder}
                      >
                        <Icon
                          type="pay-circle-o"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      </Tooltip>
                    }
                    placeholder={TransferQuantityPlaceholder}
                  />,
                )}
              </FormItem>
              {this.props.SelectedNetWork === 'worbli' ? (
                <FormItem {...formItemLayout} style={{ margin: 0 }}>
                  <div
                    style={{ visibility: this.state.addSymbol ? 'hidden' : '' }}
                  >
                    {getFieldDecorator('transferSymbol', {
                      initialValue: 'eos (eosio.token)',
                      rules: [
                        { required: true, message: TransferSymbolPlaceholder }
                      ]
                    })(
                      <AutoComplete
                        dataSource={childrenTest}
                        placeholder={TransferSymbolHolder}
                        optionLabelProp="value"
                        style={{ width: '100%' }}
                        filterOption={(inputValue, option) => option.props.children[0].toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      />
                    )}
                  </div>
                  <span
                    role="article"
                    style={{ marginLeft: 8, fontSize: 12 }}
                    onClick={this.toggle}
                    aria-hidden="true"
                  >
                    {SymbolCustom}{' '}
                    <Tooltip placement="top" title={TransferQuantityPlaceholder}>
                      <Icon type={this.state.addSymbol ? 'up' : 'down'} />
                    </Tooltip>
                  </span>
                </FormItem>
              ) : (
                <FormItem {...formItemLayout} style={{ margin: 0 }}>
                  <div
                    style={{ visibility: this.state.addSymbol ? 'hidden' : '' }}
                  >
                    {getFieldDecorator('transferSymbol', {
                      initialValue: 'eos (eosio.token)',
                      rules: [
                        { required: true, message: TransferSymbolPlaceholder }
                      ]
                    })(
                      <AutoComplete
                        dataSource={children}
                        placeholder={TransferSymbolHolder}
                        optionLabelProp="value"
                        style={{ width: '100%' }}
                        filterOption={(inputValue, option) => option.props.children[0].toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      />
                    )}
                  </div>
                  <span
                    role="article"
                    style={{ marginLeft: 8, fontSize: 12 }}
                    onClick={this.toggle}
                    aria-hidden="true"
                  >
                    {SymbolCustom}{' '}
                    <Tooltip placement="top" title={TransferQuantityPlaceholder}>
                      <Icon type={this.state.addSymbol ? 'up' : 'down'} />
                    </Tooltip>
                  </span>
                </FormItem>
              )}
              {this.state.addSymbol ? (
                <div>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferSymbolCustom', {
                      rules: [
                        { required: true, message: TransferSymbolHolder }
                      ]
                    })(
                      <Input
                        prefix={
                          <Tooltip placement="top" title={TransferSymbolHolder}>
                            <Icon
                              type="pay-circle-o"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          </Tooltip>
                        }
                        placeholder={TransferSymbolHolder}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferContractCustom', {
                      rules: [
                        { required: true, message: TransferContractHolder }
                      ]
                    })(
                      <Input
                        prefix={
                          <Tooltip
                            placement="top"
                            title={TransferContractHolder}
                          >
                            <Icon
                              type="pay-circle-o"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          </Tooltip>
                        }
                        placeholder={TransferContractHolder}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferDigitCustom', {
                      rules: [{ required: true, message: TransferDigitHolder }]
                    })(
                      <Input
                        prefix={
                          <Tooltip placement="top" title={TransferDigitHolder}>
                            <Icon
                              type="pay-circle-o"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          </Tooltip>
                        }
                        placeholder={TransferDigitHolder}
                      />,
                    )}
                  </FormItem>
                </div>
              ) : null}
              <FormItem {...formItemLayout}>
                {getFieldDecorator('transferMemo', {
                  rules: [
                    { required: false, message: TransferMemoPlaceholder }
                  ]
                })(
                  <Input
                    prefix={
                      <Tooltip placement="top" title={TransferMemoPlaceholder}>
                        <Icon
                          type="pay-circle-o"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      </Tooltip>
                    }
                    placeholder={TransferMemoPlaceholder}
                  />,
                )}
              </FormItem>
              <DealGetQrcode
                action="transfer"
                TransferForm={this.state.TransferForm}
                FromAccount={this.state.FromAccount}
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                QrCodeValue={this.state.QrCodeValue}
                transaction={this.state.transaction}
                SelectedNetWork={this.props.SelectedNetWork}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={ProducersSendTranscation} bordered={false}>
              <ScanQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
              />
            </Card>
          </Col>
        </Row>
      </LayoutContent>
    )
  }
}

TransferPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const TransferPageIntl = injectIntl(TransferPage)
const TransferPageForm = Form.create()(TransferPageIntl)
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(TransferPageForm)
