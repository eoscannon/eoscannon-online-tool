/*
 * forumVotePage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Radio, Table, Button, InputNumber, Tooltip, Select, Progress } from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { makeSelectNetwork } from '../LanguageProvider/selectors'
import {
  formItemLayout,
  getNewApi,
  openTransactionFailNotification
} from '../../utils/utils'
import { List } from '../../utils/antdUtils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'
import { now } from 'moment'
import zan from './zan.svg'
import cai from './cai.svg'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class ForumVotePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: {},
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      scatterStatus: false,
      GetTransactionButtonScatterState: true,
      radio: 0,
      radioFormList: 0,
      columnsData: [],
      scope: 'eosforumrcpp',
      lowerBound: null,
      upperBound: null,
      limit: 100,
      creatTimeData: [],
      newtransaction:{},
      isHiddenGetTransactionButton: true
    }
  }
  /**
   * 链接scatter
   **/
  componentDidMount () {
    this.handleGetTransactionInit()
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }

  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { voter, statusText, proxy } = values
    this.setState({
      GetTransactionButtonState: !!voter && !!statusText,
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
    this.mounted = true;
    fetch('https://s3.amazonaws.com/api.eosvotes.io/eosvotes/tallies/latest.json', {
      method: 'GET'
    }).then((response)=> {
      response.status // => number 100–599
      response.statusText // => String
      response.headers // => Headers
      response.url // => String
      response.text().then(responseText => {
        responseText = JSON.parse(responseText)
        function * values (responseText) {
          for (let prop of Object.keys(responseText)) // own properties, you might use
          {yield responseText[prop]}
        }
        let arr = Array.from(values(responseText))

        if(this.mounted) {
          this.setState({
            columnsData: arr
          })  
          this.handleChange({key: '2'})
        }
        
      })
    })
  };

  handleGetTransactionChange = () => {
    this.setState({ scatterStatus: false })
    fetch('https://s3.amazonaws.com/api.eosvotes.io/eosvotes/tallies/latest.json', {
      method: 'GET'
    }).then((response)=> {
      response.status // => number 100–599
      response.statusText // => String
      response.headers // => Headers
      response.url // => String
      response.text().then(responseText => {
        responseText = JSON.parse(responseText)
        function * values (responseText) {
          for (let prop of Object.keys(responseText)) // own properties, you might use
          {yield responseText[prop]}
        }
        let arr = Array.from(values(responseText))
          this.setState({
            columnsData: arr
          })
          this.handleChange({key: '2'})
      })
    })
  };

  sortVotes = (arr)=>{
    for(let i = 0;i < arr.length;i++) {
      for(let j = 0;j < arr.length - 1 - i;j++) {
        if(arr[j].stats.votes.total < arr[j + 1].stats.votes.total) {
          let temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  }

  sortExpired =(arr)=>{
    for(let i = 0;i < arr.length;i++) {
      for(let j = 0;j < arr.length - 1 - i;j++) {
        if(new Date(arr[j].proposal.expires_at).getTime() < new Date(arr[j + 1].proposal.expires_at).getTime()) {
          let temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  }

  sortCreated =(arr)=>{
    for(let i = 0;i < arr.length;i++) {
      for(let j = 0;j < arr.length - 1 - i;j++) {
        if(new Date(arr[j].proposal.created_at).getTime() < new Date(arr[j + 1].proposal.created_at).getTime()) {
          let temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  }
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    (async ()=>{
      try{
        this.setState({ scatterStatus: false })
        if (!this.state.GetTransactionButtonState) {
          return
        }
        const values = this.props.form.getFieldsValue()
        const { voter, statusText } = values
        var data = {
          voter: voter,
          proposal_name: statusText,
          vote: this.state.radio,
          vote_json: ''
        }
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [
            {
              account: 'eosio.forum',
              name: 'vote',
              authorization: [
                {
                  actor: voter,
                  permission: 'active'
                }
              ],
              data
            }
          ],
        }, {
          broadcast: false,
          sign: false,
          blocksBehind: 3,
          expireSeconds: 3600
        });
       
        var tx = getNewApi(this.props.SelectedNetWork).deserializeTransaction(result.serializedTransaction);
        if(tx)
        this.setState({
          transaction: result.serializedTransaction,
          newtransaction : tx
        })
      }catch(err){
        console.log('err ',err)
        this.setState({
          transaction: '',
          newtransaction : ''
        })
        openTransactionFailNotification(this.state.formatMessage, err.name)

      }
    })()
  };

  onChangeRadio = (e) => {
    this.setState({
      radio: e.target.value
    })
  }

  onChangeRadioFormList= (e) => {
    // console.log('e = ', e)
    this.setState({
      radioFormList: e.target.value
    })
    this.props.form.setFieldsValue({
      statusText: e.target.value
    })
  }

  changeScope = (e)=>{
    const { value } = e.target
    this.setState({
      scope: value
    })
  }
  changeLowerBound = (value)=>{
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
    this.handleGetTransactionChange()
  }

  handleChange=(key)=>{
    if(key.key === '2') {
      let data = this.sortVotes(this.state.columnsData)
      this.setState({
        columnsData: data
      })
    }else if(key.key === '0') {
      let data = this.sortCreated(this.state.columnsData)
      this.setState({columnsData: data})
    }else if(key.key === '1') {
      let data = this.sortExpired(this.state.columnsData)
      this.setState({columnsData: data})
    }
  }

  getTime = (time)=>{
    let nowTime = new Date(new Date(time).getTime() + 8 * 60 * 60 * 1000)
    let year = nowTime.getFullYear()
    let mon = nowTime.getMonth() >= 10 ? nowTime.getMonth() + 1 : '0' + (nowTime.getMonth() + 1)
    let date = nowTime.getDate() >= 10 ? nowTime.getDate() : '0' + nowTime.getDate()
    let hours = nowTime.getHours() >= 10 ? nowTime.getHours() : '0' + nowTime.getHours()
    let min = nowTime.getMinutes() >= 10 ? nowTime.getMinutes() : '0' + nowTime.getMinutes()
    let second = nowTime.getSeconds() >= 10 ? nowTime.getSeconds() : '0' + nowTime.getSeconds()
    return year + '-' + mon + '-' + date + '  ' + hours + ':' + min + ':' + second
  }

  formatJson =(data)=>{
    let list = JSON.parse(data.toString())
    return list
  }


  checkvoter = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({voter : value})
    callback();
    return
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const VoterPlaceholder = this.state.formatMessage(
      messages.VoterPlaceholder,
    )
    const StatusText = this.state.formatMessage(messages.StatusText)
    const LabelApprove = this.state.formatMessage(messages.LabelApprove)
    const LabelAgaist = this.state.formatMessage(messages.LabelAgaist)
    const ProposalList = this.state.formatMessage(messages.ProposalList)
    const ProposalListFounder = this.state.formatMessage(messages.ProposalListFounder)
    const ProposalListCreatedTime = this.state.formatMessage(messages.ProposalListCreatedTime)
    const ProposalListExpiredTime = this.state.formatMessage(messages.ProposalListExpiredTime)
    const ProposalListAgreee = this.state.formatMessage(messages.ProposalListAgreee)
    const ProposalListVoter = this.state.formatMessage(messages.ProposalListVoter)
    const ProposalListAginst = this.state.formatMessage(messages.ProposalListAginst)
    const ProposalListVoterQuantity = this.state.formatMessage(messages.ProposalListVoterQuantity)
    const ProposalListExpiredSort = this.state.formatMessage(messages.ProposalListExpiredSort)
    const ProposalListCreatedSort = this.state.formatMessage(messages.ProposalListCreatedSort)

    const ForumVoteFirst = this.state.formatMessage(
      messages.ForumVoteFirst,
    )

    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const options = [
      { label: LabelApprove, value: 1 },
      { label: LabelAgaist, value: 0 }
    ]

    return (
      <LayoutContent>
        <div>
          <Col span={12}>
            <Card title={ForumVoteFirst} bordered={false}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('voter', {
                  rules: [{
                     required: true,
                      message: VoterPlaceholder,
                      validator: this.checkvoter
                    }]
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
                      message: StatusText,
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
                isHiddenGetTransactionButton={this.state.isHiddenGetTransactionButton}
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
        </div>
        <div>
          <Col span={24}>
            <Card title={ProposalList} bordered={false}>
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
                <Select labelInValue defaultValue={{ key: ProposalListVoterQuantity }} style={{ width: 180 }} onChange={this.handleChange} style={{marginRight: 20}}>
                  <Option value="0">{ProposalListCreatedSort}</Option>
                  <Option value="1">{ProposalListExpiredSort}</Option>
                  <Option value="2">{ProposalListVoterQuantity}</Option>
                </Select>
                <Button type="primary" icon="search" onClick={this.onSearch}>Search</Button>
              </div>
              <RadioGroup onChange={this.onChangeRadioFormList} name="radiogroup" defaultValue={0} style={{ width: '100%' }}>

                <List
                  itemLayout="horizontal"
                  dataSource={this.state.columnsData}
                  renderItem={(item, index) => (
                    <List.Item>
                      <div style={{ display: 'flex', width: '100%' }}>
                        <Radio value={item.proposal.proposal_name} key={item.proposal.proposal_name}></Radio>
                        <Link to={{ pathname: '/forumDetail', query: { item: item } }} style={{width: '100%' }}>
                          <div style={{display: 'flex', justifyContent: 'space-between',color: '#8c98ba'}}>
                            <span>ID : {item.proposal.proposal_name}</span>
                            <span>{ProposalListFounder} : {item.proposal.proposer}</span>
                          </div>
                          <div style={{fontSize: '16px', fontWeight: 'bold', padding: '8px 0', color: '#000'}}>{item.proposal.title}</div>
                          {/* <div style={{padding: '0px 0px 10px 0'}}>
                            <pre style={{whiteSpace: "pre-wrap",wordWrap:'break-word',wordBreak:'break-all'}}>{(this.formatJson(item.proposal.proposal_json).content)}</pre>
                          </div> */}
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{color: '#8c98ba'}}>{ProposalListCreatedTime}:{this.getTime(item.proposal.created_at)}</span>
                            <span style={{color: '#8c98ba'}}>{ProposalListExpiredTime}:{this.getTime(item.proposal.expires_at)}</span>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0'}}>
                            <span style={{color: '#77b163'}}><Icon type="like" style={{ color: '#77b163', verticalAlign: 'initial'}}/> {ProposalListAgreee}:{item.stats.staked[1] / 10000 } EOS({item.stats.votes[1] || 0 } {ProposalListVoter})</span>
                            <span style={{color: '#f1496c'}}><Icon type="dislike" style={{ color: '#f1496c', verticalAlign: 'initial'}}/> {ProposalListAginst}:{item.stats.staked[0] / 10000} EOS({item.stats.votes[0] || 0 } {ProposalListVoter})</span>
                          </div>
                          <div>
                            <Progress percent={Number((item.stats.staked[1] / item.stats.staked.total * 100).toFixed(2))} strokeColor='#82bf5c' strokeWidth= {13} />
                          </div>
                        </Link>
                      </div>
                    </List.Item>
                  )}
                />
              </RadioGroup>

              {/* <Table columns={columns} bordered rowSelection={rowSelection} dataSource={this.state.columnsData} pagination={{ pageSize: 50 }} scroll={{ y: 500 }}/> */}
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
