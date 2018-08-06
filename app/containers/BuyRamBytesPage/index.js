/*
 * BuyRamBytesPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Form, Icon, Input, Switch } from 'antd';

import { makeSelectNetwork } from '../LanguageProvider/selectors';
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  openTransactionSuccessNotification,
} from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';
import DealGetQrcode from '../../components/DealGetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;

export class BuyRamBytesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      isBuyRam: true,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: '',
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
    const { PayerAccountName, BytesQuantity } = values;
    console.log('values:', values);

    this.setState({
      GetTransactionButtonState: !!PayerAccountName && !!BytesQuantity,
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    const eos = getEos(this.props.SelectedNetWork);
    const values = this.props.form.getFieldsValue();
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
      .transaction(
        {
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
        },
        {
          sign: false,
          broadcast: false,
        },
      )
      .then(tr => {
        const transaction = JSON.stringify(tr.transaction);
        this.props.form.setFieldsValue({
          transaction,
        });
        this.setState({
          transaction,
          QrCodeValue: transaction,
        });
        openTransactionSuccessNotification(this.state.formatMessage);
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name);
      });
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
            <DealGetQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              GetTransactionButtonClick={this.handleGetTransaction}
              GetTransactionButtonState={this.state.GetTransactionButtonState}
              QrCodeValue={this.state.QrCodeValue}
              transaction={this.state.transaction}
            />
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              GetTransactionButtonState={this.state.GetTransactionButtonState}
              UnSignedTransaction={this.state.transaction}
              SelectedNetWork={this.props.SelectedNetWork}
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
  SelectedNetWork: PropTypes.string,
};
const BuyRamBytesPageIntl = injectIntl(BuyRamBytesPage);
const BuyRamBytesPageForm = Form.create()(BuyRamBytesPageIntl);

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
});

export default connect(mapStateToProps)(BuyRamBytesPageForm);
