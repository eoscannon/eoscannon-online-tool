/*
 * WorbliPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Select, Table, Alert } from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
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
const Option = Select.Option

export class WorbliPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      scatterStatus: false,
      GetTransactionButtonScatterState: true,
      columnsData: []
    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () { }
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
    const { AccountName, securitycode } = values
    this.setState({
      GetTransactionButtonState: !!securitycode && !!AccountName })
  };

  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = record => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const { AccountName, securitycode} = values
    eos.getAbi('worbliworbli').then(res => {
      eos.fc.abiCache.abi(res.account_name, res.abi)
    }).catch(err=>{
      console.log('err', err)
    })
    var data = {
      owner: AccountName,
      securitycode: securitycode
    }
    console.log('data', data)
    eos
      .transaction(
        {
          actions: [
            {
              account: 'worbliworbli',
              name: 'reg',
              authorization: [
                {
                  actor: AccountName,
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
          transaction: tr.transaction,
          eos
        })
      })
      .catch(err => {
        console.log('catch err', err)
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  handleChange=(value)=> {
    console.log(`selected ${value}`)
  }

  checkAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({AccountName : value})
    callback();
    return
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const AirGrabAlertMessage = this.state.formatMessage(
      messages.AirGrabAlertMessage,
    )
    const AirGrabAlertDescription = this.state.formatMessage(
      messages.AirGrabAlertDescription,
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
                  message={AirGrabAlertMessage}
                  description=''
                  type="info"
                />
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [{ 
                    required: true,
                     message: OwnerPlaceholder,
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
              <FormItem {...formItemLayout}>
                {getFieldDecorator('securitycode', {
                  rules: [{ required: true, message: 'securitycode' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder='securitycode'
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

WorbliPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const WorbliPageIntl = injectIntl(WorbliPage)
const WorbliPageForm = Form.create()(WorbliPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(WorbliPageForm)
