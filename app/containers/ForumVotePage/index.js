/*
 * forumVotePage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Radio } from 'antd'
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
const RadioGroup = Radio.Group;

export class ForumVotePage extends React.Component {
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
      radio: 0
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
    const { voter, statusText, radio, proxy } = values
    this.setState({
      GetTransactionButtonState: !!voter && !!radio && !!statusText,
      GetTransactionButtonScatterState: !!proxy
    })
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
    const { voter, statusText } = values
    var data = {
      voter: voter,
      proposal_name: statusText,
      vote: this.state.radio,
      vote_json: ''
    }
    console.log('data==', data)
    eos
      .transaction(
        {
          actions: [
            {
              account: 'eosforumrcpp',
              name: 'vote',
              authorization: [
                {
                  actor: voter,
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
        console.log('err:',err)
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  onChangeRadio = (e) => {
    console.log('radio2 checked', e.target.value);
    this.setState({
      radio: e.target.value,
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const VoterPlaceholder = this.state.formatMessage(
      messages.VoterPlaceholder,
    )
    const StatusText = this.state.formatMessage(messages.StatusText)

    const ForumVoteFirst = this.state.formatMessage(
      messages.ForumVoteFirst,
    )
    // const VoterLabel = this.state.formatMessage(messages.VoterLabel);
    // const ProxyLabel = this.state.formatMessage(messages.ProxyLabel);
    // const ProducersDealTranscationProxy = this.state.formatMessage(
    //   utilsMsg.ProducersDealTranscationProxy,
    // )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const options = [
      { label: '赞成', value: 1 },
      { label: '反对', value: 0 }
    ]
    return (
      <LayoutContent>
        <Col span={12}>
          <Card title={ForumVoteFirst} bordered={false}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('voter', {
                rules: [{ required: true, message: VoterPlaceholder }]
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={VoterPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('statusText', {
                rules: [
                  {
                    required: true,
                    message: StatusText
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
                  placeholder={StatusText}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('radio', {
                rules: [
                  {
                    required: true,
                    message: StatusText
                  }
                ]
              })(
                <RadioGroup options={options} onChange={this.onChangeRadio} setFieldsValue={this.state.radio} />
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

ForumVotePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const ForumVotePageIntl = injectIntl(ForumVotePage)
const ForumVotePageForm = Form.create()(ForumVotePageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(ForumVotePageForm)
