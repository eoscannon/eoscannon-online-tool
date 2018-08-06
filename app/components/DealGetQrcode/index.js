/*
 * GetQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import utilsMsg from '../../utils/messages';
import { openNotification } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class DealGetQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CopyTransactionButtonState: false,
    };
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction) {
      this.setState({
        CopyTransactionButtonState:
          nextProps.GetTransactionButtonState && !!nextProps.transaction,
      });
    }
  }

  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.state.CopyTransactionButtonState) {
      return;
    }
    copy(this.props.transaction);
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
          {getFieldDecorator('transaction', {
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
            <QRCode value={this.props.QrCodeValue} size={256} />
          </div>
        </FormItem>
        <FormItem>
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
  form: PropTypes.object,
  formatMessage: PropTypes.func,
  GetTransactionButtonClick: PropTypes.func,
  GetTransactionButtonState: PropTypes.bool,
  QrCodeValue: PropTypes.string,
  transaction: PropTypes.string,
};
