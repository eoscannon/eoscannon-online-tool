/*
 * ProposalPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Select } from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { makeSelectNetwork } from '../LanguageProvider/selectors'
import {
  formItemLayout,
  getNewApi,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item
const Option = Select.Option

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
      GetTransactionButtonScatterState: true,
      newtransaction:{},
      isHiddenGetTransactionButton: true
    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () {
    //获取URL 参数
   if( this.props.location.search ){
    this.setState({addSymbol : true})
    const query = this.props.location.search 
    const arr = query.split('?')[1].split('&') // ['?s=', 'f=7']
    var newArr = {}
    for(let i in arr){
      let data = arr[i].split('=')
      newArr[data[0]] = data[1]
    }

    // 接收到数据后插入表格
    setTimeout(()=>{
      try{
        this.props.form.setFieldsValue({
          proposer: newArr.proposer,
          proposalName:newArr.proposal
        })
        }catch(err){
          console.log('err == ',err)
        }
      },500)
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
    (async ()=>{
      try{
        this.setState({ scatterStatus: false })
        if (!this.state.GetTransactionButtonState) {
          return
        }
        const values = this.props.form.getFieldsValue()
        const { account, permission, proposer, proposalName} = values
        var data = {
          proposer: proposer,
          proposal_name: proposalName,
          level: {'actor': account, 'permission': permission}
        }
    
        let result = await getNewApi(this.props.SelectedNetWork).transact({
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

  handleChange=(value)=> {
    console.log(`selected ${value}`)
  }


  checkaccount = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({account : value})
    callback();
    return
  }

  checkpermission = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({permission : value})
    callback();
    return
  }

  checkproposer = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({proposer : value})
    callback();
    return
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const CreatorAccountNamePlaceholder = this.state.formatMessage(
      messages.CreatorAccountNamePlaceholder,
    )
    const ProposalFirstOne = this.state.formatMessage(messages.ProposalFirstOne)

    const ProposalPermission = this.state.formatMessage(
      messages.ProposalPermission,
    )
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    // const VoterLabel = this.state.formatMessage(messages.VoterLabel);
    // const ProxyLabel = this.state.formatMessage(messages.ProxyLabel);
    const Proposaler = this.state.formatMessage(
      messages.Proposaler,
    )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    const ProposalName = this.state.formatMessage(
      messages.ProposalName,
    )
    // const children = ['active', 'owner']
    return (
      <LayoutContent>
        <Col span={12}>
          <Card title={ProducersDealTranscation} bordered={false}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: CreatorAccountNamePlaceholder,
                    validator: this.checkaccount
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
                  placeholder={CreatorAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('permission', {
                rules: [
                  {
                    required: true,
                    message: ProposalPermission,
                    validator: this.checkpermission
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
                  placeholder={ProposalPermission}
                />,

              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('proposer', {
                rules: [{
                   required: true,
                    message: Proposaler,
                    validator: this.checkproposer
                    }]
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={Proposaler}
                />,
              )}

            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('proposalName', {
                rules: [
                  {
                    required: true,
                    message: ProposalName
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon
                      type="profile"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={ProposalName}
                />,
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
