/*
 * TransferPage
 *
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Form, Icon, Input, Select, Card, Col, Row, message } from 'antd';
import eosioAbi from './abi';
import eosIqAbi from './iqAbi';
import adcAbi from './adcAbi';
import {
  formItemLayout,
  getEos,
  symbolList,
  openTransactionFailNotification,
} from '../../utils/utils';
import { LayoutContent } from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';
import DealGetQrcode from '../../components/DealGetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

import { makeSelectNetwork } from '../LanguageProvider/selectors';

const FormItem = Form.Item;
const { Option } = Select;

export class TransferPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eos: null,
      addSymbol: false,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      contract: 'eosio.token',
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
    const { FromAccountName, ToAccountName, transferQuantity } = values;
    this.setState({
      GetTransactionButtonState:
        !!FromAccountName && !!ToAccountName && !!transferQuantity,
    });
    // if(this.state.addSymbol){
    //  const {
    //    FromAccountName,
    //    ToAccountName,
    //    transferQuantity,
    //    transferSymbolCustom,
    //    transferContractCustom,
    //    transferDigitCustom,
    //  } = values;
    //  this.setState({
    //    GetTransactionButtonState:
    //    !!FromAccountName &&
    //    !!ToAccountName &&
    //    !!transferSymbolCustom &&
    //    !!transferContractCustom &&
    //    !!transferDigitCustom &&
    //    !!transferQuantity
    //  });
    // }
  };

  handleChange = val => {
    this.setState({
      contract: val.key,
    });
  };

  toggle = () => {
    this.setState({
      addSymbol: !this.state.addSymbol,
    });
  };

  handleCustomTransaction = eos => {
    const values = this.props.form.getFieldsValue();
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      // transferSymbol,
      transferSymbolCustom,
      transferContractCustom,
      transferDigitCustom,
    } = values;
    if (
      !transferSymbolCustom ||
      !transferContractCustom ||
      !transferDigitCustom
    ) {
      message.warning(this.state.formatMessage(messages.SymbolAttentionInfo));
      return;
    }
    // 判断是否为自定义symbol
    // console.log("transferSymbolCustom===",transferSymbolCustom)
    // console.log("transferContractCustom===",transferContractCustom)
    // let transferContract
    // console.log('transferSymbolCustom===', transferSymbolCustom)
    // console.log('transferContractCustom===', transferContractCustom)
    eos
      .getAbi(transferSymbolCustom.toLowerCase())
      .then(res => {
        eos.fc.abiCache.abi(transferContractCustom, res.abi);
      })
      .catch(err => {
        message.error(`${err}`);
      });
    eos
      .transaction(
        {
          actions: [
            {
              account: transferContractCustom,
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
                  Number(transferDigitCustom),
                )} ${transferSymbolCustom.toUpperCase()}`,
                memo: transferMemo || '',
              },
            },
          ],
        },
        {
          sign: false,
          broadcast: false,
        },
      )
      .then(tr => {
        this.setState({
          eos,
          transaction: tr.transaction,
        });
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name);
      });
  };

  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const eos = getEos(this.props.SelectedNetWork);
    const {
      FromAccountName,
      ToAccountName,
      transferQuantity,
      transferMemo,
      transferSymbol,
    } = values;
    let transferDigit = 4;
    // let transferContract;
    if (this.state.addSymbol) {
      this.handleCustomTransaction(eos);
      return;
    }

    if (
      this.state.contract !== 'eosio' &&
      this.state.contract !== 'eosio.token'
    ) {
      if (this.state.contract.toUpperCase() === 'EVERIPEDIAIQ') {
        transferDigit = 3;
        eos.fc.abiCache.abi(this.state.contract, eosIqAbi);
      } else if (this.state.contract.toUpperCase() === 'CHALLENGEDAC') {
        eos.fc.abiCache.abi(this.state.contract, adcAbi);
      } else {
        eos.fc.abiCache.abi(this.state.contract, eosioAbi);
      }
    }
    const transferContract = this.state.contract;

    eos
      .transaction(
        {
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
                )} ${transferSymbol.label.toUpperCase()}`,
                memo: transferMemo || '',
              },
            },
          ],
        },
        {
          sign: false,
          broadcast: false,
        },
      )
      .then(tr => {
        console.log('tr.transaction==', tr.transaction);
        this.setState({
          eos,
          transaction: tr.transaction,
        });
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const TransferFromAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferFromAccountNamePlaceholder,
    );
    const TransferToAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferToAccountNamePlaceholder,
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
    // const TransferMemoHelp = this.state.formatMessage(
    //   messages.TransferMemoHelp,
    // );
    // const FromLabel = this.state.formatMessage(messages.FromLabel);
    // const ToLabel = this.state.formatMessage(messages.ToLabel);
    // const QuantityLabel = this.state.formatMessage(messages.QuantityLabel);
    // const SymbolLabel = this.state.formatMessage(messages.SymbolLabel);
    const SymbolCustom = this.state.formatMessage(messages.SymbolCustom);
    // const TransferSymbol = this.state.formatMessage(messages.TransferSymbol);
    // const TransferContract = this.state.formatMessage(
    //   messages.TransferContract,
    // );
    // const TransferDigit = this.state.formatMessage(messages.TransferDigit);
    const TransferSymbolHolder = this.state.formatMessage(
      messages.TransferSymbolHolder,
    );
    const TransferContractHolder = this.state.formatMessage(
      messages.TransferContractHolder,
    );
    const TransferDigitHolder = this.state.formatMessage(
      messages.TransferDigitHolder,
    );
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    );
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    );
    return (
      <LayoutContent>
        <Row gutter={16}>
          <Col span={12}>
            <Card title={ProducersDealTranscation} bordered={false}>
              <FormItem {...formItemLayout}>
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
              <FormItem {...formItemLayout}>
                {getFieldDecorator('ToAccountName', {
                  rules: [
                    {
                      required: true,
                      message: TransferToAccountNamePlaceholder,
                    },
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
              <FormItem {...formItemLayout}>
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
              <FormItem {...formItemLayout} style={{ margin: 0 }}>
                <div
                  style={{ visibility: this.state.addSymbol ? 'hidden' : '' }}
                >
                  {getFieldDecorator('transferSymbol', {
                    initialValue: { key: 'EOS', label: 'EOS' },
                    rules: [
                      { required: true, message: TransferSymbolPlaceholder },
                    ],
                  })(
                    <Select
                      labelInValue
                      style={{ width: '100%' }}
                      onChange={this.handleChange}
                      placeholder={TransferDigitPlaceholder}
                    >
                      {symbolList.map(item => (
                        <Option key={item.contract} value={item.contract}>
                          {item.symbol}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </div>

                <span
                  role="article"
                  style={{ marginLeft: 8, fontSize: 12 }}
                  onClick={this.toggle}
                  aria-hidden="true"
                >
                  {SymbolCustom}{' '}
                  <Icon type={this.state.addSymbol ? 'up' : 'down'} />
                </span>
              </FormItem>
              {this.state.addSymbol ? (
                <div>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferSymbolCustom', {
                      rules: [
                        { required: true, message: TransferSymbolHolder },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="pay-circle-o"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={TransferSymbolHolder}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferContractCustom', {
                      rules: [
                        { required: true, message: TransferContractHolder },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="pay-circle-o"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={TransferContractHolder}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('transferDigitCustom', {
                      rules: [{ required: true, message: TransferDigitHolder }],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="pay-circle-o"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={TransferDigitHolder}
                      />,
                    )}
                  </FormItem>
                </div>
              ) : null}
              <FormItem {...formItemLayout}>
                {getFieldDecorator('transferMemo', {
                  rules: [
                    { required: false, message: TransferMemoPlaceholder },
                  ],
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
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                QrCodeValue={this.state.QrCodeValue}
                transaction={this.state.transaction}
                SelectedNetWork={this.props.SelectedNetWork}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={ProducersSendTranscation} bordered={false}>
              <ScanQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
              />
            </Card>
          </Col>
        </Row>
      </LayoutContent>
    );
  }
}

TransferPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
};

const TransferPageIntl = injectIntl(TransferPage);
const TransferPageForm = Form.create()(TransferPageIntl);
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
});

export default connect(mapStateToProps)(TransferPageForm);
