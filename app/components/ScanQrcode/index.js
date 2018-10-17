/*
 * ScanQrcode
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Alert, Modal } from 'antd'
import { BrowserQRCodeReader } from '../../utils/zxing.qrcodereader.min'
import utilsMsg from '../../utils/messages'
import { getEos } from '../../utils/utils'

const FormItem = Form.Item
const { TextArea } = Input

export default class ScanQrcode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      VideoElement: null,
      OpenCameraButtonState: false,
      SendTransaction: '',
      newSendTransaction: '',
      SendTransactionButtonState: false,
      codeReader: {},
      buttonStatus: true
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    if (nextProps.transaction !== this.props.transaction) {
      this.setState({
        SendTransaction: nextProps.transaction,
        newSendTransaction: nextProps.transaction,
        OpenCameraButtonState: JSON.stringify(nextProps.transaction) !== '{}'
      })
    }
  }

  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  handleOpenCamera = () => {
    this.setState({
      VideoElement: (
        <FormItem>
          <video id="video" width="100%" height="200" style={{ width: '100%' }}>
            <track kind="captions" />
          </video>
        </FormItem>
      ),
      buttonStatus: false
    })
    this.props.form.setFieldsValue({
      SendTransaction: ''
    })
    this.handleScanQrcode()
  };

  handleCloseCamera = () => {
    this.setState({
      codeReader: this.state.codeReader.reset(),
      buttonStatus: true
    })
  };

  handleScanQrcode = () => {
    const codeReader = new BrowserQRCodeReader()
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      codeReader
        .decodeFromInputVideoDevice(videoInputDevices[0].deviceId, 'video')
        .then(result => {
          this.getSendSignTransaction(result.text)
        })
    })
    this.setState({
      codeReader
    })
  };

  getSendSignTransaction = sig => {
    const output = {
      compression: 'none',
      transaction: this.state.SendTransaction.transaction,
      signatures: [sig]
    }
    this.state.SendTransaction = output
    this.props.form.setFieldsValue({
      SendTransaction: JSON.stringify(this.state.SendTransaction)
    })
    this.setState({
      SendTransaction: this.state.SendTransaction
      // SendTransactionButtonState: true,
    })
  };

  handleSendSignTransaction = () => {
    let values
    this.props.form.validateFields((err, val) => {
      if (
        val.SendTransaction.indexOf('SIG_') !== -1 &&
        val.SendTransaction.indexOf('{') === -1
      ) {
        values = {
          compression: 'none',
          transaction: this.state.newSendTransaction.transaction,
          signatures: [val.SendTransaction]
        }
      } else if (val.SendTransaction.indexOf('{') !== -1) {
        values = this.state.SendTransaction
      } else {
        Modal.warning({
          title: '',
          content: this.props.formatMessage(utilsMsg.JsonAlertAttentionArt)
        })
        values = false
      }
    })
    if (values === false) {
      return
    }
    const eos = getEos(this.props.SelectedNetWork)
    eos
      .pushTransaction(values)
      .then(res => {
        Modal.success({
          title: this.props.formatMessage(utilsMsg.ScanCodeSendSuccess),
          content: `${this.props.formatMessage(
            utilsMsg.ScanCodeSendSuccessMessage,
          )} ${res.transaction_id}`,
          okText: this.props.formatMessage(utilsMsg.ScanCodeSendGetIt)
        })
        // 发送成功后关闭摄像头
        try {
          this.setState({
            codeReader: this.state.codeReader.reset(),
            buttonStatus: true
          })
        } catch (error) {
          console.log('error====', error)
        }
      })
      .catch(err => {
        Modal.error({
          title: this.props.formatMessage(utilsMsg.ScanCodeSendFailed),
          content: `${err}`,
          okText: this.props.formatMessage(utilsMsg.ScanCodeSendGetIt)
        })
        // 发送成功后关闭摄像头
        try {
          this.setState({
            codeReader: this.state.codeReader.reset(),
            buttonStatus: true
          })
        } catch (error) {
          console.log('error====', error)
        }
      })
  };
  render () {
    const { getFieldDecorator } = this.props.form
    const message = this.props.formatMessage(utilsMsg.JsonAlertMessage)
    const description = this.props.formatMessage(utilsMsg.JsonAlertDescription)
    const closeCamera = this.props.formatMessage(utilsMsg.JsonAlertcloseCamera)
    // const haveCamera = this.props.formatMessage(utilsMsg.JsonAlerthaveCamera);
    // const noneCamera = this.props.formatMessage(utilsMsg.JsonAlertnoneCamera);
    const OpenCameraButtonName = this.props.formatMessage(
      utilsMsg.OpenCameraButtonName,
    )
    const JsonInfoPlaceholder = this.props.formatMessage(
      utilsMsg.JsonInfoPlaceholder,
    )
    const FieldAlertSendMessageNew = this.props.formatMessage(
      utilsMsg.FieldAlertSendMessageNew,
    )

    return (
      <div>
        <FormItem>
          <Alert message={message} description={description} type="info" />
        </FormItem>
        {this.state.VideoElement}
        <FormItem style={{ textAlign: 'center' }}>
          {this.state.buttonStatus ? (
            <Button
              type="primary"
              className="form-button"
              onClick={this.handleOpenCamera}
              disabled={!this.state.OpenCameraButtonState}
            >
              {OpenCameraButtonName}
            </Button>
          ) : (
            <Button
              type="primary"
              className="form-button"
              onClick={this.handleCloseCamera}
              disabled={!this.state.OpenCameraButtonState}
            >
              {closeCamera}
            </Button>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('SendTransaction', {
            rules: [{ required: true, message: JsonInfoPlaceholder }]
          })(
            <TextArea
              placeholder={JsonInfoPlaceholder}
              autosize={{ minRows: 4, maxRows: 12 }}
            />,
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            className="form-button"
            onClick={this.handleSendSignTransaction}
            disabled={!this.state.OpenCameraButtonState}
          >
            {FieldAlertSendMessageNew}
          </Button>
        </FormItem>
      </div>
    )
  }
}

ScanQrcode.propTypes = {
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  transaction: PropTypes.object,
  SelectedNetWork: PropTypes.string
}
