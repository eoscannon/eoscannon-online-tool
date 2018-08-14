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
          <video id="video" width="500" height="200">
            <track kind="captions" />
          </video>
        </FormItem>
      ),
    });
    this.handleScanQrcode();
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
    // const MainChainId =
    //  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
    // const TestChainId =
    //  '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca';
    // const chainId =
    //  this.props.SelectedNetWork === 'main' ? MainChainId : TestChainId;
    // const buf = Fcbuffer.toBuffer(
    //  this.props.eos.fc.structs.transaction,
    //  this.props.transaction.transaction,
    // );
    // const chainIdBuf =   Buffer.from(chainId,'hex');
    // const UnSignedBuffer = Buffer.concat([
    //  chainIdBuf,
    //  buf,
    //  Buffer.from(new Uint8Array(32)),
    // ]);
    // const siglocal = ecc.sign(UnSignedBuffer, '5JYHNcQWyvNLMeFQW3tbbtBk1P1pFKHPfnwaAXEHnGauJHd1spP');

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
          //maskClosable: true,
          okText: '知道了'
        })
      })
      .catch(err => {
        Modal.error({
          title: this.props.formatMessage(utilsMsg.ScanCodeSendFailed),
          content: `${err}`,
          //maskClosable: true,
          okText: '知道了'
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
