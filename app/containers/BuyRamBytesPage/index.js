/*
 * BuyRamBytesPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Form, Icon, Input, Switch, Card, Col, Row, Radio } from 'antd'

import { makeSelectNetwork } from '../LanguageProvider/selectors'
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification
} from '../../utils/utils'
import { storage } from '../../utils/storage'
import { LayoutContent } from '../../components/NodeComp'
import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item
const RadioGroup = Radio.Group

export class BuyRamBytesPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      isBuyRam: true,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      radioStatus: 2
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }
  /**
   * 用户选择购买/出售
   * */
  onSwitchChange = checked => {
    this.setState({
      isBuyRam: checked,
      radioStatus: 2
    })
  };
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { PayerAccountName, BytesQuantity, EosQuantity } = values
    this.setState({
      GetTransactionButtonState:
        !!PayerAccountName && (!!BytesQuantity || !!EosQuantity)
    })
  };

  changeRadio = e => {
    this.setState({ radioStatus: e.target.value })
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const eos = getEos(this.props.SelectedNetWork)
    const values = this.props.form.getFieldsValue()
    const {
      PayerAccountName,
      ReceiverAccountName,
      BytesQuantity,
      EosQuantity
    } = values
    const baseSymbol =storage.getBaseSymbol()

    let actionsName = this.state.isBuyRam ? 'buyrambytes' : 'sellram'
    if (this.state.isBuyRam) {
      actionsName = this.state.radioStatus === 1 ? 'buyram' : 'buyrambytes'
    }
    const type =
      this.state.radioStatus === 1
        ? {
          quant: `${Number(EosQuantity)
            .toFixed(4)
            .toString()} ${baseSymbol}`
        }
        : { bytes: Number(BytesQuantity) }
    const data = this.state.isBuyRam
      ? {
        payer: PayerAccountName,
        receiver: ReceiverAccountName || PayerAccountName,
        ...type
      }
      : {
        account: PayerAccountName,
        ...type
      }
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
                  permission: 'active'
                }
              ],
              data
            }
          ]
        },
        {
          sign: false,
          broadcast: false
        },
      )
      .then(tr => {
        this.setState({
          eos,
          transaction: tr.transaction
        })
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  render () {
    const { getFieldDecorator } = this.props.form
    const SwitchCheckedName = this.state.formatMessage(
      messages.SwitchCheckedName,
    )
    const SwitchUnCheckedName = this.state.formatMessage(
      messages.SwitchUnCheckedName,
    )
    const PayerAccountNamePlaceholder = this.state.isBuyRam
      ? this.state.formatMessage(messages.BuyPayerAccountNamePlaceholder)
      : this.state.formatMessage(messages.SellPayerAccountNamePlaceholder)
    const ReceiverAccountNamePlaceholder = this.state.formatMessage(
      messages.ReceiverAccountNamePlaceholder,
    )
    const BytesQuantityPlaceholder = this.state.formatMessage(
      messages.BytesQuantityPlaceholder,
    )
    const EosQuantityPlaceholder = this.state.formatMessage(
      messages.EosQuantityPlaceholder,
    )
    // const ReceiverAccountNameLabel = this.state.formatMessage(
    //   messages.ReceiverAccountNameLabel,
    // );
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    return (
      <LayoutContent>
        <Row gutter={16}>
          <Col span={12}>
            <Card title={ProducersDealTranscation} bordered={false}>
              <FormItem>
                <Switch
                  checkedChildren={SwitchCheckedName}
                  unCheckedChildren={SwitchUnCheckedName}
                  defaultChecked={this.state.isBuyRam}
                  onChange={this.onSwitchChange}
                />
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('PayerAccountName', {
                  rules: [
                    {
                      required: true,
                      message: PayerAccountNamePlaceholder
                    }
                  ]
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
                <div>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('ReceiverAccountName', {
                      rules: [
                        {
                          required: false,
                          message: ReceiverAccountNamePlaceholder
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder={ReceiverAccountNamePlaceholder}
                      />,
                    )}
                  </FormItem>
                  <RadioGroup
                    name="radiogroup"
                    defaultValue={1}
                    value={this.state.radioStatus}
                    onChange={this.changeRadio}
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      paddingBottom: '.3rem'
                    }}
                  >
                    <Radio value={1}>EOS</Radio>
                    <Radio value={2}>bytes</Radio>
                  </RadioGroup>
                </div>
              ) : null}

              {this.state.radioStatus === 1 ? (
                <FormItem {...formItemLayout} colon>
                  {getFieldDecorator('EosQuantity', {
                    rules: [
                      {
                        required: true,
                        message: EosQuantityPlaceholder
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="pay-circle-o"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder={EosQuantityPlaceholder}
                    />,
                  )}
                </FormItem>
              ) : (
                <FormItem {...formItemLayout} colon>
                  {getFieldDecorator('BytesQuantity', {
                    rules: [
                      {
                        required: true,
                        message: BytesQuantityPlaceholder
                      }
                    ]
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
              )}
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                QrCodeValue={this.state.QrCodeValue}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
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
    )
  }
}

BuyRamBytesPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}
const BuyRamBytesPageIntl = injectIntl(BuyRamBytesPage)
const BuyRamBytesPageForm = Form.create()(BuyRamBytesPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(BuyRamBytesPageForm)
