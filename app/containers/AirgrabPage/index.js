/*
 * AirgrabPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Alert, Card, Col, Row, Table, Button } from 'antd'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectNetwork } from '../LanguageProvider/selectors'

import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  airgrabList
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item

export class AirgrabPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      tableData: [],
      tableColumns: []
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }
  componentWillMount () {
    this.setState({
      tableData: airgrabList || [],
      tableColumns: [
        {
          title: this.state.formatMessage(
            messages.AirGrabTableColumnsSymbolTitle,
          ),
          dataIndex: 'symbol',
          key: 'symbol',
          align: 'center',
          width: '60%',
          render: (text, record) => (
            <a href={record.url} target="_blank">
              {text}
            </a>
          )
        },
        {
          title: this.state.formatMessage(
            messages.AirGrabTableColumnsActionTitle,
          ),
          key: 'action',
          align: 'center',
          render: (text, record) => (
            <span>
              <Button
                disabled={!this.state.GetTransactionButtonState}
                type="primary"
                size="small"
                onClick={() => this.handleGetTransaction(record)}
              >
                {this.state.formatMessage(
                  messages.AirGrabTableActionButtonName,
                )}
              </Button>
            </span>
          )
        }
      ]
    })
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
  handleGetTransaction = record => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const { AccountName } = values
    eos.getAbi(record.account).then(res => {
     eos.fc.abiCache.abi(res.account_name, res.abi)
    }).catch(err=>{
      console.log('err', err)
    })
    var data
    if (record.method === 'signup' && record.symbol !== 'SEED') {
      data = {
        owner: AccountName,
        quantity: `0.0000 ${record.symbol}`,
      };
    }
    if (record.method === 'signup' && record.symbol === 'SEED') {
      data = {
        owner: AccountName,
        sym: `0.0000 ${record.symbol}`,
      };
    }
    if (record.method === 'claim') {
      data = {
        claimer: AccountName
      };
    }
    if (record.account === 'thedeosgames') {
      data = {
        owner: AccountName,
        quantity: `0.0000 ${record.symbol}`
      }
    }
    if(record.method === 'open') {
      data = {
        owner: AccountName,
        symbol: `0.0000 ${record.symbol}`,
        ram_payer: AccountName,
      };
    }
    if (record.account === 'infinicoinio') {
      data = {
        owner: AccountName,
        symbol: `0.0000 ${record.symbol}`,
        ram_payer: AccountName
      }
    }
    if (record.account === 'hirevibeshvt') {
      data = {
        owner: AccountName,
        sym: `0.0000 ${record.symbol}`
      }
    }
    if (record.account === 'zkstokensr4u') {
      data = {
        owner: AccountName,
        sym: `0,${record.symbol}`,
      };
    }
    console.log('data',data)

    eos
      .transaction(
        {
          actions: [
            {
              account: record.account,
              name: record.method,
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
                  description={AirGrabAlertDescription}
                  type="info"
                />
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [{ required: true, message: OwnerPlaceholder }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={OwnerPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem>
                <Table
                  columns={this.state.tableColumns}
                  dataSource={this.state.tableData}
                  pagination={false}
                  size="middle"
                />
              </FormItem>
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                isHiddenGetTransactionButton
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

AirgrabPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
  refs: PropTypes.object
}

const AirgrabPageIntl = injectIntl(AirgrabPage)
const AirgrabPageForm = Form.create()(AirgrabPageIntl)
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})
export default connect(mapStateToProps)(AirgrabPageForm)
