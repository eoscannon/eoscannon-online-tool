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
  airgrabList,
  getNewApi
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
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
      tableColumns: [],
      newtransaction: {}
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
    if (record.method === 'claim') {
      data = {
        claimer: AccountName
      }
    }
    if (record.account === 'sovmintofeos') {
      data = {
        owner: AccountName,
        value: '5000.0000 SOV'
      }
    }
    if (record.account === 'blockbasetkn') {
      data = {
        owner: AccountName,
        quantity: '0.0000 BBT'
      }
    }
    if(record.method === 'open') {
      data = {
        owner: AccountName,
        symbol: `0.0000 ${record.symbol}`,
        ram_payer: AccountName
      }
    }
    if (record.account === 'zkstokensr4u') {
      data = {
        owner: AccountName,
        sym: `0,${record.symbol}`
      }
    }
    if (record.account === 'metpacktoken') {
      data = {
        owner: AccountName,
        sym: `4,${record.symbol}`
      }
    }
    if (record.account === 'dappairhodl1') {
      data = {
        owner: AccountName,
        ram_payer: AccountName
      }
    }
    if (record.account === 'ednazztokens') {
      data = {
        account: AccountName
      }
    }

    (async ()=>{
      try{
        let result = await getNewApi(this.props.SelectedNetWork).transact({
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
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        })

        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction)
        if(tx) {
          this.setState({
            transaction: result.serializedTransaction,
            newtransaction: tx
          })
        }
      }catch(err) {
        console.log('err ', err)
        this.setState({
          transaction: '',
          newtransaction: ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()

  };

  checkAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({AccountName: value})
    callback()
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
                  description={AirGrabAlertDescription}
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
              <FormItem>
                <Table
                  columns={this.state.tableColumns}
                  dataSource={this.state.tableData}
                  pagination={false}
                  size="middle"
                />
              </FormItem>

              <NewDealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={
                  this.state.GetTransactionButtonState
                }
                QrCodeValue={this.state.QrCodeValue}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
                newtransaction={this.state.newtransaction}
                voteByScatterClick={this.voteByScatter}
                scatterStatus={this.state.scatterStatus}
                GetTransactionButtonScatterState={
                  this.state.GetTransactionButtonScatterState
                }
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={ProducersSendTranscation} bordered={false}>
              <NewScanQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.newtransaction}
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
