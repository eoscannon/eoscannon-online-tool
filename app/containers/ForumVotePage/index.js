/*
 * forumVotePage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Radio, Table, Button, InputNumber, Tooltip } from 'antd'
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
const RadioGroup = Radio.Group

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
      radio: 0,
      columnsData: [],
      scope: 'eosforumrcpp',
      lowerBound: null,
      upperBound: null,
      limit: 100
    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () {
    this.handleGetTransactionInit()
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

  handleGetTransactionInit = () => {
    this.setState({ scatterStatus: false })
    const eos = getEos(this.props.SelectedNetWork)
    // const { account, proposer, proposalName} = values
    var data = {
      code: "eosforumrcpp",
      index_position: 1,
      json: true,
      key_type: "i64",
      limit: this.state.limit,
      lower_bound: this.state.lowerBound,
      scope: this.state.scope,
      table: "proposal",
      table_key: '',
      upper_bound: this.state.upperBound
    }

    eos.getTableRows(data)
      .then(tr => {
        tr.rows.map((item, index)=>{
          item.key = index
        })
        this.setState({
          columnsData: tr.rows
        })
      })
      .catch(err => {
        console.log('err ===', err)
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
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
        console.log('err:', err)
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  onChangeRadio = (e) => {
    this.setState({
      radio: e.target.value
    })
  }

  changeScope = (e)=>{
    const { value } = e.target
    this.setState({
      scope: value
    })
  }
  changeLowerBound = (value)=>{
    console.log('value===', value)
    this.setState({
      lowerBound: value
    })
  }
  changeUpperBound = (value)=>{
    this.setState({
      upperBound: value
    })
  }
  changeLimit = (value)=>{
    this.setState({
      limit: value
    })
  }
  onSearch = ()=>{
    console.log('1111')
    this.handleGetTransactionInit()
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

    const columns = [{
      title: 'proposal_name',
      dataIndex: 'proposal_name',
      key: 'proposal_name',
      width: 150
    }, {
      title: 'proposer',
      dataIndex: 'proposer',
      key: 'proposer',
      width: 150
    }, {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      width: 200
    }, {
      title: 'proposal_json',
      dataIndex: 'proposal_json',
      key: 'proposal_json'
    }]
    return (
      <LayoutContent>
        <div>
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
        </div>
        <div>
          <Col span={24}>
            <Card title='提案列表' bordered={false}>
              <div style={{ display: 'flex', marginBottom: 30 }}>
                <Tooltip
                  title='Scope'
                  placement="topLeft"
                  overlayClassName="numeric-input"
                >
                  <Input placeholder="Scope" maxLength={18} value={this.state.scope} onChange={this.changeScope} style={{width: 130, marginRight: 20}}/>
                </Tooltip>
                <InputNumber placeholder="LowerBound" value={this.state.lowerBound} onChange={this.changeLowerBound} style={{marginRight: 20, width: 130}}/>
                <InputNumber placeholder="UpperBound" value={this.state.upperBound} onChange={this.changeUpperBound} style={{marginRight: 20, width: 130}}/>
                <Tooltip
                  title='Limit'
                  placement="topLeft"
                  overlayClassName="numeric-input"
                >
                  <InputNumber placeholder="Limit" value={this.state.limit} onChange={this.changeLimit} style={{marginRight: 20}}/>
                </Tooltip>
                <Button type="primary" icon="search" onClick={this.onSearch}>Search</Button>
              </div>
              <Table columns={columns} dataSource={this.state.columnsData} pagination={{ pageSize: 50 }} scroll={{ y: 500 }}/>
            </Card>
          </Col>
        </div>
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
