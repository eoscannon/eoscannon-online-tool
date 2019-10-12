
/*
 * DealGetQrcode
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Alert } from 'antd'
import QRCode from 'qrcode.react'
import copy from 'copy-to-clipboard'
import Fcbuffer from 'fcbuffer'
import config from './../../config'
import { storage } from '../../utils/storage'
import utilsMsg from '../../utils/messages'
import {
  openNotification,
  openTransactionSuccessNotification
} from '../../utils/utils'

const FormItem = Form.Item
const { TextArea } = Input

export default class DealGetQrcode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      QrCodeValue: '',
      CopyTransactionButtonState: false,
      oldTransaction: {},
      version: 1
    }
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.eos &&
      nextProps.transaction !== this.props.transaction &&
      !nextProps.scatterStatus
    ) {
      JSON.stringify(nextProps.transaction) === '{}' ? this.setState({QrCodeValue: ''}, this.props.form.setFieldsValue({ transactionTextArea: ''})) : this.setState({ eos: nextProps.eos }, this.getUnSignedBuffer)
    }

    if(nextProps.action === 'transfer') {
      const values = nextProps.form.getFieldsValue()
      const { ToAccountName, transferMemo, FromAccountName } = values
      let newToAccountName
      if(this.testKong(ToAccountName)) {
        newToAccountName = ToAccountName.split(' ')[0]
      }else{
        newToAccountName = ToAccountName
      }
      // console.log('nextprosp ==',nextProps)
      let data = {out: newToAccountName, memo: transferMemo}
      if(JSON.stringify(nextProps.transaction) !== '{}' && data !== nextProps.TransferForm[nextProps.TransferForm.length - 1] && JSON.stringify(this.state.oldTransaction) !== JSON.stringify(nextProps.transaction)) {
        let arr = nextProps.TransferForm
        arr.push(data)
        arr = this.unique(arr)
        storage.setTransferForm(arr)
        let array = nextProps.FromAccount
        array.push(FromAccountName)
        array = this.uniqueArr(array)
        storage.setFromAccount(array)
        this.setState({
          oldTransaction: nextProps.transaction
        })
      }
    }
  }

  // 对象类型去重
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
 // 简单数组去重
 uniqueArr= (array) => {
   // res用来存储结果
   var res = []
   for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
     for (var j = 0, resLen = res.length; j < resLen; j++) {
       if (array[i] === res[j]) {
         break
       }
     }
     // 如果array[i]是唯一的，那么执行完循环，j等于resLen
     if (j === resLen) {
       res.push(array[i])
     }
   }
   return res
 }

 // 排除空字段
  testKong = (FromAccountName) =>{
    var reg = /(^\s+)|(\s+$)|\s+/g
    return reg.test(FromAccountName)
  }

  // 生成报文
  getUnSignedBuffer = () => {
    let chainId
    for(let i = 0; i < config.netWorkConfig.length; i++) {
      if(this.props.SelectedNetWork === config.netWorkConfig[i].networkName && config.netWorkConfig[i].chainId) {
        chainId = config.netWorkConfig[i].chainId
      }
    }
    let reg = new RegExp('https')
    if(reg.test(this.props.SelectedNetWork) || this.props.SelectedNetWork === 'other') {
      chainId = storage.getChainId()
    }

    console.log('chainId', chainId)
    let buf = ''
    if(this.props.version == 2) {
      buf = new Buffer(this.props.transaction.serializedTransaction)
    }else{
      buf = Fcbuffer.toBuffer(
        this.state.eos.fc.structs.transaction,
        this.props.transaction.transaction,
      )
    }
    const chainIdBuf = Buffer.from(chainId, 'hex')
    const UnSignedBuffer = Buffer.concat([
      chainIdBuf,
      buf,
      Buffer.from(new Uint8Array(32))
    ])
    const hexStr = UnSignedBuffer.toString('hex')

    this.props.form.setFieldsValue({
      transactionTextArea: JSON.stringify(this.props.transaction.transaction)
    })
    this.setState({
      QrCodeValue: hexStr,
      CopyTransactionButtonState: true
    })
    openTransactionSuccessNotification(this.props.formatMessage)
  };

  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.props.GetTransactionButtonState) {
      return
    }
    copy(JSON.stringify(this.props.transaction))
    openNotification(this.props.formatMessage)
  };

  render () {
    const { getFieldDecorator } = this.props.form
    const GetTransactionButtonName = this.props.formatMessage(
      utilsMsg.GetTransactionFormItemButtonName,
    )
    const CopyAlertMessage = this.props.formatMessage(
      utilsMsg.CopyAlertMessage,
    )
    const CopyAlertDescription = this.props.formatMessage(
      utilsMsg.CopyAlertDescription,
    )
    const TransactionTextAreaPlaceholder = this.props.formatMessage(
      utilsMsg.TransactionTextAreaPlaceholder,
    )
    const CopyTransactionButtonName = this.props.formatMessage(
      utilsMsg.CopyTransactionButtonName,
    )
    const CopyOwnerAlertDescription = this.props.formatMessage(
      utilsMsg.CopyOwnerAlertDescription,
    )
    const CopyOwnerAlertDescriptionFirst = this.props.formatMessage(
      utilsMsg.CopyOwnerAlertDescriptionFirst,
    )
    const CopyOwnerAlertDescriptionLast = this.props.formatMessage(
      utilsMsg.CopyOwnerAlertDescriptionLast,
    )
    const scatterSignature = this.props.formatMessage(
      utilsMsg.scatterSignature,
    )
    let specialStatusCompontent = false
    try {
      specialStatusCompontent = this.props.specialStatus === 'updateAuth'
    } catch (err) {
      specialStatusCompontent = false
    }
    return (
      <div>
        {!this.props.isHiddenGetTransactionButton && (
          <FormItem style={{ textAlign: 'center' }}>
            &nbsp;&nbsp;&nbsp;
            {this.props.scatterStatus ? (
              <Button
                type="primary"
                className="form-button"
                disabled={!this.props.GetTransactionButtonScatterState}
                onClick={this.props.voteByScatterClick}
              >
                {scatterSignature}
              </Button>
            ) : (
              <Button
                type="primary"
                className="form-button"
                onClick={this.props.GetTransactionButtonClick}
                disabled={!this.props.GetTransactionButtonState}
              >
                {GetTransactionButtonName}
              </Button>
            )}
          </FormItem>
        )}
        {this.props.scatterStatus ? null : (
          <div>
            <FormItem >
              {specialStatusCompontent ? (
                <div style={{border: '1px solid #91d5ff', padding: '10px 15px', backgroundColor: '#e6f7ff', borderRadius: '3px'}}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold'}}>{CopyAlertMessage}</div>
                  <span style={{display: 'block', lineHeight: '22px'}}>{CopyOwnerAlertDescriptionFirst}<span style={{fontWeight: 'bold', color: 'red'}}>Owner</span>{CopyOwnerAlertDescriptionLast}</span>
                </div>
              ) : (
                <Alert
                  message={CopyAlertMessage}
                  description={CopyAlertDescription}
                  type="info"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('transactionTextArea', {
                rules: [
                  { required: true, message: TransactionTextAreaPlaceholder }
                ]
              })(
                <TextArea
                  disabled
                  autosize={{ minRows: 4, maxRows: 12 }}
                  placeholder={TransactionTextAreaPlaceholder}
                />,
              )}
            </FormItem>
            {this.state.QrCodeValue === '' ? null : (
              <div>
                <FormItem>
                  <div style={{ textAlign: 'center' }}>
                    <QRCode
                      value={this.state.QrCodeValue}
                      size={256}
                      style={{ transform: ' rotate(270deg)' }}
                    />
                  </div>
                </FormItem>
                <FormItem style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    className="form-button"
                    disabled={!this.state.CopyTransactionButtonState}
                    onClick={this.handleCopyTransaction}
                  >
                    {CopyTransactionButtonName}
                  </Button>
                </FormItem>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

DealGetQrcode.propTypes = {
  eos: PropTypes.object,
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  GetTransactionButtonClick: PropTypes.func,
  GetTransactionButtonState: PropTypes.bool,
  transaction: PropTypes.object,
  QrCodeValue: PropTypes.string,
  SelectedNetWork: PropTypes.string,
  isHiddenGetTransactionButton: PropTypes.bool,
  GetTransactionButtonScatterState: PropTypes.bool
}
