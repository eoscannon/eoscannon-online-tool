/*
 * ProposalPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs } from 'antd'
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

export class ProposalPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      scatterStatus: false,
      GetTransactionButtonScatterState: true
    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () {}
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
    const { permission, account, proposer, proposalName } = values
    this.setState({
      GetTransactionButtonState: !!account && !!permission && !!proposer && !!proposalName })
  };
  // 点击切换的回调
  callback = key => {
    if (key === '2') {
      this.setState({ scatterStatus: true })
    } else {
      this.setState({ scatterStatus: false })
    }
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    this.setState({ scatterStatus: false })
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const values = this.props.form.getFieldsValue()
    const eos = getEos(this.props.SelectedNetWork)
    const { account, permission, proposer, proposalName} = values
    var data = {
      proposer: proposer,
      proposal_name: proposalName,
      level: {'actor': account, 'permission': permission}
    }
    console.log('data===', data)
    console.log('account===', account)
    console.log('permission===', permission)

    eos
      .transaction(
        {
          actions: [
            {
              account: 'eosio.msig',
              name: 'approve',
              authorization: [
                {
                  actor: account,
                  permission: permission
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
    const VoterPlaceholder = this.state.formatMessage(
      messages.VoterPlaceholder,
    )
    const ProxyHelp = this.state.formatMessage(messages.ProxyHelp)

    const ProxyPlaceholder = this.state.formatMessage(
      messages.ProxyPlaceholder,
    )
    // const VoterLabel = this.state.formatMessage(messages.VoterLabel);
    // const ProxyLabel = this.state.formatMessage(messages.ProxyLabel);
    const ProducersDealTranscationProxy = this.state.formatMessage(
      utilsMsg.ProducersDealTranscationProxy,
    )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const offlineSignature = this.state.formatMessage(
      utilsMsg.offlineSignature,
    )
    return (
      <LayoutContent>
        <Col span={12}>
          <Card title="步骤1/3:填写提案表单" bordered={false}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: 'account name'
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
                  placeholder='account name'
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('permission', {
                rules: [
                  {
                    required: true,
                    message: 'permission'
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
                  placeholder='permission'
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('proposer', {
                rules: [{ required: true, message: 'proposer' }]
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder='proposer'
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('proposalName', {
                rules: [
                  {
                    required: true,
                    message: 'proposal name'
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
                  placeholder='proposal name'
                />,
              )}
            </FormItem>
            <DealGetQrcode
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
            <ScanQrcode
              eos={this.state.eos}
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              SelectedNetWork={this.props.SelectedNetWork}
              transaction={this.state.transaction}
            />
          </Card>
        </Col>
      </LayoutContent>
    )
  }
}

ProposalPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const ProposalPageIntl = injectIntl(ProposalPage)
const ProposalPageForm = Form.create()(ProposalPageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(ProposalPageForm)
