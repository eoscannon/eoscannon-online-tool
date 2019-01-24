/*
 * RefundPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Alert, Card, Col, Row } from 'antd'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectNetwork } from '../LanguageProvider/selectors'

import {
  formItemLayout,
  getEos,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item

export class RefundPage extends React.Component {
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
    const { AccountName } = values
    this.setState({
      GetTransactionButtonState: !!AccountName
    })
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const { AccountName } = values
    eos
      .refund(
        {
          owner: AccountName
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
    this.props.form.setFieldsValue({AccountName : value})
    callback();
    return
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const RefundAlertMessage = this.state.formatMessage(
      messages.RefundAlertMessage,
    )
    const RefundAlertDescription = this.state.formatMessage(
      messages.RefundAlertDescription,
    )
    const OwnerPlaceholder = this.state.formatMessage(
      messages.OwnerPlaceholder,
    )
    // const OwnerLabel = this.state.formatMessage(messages.OwnerLabel);
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
                <Alert
                  message={RefundAlertMessage}
                  description={RefundAlertDescription}
                  type="error"
                />
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [{ 
                    required: true,
                     message: OwnerPlaceholder ,
                     validator: this.checkAccountName
                  }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={OwnerPlaceholder}
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

RefundPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const RefundPageIntl = injectIntl(RefundPage)
const RefundPageForm = Form.create()(RefundPageIntl)
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})
export default connect(mapStateToProps)(RefundPageForm)
