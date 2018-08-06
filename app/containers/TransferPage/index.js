/*
 * TransferPage
 *
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Select } from 'antd';
import copy from 'copy-to-clipboard';
import eosioAbi from './abi';
import eosIqAbi from './iqAbi';
import adcAbi from './adcAbi';
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
const { Option } = Select;

export class TransferPage extends React.Component {
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
    const {
      jsonInfo,
      keyProvider,
      FromAccountName,
      ToAccountName,
      transferContract,
      transferQuantity,
      transferDigit,
      transferSymbol,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        ToAccountName &&
        transferContract &&
        transferQuantity &&
        transferDigit &&
        transferSymbol,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        ToAccountName &&
        transferContract &&
        transferQuantity &&
        transferDigit &&
        transferSymbol &&
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
    const {
      FromAccountName,
      ToAccountName,
      transferContract,
      transferQuantity,
      transferDigit,
      transferMemo,
      transferSymbol,
    } = values;
    if (transferContract !== 'eosio' && transferContract !== 'eosio.token') {
      if (transferContract.toUpperCase() === 'EVERIPEDIAIQ') {
        eos.fc.abiCache.abi(transferContract, eosIqAbi);
      } else if (transferContract.toUpperCase() === 'CHALLENGEDAC') {
        eos.fc.abiCache.abi(transferContract, adcAbi);
      } else {
        eos.fc.abiCache.abi(transferContract, eosioAbi);
      }
    }
    eos
      .transaction({
        actions: [
          {
            account: transferContract,
            name: 'transfer',
            authorization: [
              {
                actor: FromAccountName,
                permission: 'active',
              },
            ],
            data: {
              from: FromAccountName,
              to: ToAccountName,
              quantity: `${Number(transferQuantity).toFixed(
                Number(transferDigit),
              )} ${transferSymbol.toUpperCase()}`,
              memo: transferMemo || '',
            },
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
    const TransferFromAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferFromAccountNamePlaceholder,
    );
    const TransferToAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferToAccountNamePlaceholder,
    );
    const TransferContractPlaceholder = this.state.formatMessage(
      messages.TransferContractPlaceholder,
    );
    const TransferQuantityPlaceholder = this.state.formatMessage(
      messages.TransferQuantityPlaceholder,
    );
    const TransferDigitPlaceholder = this.state.formatMessage(
      messages.TransferDigitPlaceholder,
    );
    const TransferSymbolPlaceholder = this.state.formatMessage(
      messages.TransferSymbolPlaceholder,
    );
    const TransferMemoPlaceholder = this.state.formatMessage(
      messages.TransferMemoPlaceholder,
    );
    const TransferMemoHelp = this.state.formatMessage(
      messages.TransferMemoHelp,
    );
    const FromLabel = this.state.formatMessage(messages.FromLabel);
    const ToLabel = this.state.formatMessage(messages.ToLabel);
    const ContractLabel = this.state.formatMessage(messages.ContractLabel);
    const QuantityLabel = this.state.formatMessage(messages.QuantityLabel);
    const DigitLabel = this.state.formatMessage(messages.DigitLabel);
    const SymbolLabel = this.state.formatMessage(messages.SymbolLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
            />
            <FormItem {...formItemLayout} label={FromLabel} colon>
              {getFieldDecorator('FromAccountName', {
                rules: [
                  {
                    required: true,
                    message: TransferFromAccountNamePlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={TransferFromAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={ToLabel} colon>
              {getFieldDecorator('ToAccountName', {
                rules: [
                  { required: true, message: TransferToAccountNamePlaceholder },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={TransferToAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={ContractLabel} colon>
              {getFieldDecorator('transferContract', {
                initialValue: 'eosio.token',
                rules: [
                  { required: true, message: TransferContractPlaceholder },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={TransferContractPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={QuantityLabel} colon>
              {getFieldDecorator('transferQuantity', {
                rules: [
                  { required: true, message: TransferQuantityPlaceholder },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={TransferQuantityPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={DigitLabel} colon>
              {getFieldDecorator('transferDigit', {
                rules: [
                  {
                    required: true,
                    message: TransferDigitPlaceholder,
                  },
                ],
                initialValue: '4',
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={TransferDigitPlaceholder}
                >
                  <Option key="4" value="4">
                    4
                  </Option>
                  <Option key="3" value="3">
                    3
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={SymbolLabel} colon>
              {getFieldDecorator('transferSymbol', {
                initialValue: 'EOS',
                rules: [{ required: true, message: TransferSymbolPlaceholder }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={TransferSymbolPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem
              help={TransferMemoHelp}
              {...formItemLayout}
              label="Memo"
              colon
            >
              {getFieldDecorator('transferMemo', {
                rules: [{ required: false, message: TransferMemoPlaceholder }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={TransferMemoPlaceholder}
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

TransferPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const TransferPageIntl = injectIntl(TransferPage);
const TransferPageForm = Form.create()(TransferPageIntl);

export default TransferPageForm;
