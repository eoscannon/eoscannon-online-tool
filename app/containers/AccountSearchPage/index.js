/*
 * AccountSearchPage
 *
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, Select, message, Tabs, Table, Tag, Button, AutoComplete, Card, Tooltip, InputNumber, Radio } from 'antd'
import { Progress, Input } from 'utils/antdUtils'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors'
import styleComps from './styles'

// import { push } from 'react-router-redux';

import { getEos, symbolList, symbolListWorbli } from '../../utils/utils'
import { LayoutContentBox, FormComp } from '../../components/NodeComp'
import messages from './messages'
import config from './../../config'

const { Search } = Input
const { Option } = Select
const { TabPane } = Tabs
const { CheckableTag } = Tag

export class AccountSearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      info: '',
      formatMessage: this.props.intl.formatMessage,
      account: '',
      createTime: '',
      balance: 0,
      stake: 0,
      voteNode: [],
      voteNodeStatus: false,
      memoryContent: '',
      cpuContent: '',
      networkContent: '',
      cpuStake: '0',
      cpuMortgage: '0',
      networkStake: '0',
      networkMortgage: '0',
      memoryScale: 0,
      cpuScale: 0,
      networkScale: 0,
      symbolBlance: 0,
      symbolCode: 'EOS(eosio.token)',
      voteProxy: '',
      accountSearch: '',
      powerAddress: [],
      symbolNet: 'EOS',
      columnsData: [],
      checked: 'keydata',
      limit: 100,
      columnsMykey: [],
      lowerBound: '',
      upperBound: '',
      scope: '',
      eos: {},
      mykeyVisvible: false,
      tableRows: []
    }
  }
  componentWillReceiveProps (nextProps) {

    if (nextProps.match.params.account) {
      this.handleSearch(nextProps.match.params.account)
      this.setState({ account: nextProps.match.params.account })
    }
    if(nextProps.SelectedNetWork === 'test') {
      this.setState({
        symbolNet: 'WBI'
      })
    }
    const eos = getEos(this.props.SelectedNetWork)
    this.setState({eos: eos})
    // console.log('SelectedNetWork  == ',this.props.SelectedNetWork)

  }

  componentDidMount () {
    const eos = getEos(this.props.SelectedNetWork)
    this.setState({eos: eos})
    if (this.props.match.params.account) {
      this.handleSearch(this.props.match.params.account)
    }
    if(this.props.SelectedNetWork === 'test') {
      this.setState({
        symbolNet: 'WBI'
      })
    }
  }

  handleChange = key => {
    let firstSymbol = key.split('(')
    var newContract = firstSymbol[1].split(')')
    var newSymbol = key.split(' ')
    this.state.eos
      .getCurrencyBalance({
        code: newContract[0],
        account: this.state.account.trim(),
        symbol: newSymbol[0]
      })
      .then(res => {
        this.setState({
          symbolBlance: res[0] || 0,
          symbolCode: newContract[0]
        })
      })
      .catch(() => {
        message.error(this.state.formatMessage(messages.FunctionSearchNoData))
        this.setState({
          balance: 0,
          symbolBlance: 0,
          symbolCode: ''
        })
      })
  };

  onChangeAccount = e => {
    this.setState({ accountSearch: e.target.value })
  };
  // 搜索mykey账户信息
  // handSearchTableRows = (checked)=>{
  //   this.onSearch(checked)

  // }
  // mykey 账户切换 选项
  handleChangeCheck = e =>{
    // console.log('handleChangeCheck==',e.target.value)
    this.setState({ checked: e.target.value, columnsData: [], columnsData: []})

    if(e.target.value === 'keydata') {
      this.setState({
        columnsMykey: [{
          title: this.state.formatMessage(
            messages.FunctionSearchActionIndex,
          ),
          dataIndex: 'index',
          key: 'index',
          width: 150
        }, {
          title: this.state.formatMessage( messages.FunctionSearchActionKey),
          key: 'keyData',
          width: 300,
          render: (text, record)=>(
            <div>
              <div><span>{this.state.formatMessage(messages.FunctionSearchActionPubkey )}:</span> {record.keyData.pubkey}</div>
              <div><span>{this.state.formatMessage(messages.FunctionSearchActionStatus )}  :</span> {record.keyData.status}</div>
              <div><span>{this.state.formatMessage(messages.FunctionSearchActionNonce )}  :</span> {record.keyData.nonce}</div>
            </div>
          )
        }]
      })
    }else if(e.target.value === 'backupdata') {
      this.setState({ columnsMykey: [{
        title:  this.state.formatMessage(messages.FunctionSearchActionIndex ),
        dataIndex: 'index',
        key: 'index',
        width: 50
      }, {
        title: this.state.formatMessage(messages.FunctionSearchActionBackupPeople ),
        dataIndex: 'value',
        key: 'value',
        width: 350
      }]})
    }else if(e.target.value === 'subacct') {
      this.setState({ columnsMykey: [{
        title:  this.state.formatMessage(messages.FunctionSearchActionSubAccount ),
        dataIndex: 'sub_account',
        key: 'sub_account'
      }, {
        title: this.state.formatMessage(messages.FunctionSearchActionSubAdminKey ),
        key: 'sub_admin_key',
        render: (text, record)=>(
          <div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionPubkey )}:</span> {record.sub_admin_key.pubkey}</div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionStatus )}  :</span> {record.sub_admin_key.status}</div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionNonce )}  :</span> {record.sub_admin_key.nonce}</div>
          </div>
        )
      }, {
        title: this.state.formatMessage(messages.FunctionSearchActionSubExternalKey ),
        key: 'sub_external_key',
        render: (text, record)=> (
          <div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionPubkey )} :</span> {record.sub_external_key.pubkey}</div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionStatus )}  :</span> {record.sub_external_key.status}</div>
            <div><span>{this.state.formatMessage(messages.FunctionSearchActionNonce )}  :</span> {record.sub_external_key.nonce}</div>
          </div>
        )
      }, {
        title: this.state.formatMessage(messages.FunctionSearchActionWhiteList ),
        dataIndex: 'whitelist',
        key: 'whitelist',
        render: whitelist => (
          <span>
            {whitelist.map(v => <span color="blue" key={v}>{v}</span>)}
          </span>
        )
      }, {
        title: this.state.formatMessage(messages.FunctionSearchActionExassetList ),
        dataIndex: 'exasset_list',
        key: 'exasset_list',
        width: 200,
        render: (exasset_list)=>(
          <div>
            {exasset_list.map((v, i)=>
              <div key={i}>
                <div><span>{this.state.formatMessage(messages.FunctionSearchActionQuantity )}:</span> {v.quantity}</div>
                <div><span>{this.state.formatMessage(messages.FunctionSearchActionContract )}:</span> {v.contract}</div>
              </div>)}
          </div>
        )
      }
      ]})
    }else if(e.target.value === 'subassetsum') {
      this.setState({
        columnsMykey: [{
          title:  this.state.formatMessage(messages.FunctionSearchActionIndex),
          dataIndex: 'key',
          key: 'key'
        }, {
          title: this.state.formatMessage(messages.FunctionSearchActionSubAdminKey ),
          dataIndex: 'main_account',
          key: 'main_account'
        }, {
          title: this.state.formatMessage(messages.FunctionSearchActionExassetList ),
          dataIndex: 'exasset_list',
          key: 'exasset_list',
          render: (exasset_list)=>(
            <div>
              {exasset_list.map((v, i) =>
                <div key={i}>
                  <div><span>{this.state.formatMessage(messages.FunctionSearchActionQuantity )}:</span> {v.quantity}</div>
                  <div><span>{this.state.formatMessage(messages.FunctionSearchActionContract )}:</span> {v.contract}</div>
                </div>)}
            </div>
          )
        }]})
    }
    // console.log(' this.state.columnsMykey== ', this.state.columnsMykey)
    try{
      this.onSearch({target: {value: e.target.value}})
    }catch(err){
      console.log('err === ',err)
    }
  }

  // 主程搜索数据
  handleSearch = value => {
    // this.props.dispatch(push('/login'));
    this.setState({
      accountSearch: value,
      account: value
    })
    const eos = getEos(this.props.SelectedNetWork)
    let stake = 0
    let cpuBack
    let netWork
    let cpuScale
    let netScale
    eos
      .getAccount({ account_name: value })
      .then(info => {
        if (info.total_resources) {
          this.setState({
            cpuStake: info.total_resources.cpu_weight,
            networkStake: info.total_resources.net_weight
          })
          let symbolType = info.total_resources.cpu_weight.split(' ')[1]
          this.setState({
            symbolNet: symbolType
          })
        }
        if (info.voter_info) {
          this.setState({ voteProxy: info.voter_info.proxy })
          if (info.voter_info.producers.length > 0) {
            this.setState({
              voteNodeStatus: true,
              voteNode: info.voter_info.producers
            })
          } else {
            this.setState({
              voteNodeStatus: false,
              voteNode: []
            })
          }
        } else {
          this.setState({
            voteNodeStatus: false,
            voteNode: []
          })
        }
        if (info.voter_info) {
          stake = `${info.voter_info.staked / 10000} ` + this.state.symbolNet
        }
        if (info.refund_request) {
          cpuBack = info.refund_request.cpu_amount
          netWork = info.refund_request.net_amount
        } else {
          cpuBack = '0 ' + this.state.symbolNet
          netWork = '0 ' + this.state.symbolNet
        }
        if (info.cpu_limit.used) {
          cpuScale = ((info.cpu_limit.used / info.cpu_limit.max) * 100).toFixed(
            2,
          )
        } else {
          cpuScale = 0
        }
        if (info.net_limit.used) {
          netScale = ((info.net_limit.used / info.net_limit.max) * 100).toFixed(
            2,
          )
        } else {
          netScale = 0
        }

        this.setState({
          info,
          createTime: info.created,
          stake,
          memoryContent: `${(info.ram_usage / 1024).toFixed(2)} Kib/${(
            info.ram_quota / 1024
          ).toFixed(2)} Kib`,
          cpuContent: `${info.cpu_limit.used / 1000} ms/${info.cpu_limit.max /
            1000} ms`,
          networkContent: `${info.net_limit.used} bytes/${(
            info.net_limit.max /
            1024 /
            1024
          ).toFixed(2)} Mib`,
          cpuMortgage: cpuBack,
          networkMortgage: netWork,
          memoryScale: Number(
            (
              (Math.round(info.ram_usage) / Math.round(info.ram_quota)) *
              100
            ).toFixed(2),
          ),
          cpuScale: Number(Number(cpuScale).toFixed(2)),
          networkScale: Number(Number(netScale).toFixed(2))
        })
        // 对CPU,内存，网络为0 / -1 时的操作
        if (info.ram_quota <= 0) {
          this.setState({
            memoryContent: `${(info.ram_usage / 1024).toFixed(
              2,
            )} Kib/unlimited`
          })
        }
        if (info.cpu_limit.max <= 0) {
          this.setState({
            cpuContent: 'unlimited/unlimited'
          })
        }
        if (info.net_limit.max <= 0) {
          this.setState({
            networkContent: 'unlimited/unlimited'
          })
        }

        // console.log('info.permissions===', info.permissions)
        try {
          this.state.powerAddress = []
          if (info.permissions.length > 0) {
            for (let i = 0; i < info.permissions.length; i++) {
              const object = {}
              object.key = i
              object.name = info.permissions[i].perm_name
              object.address = info.permissions[i].required_auth.keys[0].key
              this.state.powerAddress.push(object)
            }
            // console.log('powerAddress===', this.state.powerAddress);
          }
        } catch (err) {
          console.log('err==', err)
        }
        eos
          .getCurrencyBalance({
            code: 'eosio.token',
            account: value,
            symbol: this.state.symbolNet
          })
          .then(res => {
            this.setState({
              balance: res[0] || 0,
              symbolBlance: res[0] || 0,
              symbolCode: 'eosio.token'
            })
          })
          .catch(() => {
            message.error(
              this.state.formatMessage(messages.FunctionSearchNoData),
            )
          })
          // 设置mykey data
        this.setState({scope: this.state.account})
        try{
          this.handleChangeCheck({target: {value: 'keydata'}})
        } catch(err) {
          console.log('err == ', err)
        }
      })
      .catch(() => {
        message.error(this.state.formatMessage(messages.FunctionSearchNoData))
        this.setState({ info: '' })
      })
  };

  handleSendTransaction = value => {
    this.props.history.push({
      pathname: '/transfer',
      state: {
        name: value.name,
        address: value.address,
        account: this.state.account
      }
    })
  };

  changeLimit = value=>{
    this.setState({
      limit: value
    })
  }

  changeScope = (e)=>{
    const { value } = e.target
    this.setState({
      scope: value
    })
  }

  changeLowerBound = (value)=>{
    // console.log('value===', value)
    this.setState({
      lowerBound: value
    })
  }

  changeUpperBound = (value)=>{
    this.setState({
      upperBound: value
    })
  }

  onSearch = (checked)=>{
    // console.log('checked == ', checked)
    var checkdata
    try{
      if(checked.target.value) {
        checkdata = checked.target.value
      }else{
        checkdata = this.state.checked
      }
    }catch(err) {
      console.log('err == ', err)
      checkdata = this.state.checked
    }
    // console.log('checkdata ===',checkdata)
    const eos = getEos(this.props.SelectedNetWork)

    let data = {
      'code': this.props.SelectedNetWork === 'kylin' ? config.networkCodeArr[0] : config.networkCodeArr[1],
      'json': true,
      'limit': this.state.limit,
      'lower_bound': this.state.lowerBound,
      'scope': this.state.scope || this.state.account,
      'table': checkdata,
      'upper_bound': this.state.upperBound
    }
    eos.getTableRows(data).then(v=>{
      var dataNew = []
      // console.log('v== ', v)
      // console.log('this.state.checked == ', this.state.checked)
      if(this.state.checked === 'keydata') {
        v.rows.map((v, i)=>{
          dataNew.push({
            key: i,
            index: i,
            keyData: v.key
          })
        })
      }else if(this.state.checked === 'backupdata') {
        v.rows.map((v, i)=>{
          dataNew.push({
            key: i,
            index: v.index,
            value: v.value
          })
        })
      }else if(this.state.checked === 'subacct') {
        v.rows.map((v, i)=>{
          dataNew.push({
            key: i,
            ...v
          })
        })
      }else if(this.state.checked === 'subassetsum') {
        v.rows.map((v, i)=>{
          dataNew.push({
            key: i,
            ...v
          })
        })
      }
      // console.log(' this.state.columnsData== ', this.state.columnsData)
      this.setState({columnsData: dataNew, mykeyVisvible: true})
    }).catch(err=>{
      this.setState({mykeyVisvible: false})
      console.log('err == ', err)
    })
  }

  render () {
    const FunctionSearchButton = this.state.formatMessage(
      messages.FunctionSearchButton,
    )
    const FunctionSearchAccount = this.state.formatMessage(
      messages.FunctionSearchAccount,
    )
    const FunctionSearchCreateTime = this.state.formatMessage(
      messages.FunctionSearchCreateTime,
    )
    const FunctionSearchEOSBalance = this.state.formatMessage(
      messages.FunctionSearchEOSBalance,
    )
    const FunctionSearchEOSStake = this.state.formatMessage(
      messages.FunctionSearchEOSStake,
    )
    const FunctionSearchEOSVoteProxy = this.state.formatMessage(
      messages.FunctionSearchEOSVoteProxy,
    )
    const FunctionSearchEOSVoteNode = this.state.formatMessage(
      messages.FunctionSearchEOSVoteNode,
    )
    const FunctionSearchMemory = this.state.formatMessage(
      messages.FunctionSearchMemory,
    )
    const FunctionSearchCPUStake = this.state.formatMessage(
      messages.FunctionSearchCPUStake,
    )
    const FunctionSearchNetStake = this.state.formatMessage(
      messages.FunctionSearchNetStake,
    )
    const FunctionSearchNet = this.state.formatMessage(
      messages.FunctionSearchNet,
    )
    const FunctionSearchCPURefund = this.state.formatMessage(
      messages.FunctionSearchCPURefund,
    )
    const FunctionSearchNetRefund = this.state.formatMessage(
      messages.FunctionSearchNetRefund,
    )
    const FunctionSearchAccountBalance = this.state.formatMessage(
      messages.FunctionSearchAccountBalance,
    )
    const FunctionSearchAccountPublic = this.state.formatMessage(
      messages.FunctionSearchAccountPublic,
    )
    const FunctionSearchAccountSyblom = this.state.formatMessage(
      messages.FunctionSearchAccountSyblom,
    )
    const FunctionSearchAccountTableBalance = this.state.formatMessage(
      messages.FunctionSearchAccountTableBalance,
    )
    const FunctionSearchAccountTableContact = this.state.formatMessage(
      messages.FunctionSearchAccountTableContact,
    )

    const FunctionSearchAccountTableGroup = this.state.formatMessage(
      messages.FunctionSearchAccountTableGroup,
    )
    const FunctionSearchAccountTableAddress = this.state.formatMessage(
      messages.FunctionSearchAccountTableAddress,
    )
    const FunctionSearchAccountPlaceHolder = this.state.formatMessage(
      messages.FunctionSearchAccountPlaceHolder,
    )
    const FunctionSearchAction = this.state.formatMessage(
      messages.FunctionSearchAction,
    )
    const FunctionSearchActionTransfer = this.state.formatMessage(
      messages.FunctionSearchActionTransfer,
    )

    const FunctionSearchActionIndex = this.state.formatMessage(
      messages.FunctionSearchActionIndex,
    )
    const FunctionSearchActionKey = this.state.formatMessage(
      messages.FunctionSearchActionKey,
    )
    const FunctionSearchActionBackupPeople = this.state.formatMessage(
      messages.FunctionSearchActionBackupPeople,
    )
    const FunctionSearchActionSubAccount = this.state.formatMessage(
      messages.FunctionSearchActionSubAccount,
    )
    const FunctionSearchActionSubAdminKey = this.state.formatMessage(
      messages.FunctionSearchActionSubAdminKey,
    )
    const FunctionSearchActionSubExternalKey = this.state.formatMessage(
      messages.FunctionSearchActionSubExternalKey,
    )
    const FunctionSearchActionWhiteList = this.state.formatMessage(
      messages.FunctionSearchActionWhiteList,
    )
    const FunctionSearchActionExassetList = this.state.formatMessage(
      messages.FunctionSearchActionExassetList,
    )
    const FunctionSearchActionPubkey = this.state.formatMessage(
      messages.FunctionSearchActionPubkey,
    )  
    const FunctionSearchActionStatus = this.state.formatMessage(
      messages.FunctionSearchActionStatus,
    )
    const FunctionSearchActionNonce = this.state.formatMessage(
      messages.FunctionSearchActionNonce,
    )
    const FunctionSearchActionQuantity = this.state.formatMessage(
      messages.FunctionSearchActionQuantity,
    )
    const FunctionSearchActionContract = this.state.formatMessage(
      messages.FunctionSearchActionContract,
    )
    const columnsBlance = [
      {
        title: FunctionSearchAccountTableBalance,
        dataIndex: 'name'
      },
      {
        title: FunctionSearchAccountTableContact,
        dataIndex: 'address'
      },
      {
        title: FunctionSearchAction,
        key: 'action',
        align: 'center',
        render: (text, record) => {
          const ButtonDisabled = !record.name
          return (
            <span>
              <Button
                disabled={ButtonDisabled}
                type="primary"
                size="small"
                onClick={() => this.handleSendTransaction(record)}
              >
                {FunctionSearchActionTransfer}
              </Button>
            </span>
          )
        }
      }
    ]

    const dataBlance = [
      {
        key: 1,
        name: this.state.symbolBlance,
        address: this.state.symbolCode
      }
    ]

    const columns = [
      {
        title: FunctionSearchAccountTableGroup,
        dataIndex: 'name'
      },
      {
        title: FunctionSearchAccountTableAddress,
        dataIndex: 'address'
      }
    ]

    const data = this.state.powerAddress
    const children = symbolList.map((item) => (
      <Option key={item.symbol + ' (' + item.contract + ')'} label={item.contract}>{item.symbol} ({item.contract})</Option>
    ))

    const childrenWorbli = symbolListWorbli.map((item) => (
      <Option key={item.symbol + ' (' + item.contract + ')'} label={item.contract}>{item.symbol} ({item.contract})</Option>
    ))

    console.log('this.state.account  == ',this.state.account)

    return (
      <LayoutContentBox>
        <styleComps.ConBox>
          <FormComp style={{ width: '50%' }}>
            <Search
              placeholder={FunctionSearchAccountPlaceHolder}
              enterButton={FunctionSearchButton}
              size="large"
              onChange={this.onChangeAccount}
              value={this.state.accountSearch.trim()}
              onSearch={this.handleSearch}
            />
          </FormComp>
          {this.state.info ? (
            <div>
              <div className="content">
                <div className="firstContent">
                  <span>
                    {FunctionSearchAccount}：{this.state.account}
                  </span>
                  <span>
                    {FunctionSearchCreateTime}：{this.state.createTime}
                  </span>
                  <span>
                    {this.state.symbolNet}{FunctionSearchEOSBalance}：{this.state.balance}
                  </span>
                  <span>
                    {this.state.symbolNet}{FunctionSearchEOSStake}：{this.state.stake}
                  </span>
                  {this.state.voteProxy ? (
                    <span>
                      {FunctionSearchEOSVoteProxy}：<Link
                        to={`/accountSearch/${this.state.voteProxy}`}
                      >
                        {this.state.voteProxy}
                      </Link>
                    </span>
                  ) : null}
                  {this.state.voteNodeStatus ? (
                    <span>
                      {FunctionSearchEOSVoteNode}：<br />
                      {this.state.voteNode.map((item, i) => (
                        <Link to={`/accountSearch/${item}`} key={i}>
                          <Tag>{item}</Tag>
                        </Link>
                      ))}
                    </span>
                  ) : null}
                </div>
                <div className="secondContent">
                  <div className="contentDetail">
                    <Progress
                      type="dashboard"
                      percent={this.state.memoryScale}
                    />
                    <div className="contentDetailDesc">
                      <span>{this.state.memoryContent}</span>
                      <span className="contentDetailDescTitle">
                        {FunctionSearchMemory}
                      </span>
                    </div>
                  </div>
                  <div className="contentDetail">
                    <Progress type="dashboard" percent={this.state.cpuScale} />
                    <div className="contentDetailDesc">
                      <span>{this.state.cpuContent}</span>
                      <span className="contentDetailDescTitle">CPU</span>
                      <span>
                        {FunctionSearchCPUStake}：{this.state.cpuStake}
                      </span>
                      <span>
                        {FunctionSearchCPURefund}：{this.state.cpuMortgage}
                      </span>
                    </div>
                  </div>
                  <div className="contentDetail">
                    <Progress
                      type="dashboard"
                      percent={this.state.networkScale}
                    />
                    <div className="contentDetailDesc">
                      <span>{this.state.networkContent}</span>
                      <span className="contentDetailDescTitle">
                        {FunctionSearchNet}
                      </span>
                      <span>
                        {FunctionSearchNetStake}：{this.state.networkStake}
                      </span>
                      <span>
                        {FunctionSearchNetRefund}：{this.state.networkMortgage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '2rem 0' }}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab={FunctionSearchAccountBalance} key="1">
                    {this.props.SelectedNetWork === 'test' ? (
                      <div style={{ padding: '1rem 0' }}>
                        <span>{FunctionSearchAccountSyblom}：</span>
                        <AutoComplete
                          dataSource={childrenWorbli}
                          placeholder={this.state.symbolNet + ' (eosio.token)'}
                          optionLabelProp="value"
                          onSelect={this.handleChange}
                          filterOption={(inputValue, option) => option.props.children[0].toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        />
                      </div>
                    ) : (
                      <div style={{ padding: '1rem 0' }}>
                        <span>{FunctionSearchAccountSyblom}：</span>
                        <AutoComplete
                          dataSource={children}
                          placeholder={this.state.symbolNet + ' (eosio.token)'}
                          optionLabelProp="value"
                          onSelect={this.handleChange}
                          filterOption={(inputValue, option) => option.props.children[0].toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        />

                      </div>
                    )}
                    <div>
                      <Table
                        columns={columnsBlance}
                        dataSource={dataBlance}
                        pagination={false}

                      />
                    </div>
                  </TabPane>
                  <TabPane tab={FunctionSearchAccountPublic} key="2">
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          ) : null}
          {this.state.mykeyVisvible ? (
            <div >
              <Card title='MYKEY' bordered={true} type="inner" style={{ marginTop: '21px'}}>
                <div>
                  <Radio.Group defaultValue="keydata" buttonStyle="solid" style={{padding: '10px 0'}} onChange={this.handleChangeCheck}>
                    <Radio.Button value="keydata" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>keydata</Radio.Button>
                    <Radio.Button value="backupdata" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>backupdata</Radio.Button>
                    <Radio.Button value="subacct" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>subacct</Radio.Button>
                    <Radio.Button value="subassetsum" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>subassetsum</Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ display: 'flex', marginBottom: 30 }}>
                  <Tooltip
                    title='Scope'
                    placement="topLeft"
                    overlayClassName="numeric-input"
                  >
                    <Input placeholder="Scope" maxLength={18} value={this.state.scope} onChange={this.changeScope} style={{width: 130, marginRight: 20, marginLeft: 10}}/>
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
                  <Button type="primary"  onClick={this.onSearch}>{FunctionSearchButton}</Button>
                </div>
                <Table columns={this.state.columnsMykey} bordered={false} dataSource={this.state.columnsData} scroll={{ x: 1500 | true }} pagination={{ pageSize: 50 }}/>
              </Card>
            </div>
          ) : null}
        </styleComps.ConBox>
      </LayoutContentBox>
    )
  }
}

AccountSearchPage.propTypes = {
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}
// 在组件上挂载状态控制
export function mapDispatchToProps (dispatch) {
  return { dispatch }
}
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})
const AccountSearchPageIntl = injectIntl(AccountSearchPage)
const AccountSearchPageForm = Form.create()(AccountSearchPageIntl)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountSearchPageForm)
