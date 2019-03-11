/*
 * MeetonePage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import { Form, Icon, Input, Card, Col, Row, Modal, Radio, Select, Table, Alert, Tag } from 'antd'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { makeSelectNetwork } from '../LanguageProvider/selectors'
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  getNewApi
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import NewScanQrcode from '../../components/NewScanQrcode'
import NewDealGetQrcode from '../../components/NewDealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search;
const { CheckableTag } = Tag;
const RadioGroup = Radio.Group;

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
      selectedTags: [],
      value2: '',
      newtransaction:{}

    }
  }
  /**
   * 链接scatter
   * */
  componentDidMount () {  }
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
   
    (async ()=>{
      try{
        var data = {
          owner: record,
          symbol: `4,MEETONE`,
          ram_payer: record
        }
        let result = await getNewApi(this.props.SelectedNetWork).transact({
          actions: [{
            account: 'airgrab.m',
            name: 'open',
            authorization: [
              {
                actor: record,
                permission: 'active'
              }
            ],
            data
          }]
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
        openTransactionFailNotification(this.state.formatMessage, err.name)
      }
    })()
  };

  onSearch=(value)=> {
    const eos = getEos('eosxmaiApi')
    eos.getAccount(value).then(data=>{
      let pubkey = data.permissions[1].required_auth.keys[0].key
      this.getKeyAccount(pubkey)
    }).catch(err=>{
      this.setState({
        keyAccounts: []
    })
    console.log('err = ',err)
  })
}

  getKeyAccount = (pubkey) => {
    const eosMeetone = getEos('meetone')
    eosMeetone.getKeyAccounts( pubkey ).then(res =>{
      var resArr = []
      for(let i in res.account_names){
        let newData = { label: '', value: '' }
        newData.label = res.account_names[i];
        newData.value = res.account_names[i];
        resArr.push(newData)
      }
      this.setState({
        keyAccounts: resArr
      })
    }).catch(err=>{
      this.setState({
        keyAccounts: []
      })
      console.log('err = ',err)
    })
  }

  checkAccountName = (rule, value, callback) => {
    value = value.toLowerCase().trim()
    this.props.form.setFieldsValue({AccountName : value})
    callback();
    return
  }

  handleChange=(e)=> {
    this.setState({
      value2: e.target.value
    });
    this.handleGetTransaction( e.target.value)
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
    // console.log('this.state.keyAccounts ',this.state.keyAccounts)
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
                  {/* {this.state.keyAccounts.map(tag=>(
                   <CheckableTag
                   style={{border: '1px solid #1890ff'}}
                   key={tag}
                   checked={selectedTags.indexOf(tag) > -1}
                   onChange={checked => this.handleChange(tag, checked)}
                   onClick={v=>this.handleGetTransaction(tag)}
                 >
                   {tag}
                 </CheckableTag>
                ))} */}

                <RadioGroup options={this.state.keyAccounts} onChange={this.handleChange} value={this.state.value2} />
               </div>
              ):null}
               
              </div>
              <NewDealGetQrcode
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                isHiddenGetTransactionButton={this.state.isHiddenGetTransactionButton}
                QrCodeValue={this.state.QrCodeValue}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
                newtransaction={this.state.newtransaction}
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
