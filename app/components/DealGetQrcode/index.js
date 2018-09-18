/*
 * DealGetQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Fcbuffer from 'fcbuffer';
import config from './../../config';
import { storage } from '../../utils/storage';

import utilsMsg from '../../utils/messages';
import {
  openNotification,
  openTransactionSuccessNotification,
} from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class DealGetQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eos: null,
      QrCodeValue: this.props.QrCodeValue,
      CopyTransactionButtonState: false,
    };
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.eos &&
      nextProps.transaction !== this.props.transaction &&
      !nextProps.scatterStatus
    ) {
      this.setState({ eos: nextProps.eos }, this.getUnSignedBuffer);
    }
  }

  // 生成报文
  getUnSignedBuffer = () => {
    const MainChainId = config.mainChainId;
    const TestChainId = config.testChainId;
    let chainId;
    if (this.props.SelectedNetWork === 'main') {
      chainId = MainChainId;
    } else if (this.props.SelectedNetWork === 'test') {
      chainId = TestChainId;
    } else if (this.props.SelectedNetWork === 'other') {
      chainId = storage.getChainId();
    }
    const buf = Fcbuffer.toBuffer(
      this.state.eos.fc.structs.transaction,
      this.props.transaction.transaction,
    );
    // const chainIdBuf = new Buffer(chainId);
    const chainIdBuf = Buffer.from(chainId, 'hex');
    const UnSignedBuffer = Buffer.concat([
      chainIdBuf,
      buf,
      Buffer.from(new Uint8Array(32)),
    ]);
    const hexStr = UnSignedBuffer.toString('hex');

    this.props.form.setFieldsValue({
      transactionTextArea: hexStr,
    });
    this.setState({
      QrCodeValue: hexStr,
      CopyTransactionButtonState: true,
    });
    openTransactionSuccessNotification(this.props.formatMessage);
  };

  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.props.GetTransactionButtonState) {
      return;
    }
    copy(JSON.stringify(this.props.transaction));
    openNotification(this.props.formatMessage);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const GetTransactionButtonName = this.props.formatMessage(
      utilsMsg.GetTransactionFormItemButtonName,
    );
    const CopyAlertMessage = this.props.formatMessage(
      utilsMsg.CopyAlertMessage,
    );
    const CopyAlertDescription = this.props.formatMessage(
      utilsMsg.CopyAlertDescription,
    );
    const TransactionTextAreaPlaceholder = this.props.formatMessage(
      utilsMsg.TransactionTextAreaPlaceholder,
    );
    const CopyTransactionButtonName = this.props.formatMessage(
      utilsMsg.CopyTransactionButtonName,
    );
    const CopyOwnerAlertDescription = this.props.formatMessage(
      utilsMsg.CopyOwnerAlertDescription,
    );
    const scatterSignature = this.props.formatMessage(
      utilsMsg.scatterSignature,
    );
    let specialStatusCompontent = false;
    try {
      specialStatusCompontent = this.props.specialStatus === "updateAuth" ? true : false;
    } catch (err) {
      specialStatusCompontent = false;
    }
    return (
      <div>
        {!this.props.isHiddenGetTransactionButton && (
          <FormItem style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              className="form-button"
              onClick={this.props.GetTransactionButtonClick}
              disabled={!this.props.GetTransactionButtonState}
            >
              {GetTransactionButtonName}
            </Button>
            &nbsp;&nbsp;&nbsp;
            {this.props.voteByScatterClick ? (
              <Button
                type="primary"
                className="form-button"
                disabled={!this.props.GetTransactionButtonScatterState}
                onClick={this.props.voteByScatterClick}
              >
                {scatterSignature}
              </Button>
            ) : null}
          </FormItem>
        )}
        <FormItem>
          {specialStatusCompontent ? (
            <Alert
              message={CopyAlertMessage}
              description={CopyOwnerAlertDescription}
              type="info"
            />
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
              { required: true, message: TransactionTextAreaPlaceholder },
            ],
          })(
            <TextArea
              disabled="true"
              autosize={{ minRows: 4, maxRows: 12 }}
              placeholder={TransactionTextAreaPlaceholder}
            />,
          )}
        </FormItem>
        <FormItem>
          <div style={{ textAlign: 'center' }}>
            {JSON.stringify(this.props.transaction) === '{}' ? null : (
              <QRCode
                value={this.state.QrCodeValue}
                size={256}
                style={{ transform: ' rotate(270deg)' }}
              />
            )}
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
    );
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
};
