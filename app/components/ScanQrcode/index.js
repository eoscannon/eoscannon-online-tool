/*
 * ScanQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert, Modal } from 'antd';
import { BrowserQRCodeReader } from '../../utils/zxing.qrcodereader.min';
import utilsMsg from '../../utils/messages';
import { getEos } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class ScanQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VideoElement: null,
      OpenCameraButtonState: false,
      SendTransaction: '',
      SendTransactionButtonState: false,
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction !== this.props.transaction) {
      this.setState({
        SendTransaction: nextProps.transaction,
        OpenCameraButtonState: JSON.stringify(nextProps.transaction) !== '{}',
      });
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
    });
    this.handleScanQrcode();
  };

  handleCloseCamera = () => {
    this.setState({
      VideoElement: null,
    });
  };

  handleScanQrcode = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      codeReader
        .decodeFromInputVideoDevice(videoInputDevices[0].deviceId, 'video')
        .then(result => {
          this.getSendSignTransaction(result.text);
        });
    });
  };

  getSendSignTransaction = sig => {
    const output = {
      compression: 'none',
      transaction: this.state.SendTransaction.transaction,
      signatures: [sig],
    };
    this.state.SendTransaction = output;
    this.props.form.setFieldsValue({
      SendTransaction: JSON.stringify(this.state.SendTransaction),
    });
    this.setState({
      SendTransaction: this.state.SendTransaction,
      SendTransactionButtonState: true,
    });
  };

  handleSendSignTransaction = () => {
    const values = this.state.SendTransaction;
    const eos = getEos(this.props.SelectedNetWork);
    eos
      .pushTransaction(values)
      .then(res => {
        Modal.success({
          title: this.props.formatMessage(utilsMsg.ScanCodeSendSuccess),
          content: `${this.props.formatMessage(
            utilsMsg.ScanCodeSendSuccessMessage,
          )} ${res.transaction_id}`,
          // maskClosable: true,
          okText: this.props.formatMessage(utilsMsg.ScanCodeSendGetIt),
        });
      })
      .catch(err => {
        Modal.error({
          title: this.props.formatMessage(utilsMsg.ScanCodeSendFailed),
          content: `${err}`,
          // maskClosable: true,
          okText: this.props.formatMessage(utilsMsg.ScanCodeSendGetIt),
        });
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const message = this.props.formatMessage(utilsMsg.JsonAlertMessage);
    const description = this.props.formatMessage(utilsMsg.JsonAlertDescription);
    const OpenCameraButtonName = this.props.formatMessage(
      utilsMsg.OpenCameraButtonName,
    );
    const JsonInfoPlaceholder = this.props.formatMessage(
      utilsMsg.JsonInfoPlaceholder,
    );
    const FieldAlertSendMessageNew = this.props.formatMessage(
      utilsMsg.FieldAlertSendMessageNew,
    );
    return (
      <div>
        <FormItem>
          <Alert message={message} description={description} type="info" />
        </FormItem>
        {this.state.VideoElement}
        <FormItem style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            className="form-button"
            onClick={this.handleOpenCamera}
            disabled={!this.state.OpenCameraButtonState}
          >
            {OpenCameraButtonName}
          </Button>
        </FormItem>
        <FormItem>
          {getFieldDecorator('SendTransaction', {
            rules: [{ required: true, message: JsonInfoPlaceholder }],
          })(<TextArea placeholder={JsonInfoPlaceholder} rows="6" />)}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            className="form-button"
            onClick={this.handleSendSignTransaction}
            disabled={!this.state.SendTransactionButtonState}
          >
            {FieldAlertSendMessageNew}
          </Button>
        </FormItem>
      </div>
    );
  }
}

ScanQrcode.propTypes = {
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  transaction: PropTypes.object,
  SelectedNetWork: PropTypes.string,
};
