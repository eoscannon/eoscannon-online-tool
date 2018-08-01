/*
 * ScanQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert } from 'antd';
import { BrowserQRCodeReader } from '../../utils/zxing.qrcodereader.min';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class ScanQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VideoElement: null,
      ScanQrcodeButtonDisable: true,
    };
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
      ScanQrcodeButtonDisable: false,
    });
    this.handleScanQrcode();
  };

  handleScanQrcode = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      codeReader
        .decodeFromInputVideoDevice(videoInputDevices[0].deviceId, 'video')
        .then(result => {
          this.props.form.setFieldsValue({
            jsonInfo: result.text,
          });
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
    const ScanQrcodeButtonName = this.props.formatMessage(
      utilsMsg.ScanQrcodeButtonName,
    );
    const JsonInfoPlaceholder = this.props.formatMessage(
      utilsMsg.JsonInfoPlaceholder,
    );
    const FieldAlertMessage = this.props.formatMessage(
      utilsMsg.FieldAlertMessage,
    );
    const FieldAlertDescription = this.props.formatMessage(
      utilsMsg.FieldAlertDescription,
    );
    return (
      <div>
        <FormItem>
          <Alert
            message={message}
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
          <Button
            type="primary"
            className="form-button"
            style={{ display: 'inline', marginLeft: 5 }}
            onClick={this.handleScanQrcode}
            disabled={this.state.ScanQrcodeButtonDisable}
          >
            {ScanQrcodeButtonName}
          </Button>
        </FormItem>
        <FormItem>
          {getFieldDecorator('jsonInfo', {
            rules: [{ required: true, message: JsonInfoPlaceholder }],
          })(<TextArea placeholder={JsonInfoPlaceholder} rows='6'/>)}
        </FormItem>
        <FormItem>
          <Alert
            message={FieldAlertMessage}
            description={FieldAlertDescription}
            type="info"
          />
        </FormItem>
      </div>
    );
  }
}

ScanQrcode.propTypes = {
  form: PropTypes.object,
  formatMessage: PropTypes.func,
};
