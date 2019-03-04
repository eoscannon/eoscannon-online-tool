/*
 * MeetonePage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs, Select, Table, Alert, Tag } from 'antd'
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
const Search = Input.Search;
const { CheckableTag } = Tag;

export class MeetonePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      isHiddenGetTransactionButton: true, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
      scatterStatus: false,
      GetTransactionButtonScatterState: true,
      columnsData: [],
      keyAccounts: [],
      checked : false,
      selectedTags: []
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
    const { AccountName } = values
    // this.setState({
    //   GetTransactionButtonState:  !!AccountName })
  };

  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = record => {
    const eos = getEos('meetone')
    eos.getAbi('airgrab.m').then(res => {
      eos.fc.abiCache.abi(res.account_name, res.abi)
    }).catch(err=>{
      console.log('err', err)
    })
    var data = {
      owner: record,
      symbol: `4,MEETONE`,
      ram_payer: record
    }
    eos
      .transaction(
        {
          actions: [
            {
              account: 'airgrab.m',
              name: 'open',
              authorization: [
                {
                  actor: record,
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

  onSearch=(value)=> {
    const eos = getEos('main')
    eos.getAccount(value).then(data=>{
      let pubkey = data.permissions[1].required_auth.keys[0].key
      this.getKeyAccount(pubkey)
    })
  }

  getKeyAccount = (pubkey) => {
    const eosMeetone = getEos('meetone')
    eosMeetone.getKeyAccounts( pubkey ).then(res =>{
      console.log('res = ',res)
      this.setState({
        keyAccounts: res.account_names
      })
    }).catch(err=>{
      console.log('err = ',err)
    })
  }

  checkAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({AccountName : value})
    callback();
    return
  }
  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    this.handleGetTransaction(tag)
    this.setState({ selectedTags: nextSelectedTags });
  }




  render () {
    const { selectedTags } = this.state;

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
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [{
                    required: true,
                     message: OwnerPlaceholder,
                     validator: this.checkAccountName
                    }]
                })(
                  <Search
                  placeholder={OwnerPlaceholder}
                  onSearch={value => this.onSearch(value)}
                  enterButton
                />
                )}
              </FormItem>
              <div style={{marginBottom: '1rem'}}>
              {this.state.keyAccounts.length>0?(
               <div>
                  {this.state.keyAccounts.map(tag=>(
                   <CheckableTag
                   style={{border: '1px solid #1890ff'}}
                   key={tag}
                   checked={selectedTags.indexOf(tag) > -1}
                   onChange={checked => this.handleChange(tag, checked)}
                   onClick={v=>this.handleGetTransaction(tag)}
                 >
                   {tag}
                 </CheckableTag>
                ))}
               </div>
              ):null}
               
              </div>
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                isHiddenGetTransactionButton={this.state.isHiddenGetTransactionButton}
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

MeetonePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const MeetonePageIntl = injectIntl(MeetonePage)
const MeetonePageForm = Form.create()(MeetonePageIntl)

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

export default connect(mapStateToProps)(MeetonePageForm)
