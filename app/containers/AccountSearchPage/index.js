/*
 * TransferPage
 *
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Select, Button, message, Tabs, Table } from 'antd';
import { Progress, Input, Menu } from 'utils/antdUtils';
import copy from 'copy-to-clipboard';
import eosioAbi from './abi';
import eosIqAbi from './iqAbi';
const Search = Input.Search;
import styleComps from './styles';
const Option = Select.Option;

import {
  formItemLayout,
  getEos,
  getEosTest
} from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';
import GetQrcode from '../../components/GetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors';
import { Link } from 'react-router-dom';
const TabPane = Tabs.TabPane;

export class AccountSearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info:'',
      formatMessage: this.props.intl.formatMessage,
      account:'',
      createTime:'',
      balance:0,
      stake:0,
      voteNode:'暂无',
      memoryContent:'',
      cpuContent:'',
      networkContent:'',
      cpuStake: '',
      cpuMortgage:'',
      networkStake: '',
      networkMortgage:'',
      memoryScale: 0,
      cpuScale:0,
      networkScale:0,
      netWorkStatus:'',
      symbolBlance:0,
      defaultSelectedKeys: '1',
      activeAdd: '',
      ownerAdd: '',
      symbolCode: '',
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    this.setState({netWorkStatus: nextProps.netWork})

  }

  componentWillMount(){
    this.setState({netWorkStatus: this.props.netWork})
  }
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = (value) => {

  };

  searchBlance = (key) => {
    console.log(key);

  }

  handleChange=(key)=> {
    console.log(key);
    let eos
    console.log("this.state.netWorkStatus====",this.state.netWorkStatus)
    if(this.state.netWorkStatus =='main'){
      eos = getEos()
    }else{
      eos = getEosTest()
    }

    eos.getCurrencyBalance({
      "code": key.key,
      "account": this.state.account,
      "symbol": key.label,
    }).then((res)=> {
      console.log('res===',res)
      this.setState({
        symbolBlance: res[0] || 0,
        symbolCode: key.key,
      })
    }).catch((err)=>{
      message.error('服务器错误');
      console.log('err:',err)
    });
  }
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleSearch = (value) => {
    console.log('value:',value)
    this.setState({
      account: value
    })
    let eos
      console.log("this.state.netWorkStatus====",this.state.netWorkStatus)
    if(this.state.netWorkStatus =='main'){
      eos = getEos()
    }else{
      eos = getEosTest()
    }
    const expireInSeconds = 60 * 60; // 1 hour
    let producer = ''
    let stake = 0
    let cpuBack, netWork ,cpuScale , netScale
    eos.getAccount({'account_name': value}).then((info) => {
      if(info.voter_info && info.voter_info.producers) {
        for (let i = 0; i < info.voter_info.producers.length; i++) {
          producer = info.voter_info.producers[i] + ' , ' + producer
        }
      }
      if(info.voter_info){
        stake = info.voter_info.staked / 10000 + ' EOS'
      }
      if(info.refund_request){
        cpuBack = info.refund_request.cpu_amount
        netWork = info.refund_request.net_amount
      }else{
        cpuBack = '0 EOS'
        netWork = '0 EOS'
      }
      if(info.cpu_limit.used){
        cpuScale = ((info.cpu_limit.used / info.cpu_limit.max)*100).toFixed(1)
      }else{
        cpuScale = 0
      }
      if(info.net_limit.used){
        netScale = ((info.net_limit.used / info.net_limit.max)*100).toFixed(1)
      }else{
        netScale = 0
      }
        this.setState({
          info : info,
          createTime: info.created,
          stake: stake,
          voteNode: producer,
          memoryContent: (info.ram_usage/1024).toFixed(2)+' Kib/' + (info.ram_quota/1024).toFixed(2)+' Kib',
          cpuContent: info.cpu_limit.used/1000 + ' ms/' +info.cpu_limit.max/1000+' ms',
          networkContent: info.net_limit.used + ' bytes/' +((info.net_limit.max/1024)/1024).toFixed(2)+' Mib',
          cpuMortgage: cpuBack,
          networkMortgage: netWork,
          memoryScale: ((parseInt(info.ram_usage)/parseInt(info.ram_quota))).toFixed(2).slice(2,4),
          cpuScale: cpuScale,
          networkScale: netScale,
          activeAdd: info.permissions[0].required_auth.keys[0].key,
          ownerAdd: info.permissions[1].required_auth.keys[0].key,
          cpuStake: info.total_resources.cpu_weight,
          networkStake: info.total_resources.net_weight
        })

      eos.getCurrencyBalance({
        "code": "eosio.token",
        "account": value,
        "symbol": "EOS",
      }).then((res)=> {
        this.setState(
          { balance: res[0] || 0 ,
            symbolBlance: res[0] || 0,
            symbolCode: "eosio.token"
          }
        )
      }).catch((err)=>{
        message.error('服务器错误');
        console.log('err:',err)
      });
    }).catch((err)=>{
      message.error('服务器错误');
      console.log('err:',err)
    });


  }



  render() {

    const  columnsBlance= [{
      title: '余额',
      dataIndex: 'name',
    }, {
      title: '合约名',
      dataIndex: 'address',
    }];

    const  dataBlance= [{
      key: 1,
      name: this.state.symbolBlance,
      address: this.state.symbolCode,
    }];

    const columns = [{
      title: '组名',
      dataIndex: 'name',
    }, {
      title: '地址/账户',
      dataIndex: 'address',
    }];

    const  data= [{
      key: 1,
      name: 'active',
      address: this.state.activeAdd,
    },{
      key: 2,
      name: 'owner',
      address:  this.state.ownerAdd,
    }];

    const { getFieldDecorator } = this.props.form;
    const TransferFromAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferFromAccountNamePlaceholder
    );
    const TransferToAccountNamePlaceholder = this.state.formatMessage(
      messages.TransferToAccountNamePlaceholder
    );

    console.log('state:',this.state)
    const FromLabel = this.state.formatMessage(messages.FromLabel);
    const ToLabel = this.state.formatMessage(messages.ToLabel);
    const ContractLabel = this.state.formatMessage(messages.ContractLabel);
    const QuantityLabel = this.state.formatMessage(messages.QuantityLabel);
    const DigitLabel = this.state.formatMessage(messages.DigitLabel);
    const SymbolLabel = this.state.formatMessage(messages.SymbolLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <styleComps.ConBox>
          <FormComp>
            <Search
              placeholder="search account"
              enterButton="搜索"
              size="large"
              onSearch={this.handleSearch}
            />
          </FormComp>
            {this.state.info ? (
              <div>


                <div className='content'>
                  <div className='firstContent'>
                    <span>账户：{this.state.account}</span>
                    <span>创建时间：{this.state.createTime}</span>
                    <span>EOS余额：{this.state.balance}</span>
                    <span>EOS抵押：{this.state.stake}</span>
                    <span>已投节点：{this.state.voteNode}</span>
                  </div>
                  <div className='secondContent'>
                    <div className='contentDetail'>
                      <Progress type="dashboard" percent={this.state.memoryScale} />
                      <div className='contentDetailDesc'>
                        <span>{this.state.memoryContent}</span>
                        <span className='contentDetailDescTitle'>内存</span>
                      </div>
                    </div>
                    <div className='contentDetail'>
                      <Progress type="dashboard" percent={this.state.cpuScale} />
                      <div className='contentDetailDesc'>
                        <span>{this.state.cpuContent}</span>
                        <span className='contentDetailDescTitle'>CPU</span>
                        <span>抵押：{this.state.cpuStake}</span>
                        <span>赎回：{this.state.cpuStake }</span>
                      </div>
                    </div>
                    <div className='contentDetail'>
                      <Progress type="dashboard" percent={this.state.networkScale} />
                      <div className='contentDetailDesc'>
                        <span>{this.state.networkContent}</span>
                        <span className='contentDetailDescTitle'>网络</span>
                        <span>抵押：{this.state.networkStake}</span>
                        <span>赎回：{this.state.networkMortgage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{padding:'2rem 0'}}>
                  <Tabs defaultActiveKey="1" onChange={this.searchBlance}>
                    <TabPane tab="账户余额" key="1">
                      <div style={{padding:'1rem 0'}}>
                        <span>代币：</span>
                        <Select labelInValue defaultValue={{ key: 'EOS' }} style={{ width: 120 }} onChange={this.handleChange}>
                          <Option value="EOS">EOS</Option>
                          <Option value="everipediaiq">IQ</Option>
                          <Option value="gyztomjugage">CETOS</Option>
                          <Option value="eoxeoxeoxeox">EOX</Option>
                          <Option value="ednazztokens">EDNA</Option>
                          <Option value="horustokenio">HORUS</Option>
                          <Option value="therealkarma">KARMA</Option>
                          <Option value="challengedac">CHL</Option>
                          <Option value="eosblackteam">BLACK</Option>
                          <Option value="eosadddddddd">ADD</Option>
                          <Option value="eosiochaince">CET</Option>
                        </Select>
                      </div>
                      <div>
                        <Table columns={columnsBlance} dataSource={dataBlance} pagination={false}/>

                      </div>
                    </TabPane>
                    <TabPane tab="账户公钥" key="2">
                      <Table columns={columns} dataSource={data}  pagination={false}/>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            ) : (<span></span>)}

          </styleComps.ConBox>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

AccountSearchPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  netWork: makeSelectNetwork(),
});
const AccountSearchPageIntl = injectIntl(AccountSearchPage);
const AccountSearchPageForm = Form.create()(AccountSearchPageIntl);

export default connect(
  mapStateToProps
)(AccountSearchPageForm);

