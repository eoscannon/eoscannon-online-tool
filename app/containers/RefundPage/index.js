/*
 * TransferPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Alert } from 'antd';
import copy from 'copy-to-clipboard';
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  openTransactionSuccessNotification,
  openNotification,
} from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';
import GetQrcode from '../../components/GetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;

export class RefundPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    this.onValuesChange(nextProps);
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const { jsonInfo, keyProvider, AccountName, transaction } = values;
    this.setState({
      GetTransactionButtonState: jsonInfo && keyProvider && AccountName,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo && keyProvider && AccountName && transaction,
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    this.setState({
      GetTransactionButtonLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const eos = getEos(values);
    const { AccountName } = values;
    eos
      .refund({
        owner: AccountName,
      })
      .then(tr => {
        this.props.form.setFieldsValue({
          transaction: JSON.stringify(tr.transaction),
        });
        this.setState({
          GetTransactionButtonLoading: false,
          QrCodeValue: JSON.stringify(tr.transaction),
        });
        openTransactionSuccessNotification(this.state.formatMessage);
      })
      .catch(err => {
        this.setState({
          GetTransactionButtonLoading: false,
        });
        openTransactionFailNotification(this.state.formatMessage, err.name);
      });
  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.state.CopyTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const { transaction } = values;
    copy(transaction);
    openNotification(this.state.formatMessage);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const RefundAlertMessage = this.state.formatMessage(
      messages.RefundAlertMessage,
    );
    const RefundAlertDescription = this.state.formatMessage(
      messages.RefundAlertDescription,
    );
    const OwnerPlaceholder = this.state.formatMessage(
      messages.OwnerPlaceholder,
    );
    const OwnerLabel = this.state.formatMessage(messages.OwnerLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <FormItem>
              <Alert
                message={RefundAlertMessage}
                description={RefundAlertDescription}
                type="error"
                closable
              />
            </FormItem>
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
            />
            <FormItem {...formItemLayout} label={OwnerLabel} colon>
              {getFieldDecorator('AccountName', {
                rules: [{ required: true, message: OwnerPlaceholder }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={OwnerPlaceholder}
                />,
              )}
            </FormItem>
            <GetQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              GetTransactionButtonClick={this.handleGetTransaction}
              GetTransactionButtonLoading={
                this.state.GetTransactionButtonLoading
              }
              GetTransactionButtonDisabled={
                this.state.GetTransactionButtonState
              }
              QrCodeValue={this.state.QrCodeValue}
              CopyTransactionButtonState={this.state.CopyTransactionButtonState}
              handleCopyTransaction={this.handleCopyTransaction}
            />
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

RefundPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const RefundPageIntl = injectIntl(RefundPage);
const RefundPageForm = Form.create()(RefundPageIntl);

export default RefundPageForm;
