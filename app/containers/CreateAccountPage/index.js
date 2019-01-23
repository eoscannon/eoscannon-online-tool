/*
 * CreateAccountPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Card, Col, Row } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors'

import {
  formItemLayout,
  getEos,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import { storage } from '../../utils/storage'

import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item

export class CreateAccountPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {}
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const {
      AccountName,
      NewAccountName,
      ActiveKey,
      OwnerKey,
      Bytes,
      StakeNetQuantity,
      StakeCpuQuantity
    } = values
    console.log('AccountName == ', AccountName)
    // AccountName ? nextProps.form.setFieldsValue({'AccountName': AccountName.toLowerCase().trim()}) : ''
    // NewAccountName ? nextProps.form.setFieldsValue({'NewAccountName': NewAccountName.toLowerCase().trim()}) : ''

    this.setState({
      GetTransactionButtonState:
        !!AccountName &&
        !!NewAccountName &&
        !!ActiveKey &&
        !!OwnerKey &&
        !!Bytes &&
        !!StakeNetQuantity &&
        !!StakeCpuQuantity
    })
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const baseSymbol =storage.getBaseSymbol()

    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const {
      AccountName,
      NewAccountName,
      ActiveKey,
      OwnerKey,
      Bytes,
      StakeNetQuantity,
      StakeCpuQuantity
    } = values
    const actions = []
    const NewAccountAction = {
      account: 'eosio',
      name: 'newaccount',
      authorization: [
        {
          actor: AccountName,
          permission: 'active'
        }
      ],
      data: {
        creator: AccountName,
        name: NewAccountName,
        owner: OwnerKey,
        active: ActiveKey
      }
    }
    actions.push(NewAccountAction)
    const BuyRamBytesAction = {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [
        {
          actor: AccountName,
          permission: 'active'
        }
      ],
      data: {
        payer: AccountName,
        receiver: NewAccountName,
        bytes: Number(Bytes)
      }
    }
    actions.push(BuyRamBytesAction)
    const DelegateBwAction = {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [
        {
          actor: AccountName,
          permission: 'active'
        }
      ],
      data: {
        from: AccountName,
        receiver: NewAccountName,
        stake_net_quantity: `${Number(StakeNetQuantity)
          .toFixed(4)
          .toString()} ${baseSymbol}`,
        stake_cpu_quantity: `${Number(StakeCpuQuantity)
          .toFixed(4)
          .toString()} ${baseSymbol}`,
        transfer: 0
      }
    }
    actions.push(DelegateBwAction)
    eos
      .transaction(
        {
          actions
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

  checkAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({AccountName:value})
    callback();
    return
  }

  checkNewAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({NewAccountName:value})
    callback();
    return;

  }


  render () {
    const { getFieldDecorator } = this.props.form
    const CreatorAccountNamePlaceholder = this.state.formatMessage(
      messages.CreatorAccountNamePlaceholder,
    )
    const NewAccountNamePlaceholder = this.state.formatMessage(
      messages.NewAccountNamePlaceholder,
    )
    const NewAccountNameHelp = this.state.formatMessage(
      messages.NewAccountNameHelp,
    )
    const OwnerKeyPlaceholder = this.state.formatMessage(
      messages.OwnerKeyPlaceholder,
    )
    const ActiveKeyPlaceholder = this.state.formatMessage(
      messages.ActiveKeyPlaceholder,
    )
    const BytesHelp = this.state.formatMessage(messages.BytesHelp)
    const BytesPlaceholder = this.state.formatMessage(
      messages.BytesPlaceholder,
    )
    const StakeNetQuantityPlaceholder = this.state.formatMessage(
      messages.StakeNetQuantityPlaceholder,
    )
    const StakeCPUHelper = this.state.formatMessage(messages.CPUStakeHelp)
    const StakeNETHelper = this.state.formatMessage(messages.NetStakeHelp)
    const StakeCpuQuantityPlaceholder = this.state.formatMessage(
      messages.StakeCpuQuantityPlaceholder,
    )
    // const CreatorLabel = this.state.formatMessage(messages.CreatorLabel);
    // const NameLabel = this.state.formatMessage(messages.NameLabel);
    // const BytesLabel = this.state.formatMessage(messages.BytesLabel);
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
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [
                    { required: true,
                     message: CreatorAccountNamePlaceholder ,
                     validator: this.checkAccountName 
                     }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={CreatorAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('NewAccountName', {
                  rules: [
                    {
                      required: true,
                      message: CreatorAccountNamePlaceholder ,
                      validator: this.checkNewAccountName

                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={NewAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('OwnerKey', {
                  rules: [
                    {
                      required: false,
                      message: OwnerKeyPlaceholder
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="unlock"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder={OwnerKeyPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('ActiveKey', {
                  rules: [
                    {
                      required: true,
                      message: ActiveKeyPlaceholder
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="unlock"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder={ActiveKeyPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem help={BytesHelp} {...formItemLayout}>
                {getFieldDecorator('Bytes', {
                  initialValue: 8192,
                  rules: [
                    {
                      required: true,
                      message: BytesPlaceholder
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
                    placeholder={BytesPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem help={StakeNETHelper} {...formItemLayout}>
                {getFieldDecorator('StakeNetQuantity', {
                  initialValue: 0.1,
                  rules: [
                    {
                      required: true,
                      message: StakeNetQuantityPlaceholder
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
                    placeholder={StakeNetQuantityPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem help={StakeCPUHelper} {...formItemLayout}>
                {getFieldDecorator('StakeCpuQuantity', {
                  initialValue: 0.1,
                  rules: [
                    {
                      required: true,
                      message: StakeCpuQuantityPlaceholder
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
                    placeholder={StakeCpuQuantityPlaceholder}
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

CreateAccountPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}
const CreateAccountPageIntl = injectIntl(CreateAccountPage)
const CreateAccountPageForm = Form.create()(CreateAccountPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(CreateAccountPageForm)
