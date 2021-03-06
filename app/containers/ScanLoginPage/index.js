/*
 * ScanLoginPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Alert, Button, Input, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors'
import styleComps from './styles'
import axios from 'axios'
import { getEos } from '../../utils/utils'
import { LayoutContentBox, FormComp } from '../../components/NodeComp'
// import request from 'request';
import utilsMsg from '../../utils/messages'
import { BrowserQRCodeReader } from '../../utils/zxing.qrcodereader.min'

const FormItem = Form.Item
const { TextArea } = Input

export class ScanLoginPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      transactionId: '',
      formatMessage: this.props.intl.formatMessage
    }
  }

  handleOpenCamera = () => {
    this.setState({
      VideoElement: (
        <FormItem>
          <video id="video" width="500" height="200">
            <track kind="captions" />
          </video>
        </FormItem>
      )
    })
    this.handleScanQrcode()
  };

  handleScanQrcode = () => {
    const codeReader = new BrowserQRCodeReader()
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      codeReader
        .decodeFromInputVideoDevice(videoInputDevices[0].deviceId, 'video')
        .then(result => {
          this.props.form.setFieldsValue({
            jsonInfo: result.text
          })
        })
    })
  };
  /**
   * 用户点击发送签名报文，并提示用户已发送
   * */
  sendMessage = () => {
    const data = this.props.form.getFieldsValue().jsonInfo
    let info = JSON.parse(data)
    console.log('info===',info)
    // request.post(info.loginUrl , info).then(res=> {
    //   console.log('request==',request)
    // }) .catch(err=>{
    //   console.log('err==',err)

    // })

    var instance = axios.create({
      headers: {
        // "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'*'
      }
    });
    instance.post(info.loginUrl , info ).then(res=>{
      console.log('response==',res)
      message.success(
        `${this.state.formatMessage(
          utilsMsg.SendSuccessMessage,
        )}transactionId=${res.transaction_id}`,
      )
      this.setState({ transactionId: res.transaction_id })
    }).catch(err => {
      console.log('err==',err)
      message.error(`发送失败，原因：${err}`)
    })
  };

  render () {
    const { getFieldDecorator } = this.props.form
    const { formatMessage } = this.props.intl
    const description = formatMessage(utilsMsg.JsonAlertDescription)
    const OpenCameraButtonName = formatMessage(utilsMsg.OpenCameraButtonName)
    const JsonInfoPlaceholder = formatMessage(utilsMsg.JsonInfoPlaceholder)
    const FieldAlertSendMessageNew = formatMessage(
      utilsMsg.FieldAlertSendMessageNew,
    )
    return (
      <LayoutContentBox>
        <styleComps.ConBox>
          <FormComp style={{ maxWidth: '500px' }}>
            <FormItem>
              <Alert
                message={FieldAlertSendMessageNew}
                description={description}
                type="info"
              />
            </FormItem>
            {this.state.VideoElement}
            <FormItem style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                className="form-button"
                style={{ display: 'inline', marginRight: 5 }}
                onClick={this.handleOpenCamera}
              >
                {OpenCameraButtonName}
              </Button>
            </FormItem>
            <FormItem>
              {getFieldDecorator('jsonInfo', {
                rules: [{ required: true, message: JsonInfoPlaceholder }]
              })(<TextArea placeholder={JsonInfoPlaceholder} rows="6" />)}
            </FormItem>
            <FormItem style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                className="form-button"
                onClick={this.sendMessage}
                disabled={false}
              >
                {FieldAlertSendMessageNew}
              </Button>
            </FormItem>
            <FormItem style={{ textAlign: 'left' }}>
              {this.state.transactionId
                ? `txid：${this.state.transactionId}`
                : ''}
            </FormItem>
          </FormComp>
        </styleComps.ConBox>
      </LayoutContentBox>
    )
  }
}

ScanLoginPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const ScanLoginPageIntl = injectIntl(ScanLoginPage)
const ScanLoginPageForm = Form.create()(ScanLoginPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(ScanLoginPageForm)
