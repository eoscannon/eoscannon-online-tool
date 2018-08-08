/*
 * DealGetQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import utilsMsg from '../../utils/messages';
import { openNotification, getEosInfoDetail, getEos, openTransactionSuccessNotification } from '../../utils/utils';
import ecc from  'eosjs-ecc'
import Fcbuffer from 'fcbuffer';
import Eos from  'eosjs'

const FormItem = Form.Item;
const { TextArea } = Input;

export default class DealGetQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QrCodeValue: this.props.QrCodeValue,
      transaction: this.props.transaction,
      CopyTransactionButtonState: false,
    };
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    //console.log('nextProps====',nextProps)
    if (nextProps.transaction !== this.props.transaction && nextProps.QrCodeValue) {
      this.setState({
        QrCodeValue : nextProps.transaction,
        CopyTransactionButtonState:
          nextProps.GetTransactionButtonState && !!nextProps.transaction,
      }, () => {
        this.sign_offline()
      });
    }
  }

  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.props.GetTransactionButtonState) {
      return;
    }
    console.log('this.props.transaction===',this.props.transaction)
    console.log("output:" + escape(this.props.transaction));

    copy(JSON.stringify(this.props.transaction));
    openNotification(this.props.formatMessage);
  };

  //离线签名
  sign_offline =  () => {
    const chainId = this.props.SelectedNetWork == "main" ? "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" : "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca";
    const eos = getEos(this.props.SelectedNetWork);
    const unsigned = this.props.transaction;
    const Transaction = eos.fc.structs.transaction;
    console.log('unsigned===',unsigned)
    const buf = Fcbuffer.toBuffer(Transaction, unsigned.transaction);
    const chain_id_buf = new Buffer(chainId , 'hex');
    const sign_buf = Buffer.concat([chain_id_buf, buf, new Buffer(new Uint8Array(32))]);

    this.props.form.setFieldsValue({
      transactionTextArea: JSON.stringify(sign_buf),
    });
    this.setState({
      GetTransactionButtonLoading: false,
      QrCodeValue: JSON.stringify(sign_buf),
    });
    openTransactionSuccessNotification(this.props.formatMessage);

  }
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
    return (
      <div>
        <FormItem>
          <Button
            type="primary"
            className="form-button"
            onClick={this.props.GetTransactionButtonClick}
            disabled={!this.props.GetTransactionButtonState}
          >
            {GetTransactionButtonName}
          </Button>
        </FormItem>
        <FormItem>
          <Alert
            message={CopyAlertMessage}
            description={CopyAlertDescription}
            type="info"
            closable
          />
        </FormItem>
        <FormItem>
          {getFieldDecorator('transactionTextArea', {
            rules: [
              { required: true, message: TransactionTextAreaPlaceholder },
            ],
          })(
            <TextArea
              disabled="true"
              placeholder={TransactionTextAreaPlaceholder}
            />,
          )}
        </FormItem>
        <FormItem>
          <div style={{ textAlign: 'center' }}>
            <QRCode value={this.state.QrCodeValue} size={256} />
          </div>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            className="form-button"
            disabled={!this.props.GetTransactionButtonState}
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
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  GetTransactionButtonClick: PropTypes.func,
  //GetTransactionButtonState: PropTypes.bool,
  QrCodeValue: PropTypes.string,
  transaction: PropTypes.string,
};
