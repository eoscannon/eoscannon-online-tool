/*
 * GetQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert, Icon } from 'antd';
import QRCode from 'qrcode.react';
import utilsMsg from '../../utils/messages';
import { formItemLayout } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class DealGetQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const keyProviderLabel = this.props.formatMessage(
      utilsMsg.KeyProviderFormItemLabel,
    );
    const keyProviderPlaceholder = this.props.formatMessage(
      utilsMsg.KeyProviderFormItemPlaceholder,
    );
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
    console.log(!this.props.CopyTransactionButtonState);
    return (
      <div>
        <FormItem>
          <Button
            type="primary"
            className="form-button"
            onClick={this.props.GetTransactionButtonClick}
            loading={this.props.GetTransactionButtonLoading}
            disabled={!this.props.GetTransactionButtonDisabled}
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
            disabled={!this.props.CopyTransactionButtonState}
            onClick={this.props.handleCopyTransaction}
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
  GetTransactionButtonLoading: PropTypes.bool,
  GetTransactionButtonDisabled: PropTypes.bool,
  QrCodeValue: PropTypes.string,
  CopyTransactionButtonState: PropTypes.bool,
  handleCopyTransaction: PropTypes.func,
};
