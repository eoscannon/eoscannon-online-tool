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
const confirm = Modal.confirm;

export default class ScanQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VideoElement: null,
      OpenCameraButtonState: false,
      GetTransactionButtonState: false,
      SendTransaction : ''
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction) {
      this.setState({
        OpenCameraButtonState: !!nextProps.transaction,
      });
    }
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();

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
          this.getSendSignTransaction(result.text)
        });
    });
  };

  getSendSignTransaction=(signature)=>{
    let transaction = this.props.transaction;
    transaction.signature = signature
    this.props.form.setFieldsValue({
      signature: JSON.stringify(transaction),
    });
    this.setState({
      SendTransaction : transaction,
      GetTransactionButtonState: true,
    });
  }

  handleSendSignTransaction = () => {
    const values = this.state.SendTransaction;
    const eos = getEos(this.props.SelectedNetWork);
    eos
      .pushTransaction(values)
      .then(res => {
        console.log(res);
        confirm({
          title: '发送成功！',
          content: res+'' ,
          onOk() {},
          onCancel() {},
        });
      })
      .catch(err => {
        console.log(err);
        confirm({
          title: '错误信息',
          content: err+'' ,
          onOk() {},
          onCancel() {},
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
            disabled={!this.props.transaction}
          >
            {OpenCameraButtonName}
          </Button>
        </FormItem>
        <FormItem>
          {getFieldDecorator('signature', {
            rules: [{ required: true, message: JsonInfoPlaceholder }],
          })(<TextArea placeholder={JsonInfoPlaceholder} rows="6" />)}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            className="form-button"
            onClick={this.handleSendSignTransaction}
            disabled={!this.props.transaction}
          >
            发送报文
          </Button>
        </FormItem>
      </div>
    );
  }
}

ScanQrcode.propTypes = {
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  transaction: PropTypes.string,
  GetTransactionButtonState: PropTypes.bool,
  SelectedNetWork: PropTypes.string,
};
