/*
 * BuyRamBytesPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Switch } from 'antd';
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

export class BuyRamBytesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      isBuyRam: true,
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
   * 用户选择购买/出售
   * */
  onSwitchChange = checked => {
    this.setState({
      isBuyRam: checked,
    });
  };
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const {
      jsonInfo,
      keyProvider,
      PayerAccountName,
      BytesQuantity,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo && keyProvider && PayerAccountName && BytesQuantity,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        PayerAccountName &&
        BytesQuantity &&
        transaction,
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
    const { PayerAccountName, ReceiverAccountName, BytesQuantity } = values;
    const actionsName = this.state.isBuyRam ? 'buyrambytes' : 'sellram';
    const data = this.state.isBuyRam
      ? {
          payer: PayerAccountName,
          receiver: ReceiverAccountName || PayerAccountName,
          bytes: Number(BytesQuantity),
        }
      : {
          account: PayerAccountName,
          bytes: Number(BytesQuantity),
        };
    eos
      .transaction({
        actions: [
          {
            account: 'eosio',
            name: actionsName,
            authorization: [
              {
                actor: PayerAccountName,
                permission: 'active',
              },
            ],
            data,
          },
        ],
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
    const SwitchCheckedName = this.state.formatMessage(
      messages.SwitchCheckedName,
    );
    const SwitchUnCheckedName = this.state.formatMessage(
      messages.SwitchUnCheckedName,
    );
    const PayerAccountNamePlaceholder = this.state.isBuyRam
      ? this.state.formatMessage(messages.BuyPayerAccountNamePlaceholder)
      : this.state.formatMessage(messages.SellPayerAccountNamePlaceholder);
    const ReceiverAccountNamePlaceholder = this.state.formatMessage(
      messages.ReceiverAccountNamePlaceholder,
    );
    const BytesQuantityPlaceholder = this.state.formatMessage(
      messages.BytesQuantityPlaceholder,
    );
    const PayerAccountNameLabel = this.state.formatMessage(
      messages.PayerAccountNameLabel,
    );
    const ReceiverAccountNameLabel = this.state.formatMessage(
      messages.ReceiverAccountNameLabel,
    );
    const BytesLabel = this.state.formatMessage(messages.BytesLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
            />
            <FormItem>
              <Switch
                checkedChildren={SwitchCheckedName}
                unCheckedChildren={SwitchUnCheckedName}
                defaultChecked={this.state.isBuyRam}
                onChange={this.onSwitchChange}
              />
            </FormItem>

            <FormItem {...formItemLayout} label={PayerAccountNameLabel} colon>
              {getFieldDecorator('PayerAccountName', {
                rules: [
                  {
                    required: true,
                    message: PayerAccountNamePlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={PayerAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            {this.state.isBuyRam ? (
              <FormItem
                {...formItemLayout}
                label={ReceiverAccountNameLabel}
                colon
              >
                {getFieldDecorator('ReceiverAccountName', {
                  rules: [
                    {
                      required: false,
                      message: ReceiverAccountNamePlaceholder,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={ReceiverAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label={BytesLabel} colon>
              {getFieldDecorator('BytesQuantity', {
                rules: [
                  {
                    required: true,
                    message: BytesQuantityPlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={BytesQuantityPlaceholder}
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

BuyRamBytesPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};
const BuyRamBytesPageIntl = injectIntl(BuyRamBytesPage);
const BuyRamBytesPageForm = Form.create()(BuyRamBytesPageIntl);

export default BuyRamBytesPageForm;
