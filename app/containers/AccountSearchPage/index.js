/*
 * TransferPage
 *
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Select, message, Tabs, Table, Tag } from 'antd';
import { Progress, Input } from 'utils/antdUtils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors';
import styleComps from './styles';

import { getEos } from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import messages from './messages';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export class AccountSearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: '',
      formatMessage: this.props.intl.formatMessage,
      account: '',
      createTime: '',
      balance: 0,
      stake: 0,
      voteNode: '',
      voteNodeStatus: true,
      memoryContent: '',
      cpuContent: '',
      networkContent: '',
      cpuStake: '',
      cpuMortgage: '',
      networkStake: '',
      networkMortgage: '',
      memoryScale: 0,
      cpuScale: 0,
      networkScale: 0,
      symbolBlance: 0,
      activeAdd: '',
      ownerAdd: '',
      symbolCode: '',
      voteProxy: '',
    };
  }

  componentDidMount(){
    //this.handleSearch('gi3temrsg4ge')
  }

  searchBlance = key => {
    console.log(key);
  };

  handleChange = key => {
    const eos = getEos(this.props.SelectedNetWork);
    eos
      .getCurrencyBalance({
        code: key.key,
        account: this.state.account,
        symbol: key.label,
      })
      .then(res => {
        this.setState({
          symbolBlance: res[0] || 0,
          symbolCode: key.key,
        });
      })
      .catch(err => {
        console.log('err:', err);
        message.error(this.state.formatMessage(messages.FunctionSearchNoData));
        this.setState({
          balance: 0,
          symbolBlance: 0,
          symbolCode: '',
        });
      });
  };

  handleSearch = value => {
    this.setState({
      account: value,
    });
    const eos = getEos(this.props.SelectedNetWork);

    let producer = '';
    let stake = 0;
    let cpuBack;
    let netWork;
    let cpuScale;
    let netScale;
    eos
      .getAccount({ account_name: value })
      .then(info => {
        if (info.voter_info) {
          this.setState({ voteProxy: info.voter_info.proxy });
          if (info.voter_info.producers.length < 1) {
            this.setState({ voteNodeStatus: false });
          } else {
            this.setState({ voter_infoProducers: info.voter_info.producers });

            //for (let i = 0; i < info.voter_info.producers.length; i += 1) {
            //  producer = `${info.voter_info.producers[i]} , ${producer}`;
            //}
            //producer = producer.substring(0,producer.lastIndexOf(','))
          }
        }
        if (info.voter_info) {
          stake = `${info.voter_info.staked / 10000} EOS`;
        }
        if (info.refund_request) {
          cpuBack = info.refund_request.cpu_amount;
          netWork = info.refund_request.net_amount;
        } else {
          cpuBack = '0 EOS';
          netWork = '0 EOS';
        }
        if (info.cpu_limit.used) {
          cpuScale = ((info.cpu_limit.used / info.cpu_limit.max) * 100).toFixed(
            2,
          );
        } else {
          cpuScale = 0;
        }
        if (info.net_limit.used) {
          netScale = ((info.net_limit.used / info.net_limit.max) * 100).toFixed(
            2,
          );
        } else {
          netScale = 0;
        }
        this.setState({
          info,
          createTime: info.created,
          stake,
          voteNode: info.voter_info.producers,
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
            ((Math.round(info.ram_usage) / Math.round(info.ram_quota)) * 100).toFixed(2)
          ),
          cpuScale: Number(Number(cpuScale).toFixed(2)),
          networkScale: Number(Number(netScale).toFixed(2)),

          cpuStake: info.total_resources.cpu_weight,
          networkStake: info.total_resources.net_weight,
        });
        if(info.permissions[0].required_auth.keys.length>0){
          this.setState({
            activeAdd: info.permissions[0].required_auth.keys[0].key,
            ownerAdd: info.permissions[1].required_auth.keys[0].key,
          })
        }

        eos
          .getCurrencyBalance({
            code: 'eosio.token',
            account: value,
            symbol: 'EOS',
          })
          .then(res => {
            this.setState({
              balance: res[0] || 0,
              symbolBlance: res[0] || 0,
              symbolCode: 'eosio.token',
            });
          })
          .catch(err => {
            message.error(
              this.state.formatMessage(messages.FunctionSearchNoData),
            );
            console.log('err:', err);
          });
      })
      .catch(err => {
        message.error(this.state.formatMessage(messages.FunctionSearchNoData));
        this.setState({ info: '' });
        console.log('err:', err);
      });
  };

  render() {
    const FunctionSearchButton = this.state.formatMessage(
      messages.FunctionSearchButton,
    );
    const FunctionSearchAccount = this.state.formatMessage(
      messages.FunctionSearchAccount,
    );
    const FunctionSearchCreateTime = this.state.formatMessage(
      messages.FunctionSearchCreateTime,
    );
    const FunctionSearchEOSBalance = this.state.formatMessage(
      messages.FunctionSearchEOSBalance,
    );
    const FunctionSearchEOSStake = this.state.formatMessage(
      messages.FunctionSearchEOSStake,
    );
    const FunctionSearchEOSVoteProxy = this.state.formatMessage(
      messages.FunctionSearchEOSVoteProxy,
    );
    const FunctionSearchEOSVoteNode = this.state.formatMessage(
      messages.FunctionSearchEOSVoteNode,
    );
    const FunctionSearchMemory = this.state.formatMessage(
      messages.FunctionSearchMemory,
    );
    const FunctionSearchCPUStake = this.state.formatMessage(
      messages.FunctionSearchCPUStake,
    );
    const FunctionSearchNetStake = this.state.formatMessage(
      messages.FunctionSearchNetStake,
    );
    const FunctionSearchNet = this.state.formatMessage(
      messages.FunctionSearchNet,
    );
    const FunctionSearchCPURefund = this.state.formatMessage(
      messages.FunctionSearchCPURefund,
    );
    const FunctionSearchNetRefund = this.state.formatMessage(
      messages.FunctionSearchNetRefund,
    );
    const FunctionSearchAccountBalance = this.state.formatMessage(
      messages.FunctionSearchAccountBalance,
    );
    const FunctionSearchAccountPublic = this.state.formatMessage(
      messages.FunctionSearchAccountPublic,
    );
    const FunctionSearchAccountSyblom = this.state.formatMessage(
      messages.FunctionSearchAccountSyblom,
    );
    const FunctionSearchAccountTableBalance = this.state.formatMessage(
      messages.FunctionSearchAccountTableBalance,
    );
    const FunctionSearchAccountTableContact = this.state.formatMessage(
      messages.FunctionSearchAccountTableContact,
    );

    const FunctionSearchAccountTableGroup = this.state.formatMessage(
      messages.FunctionSearchAccountTableGroup,
    );
    const FunctionSearchAccountTableAddress = this.state.formatMessage(
      messages.FunctionSearchAccountTableAddress,
    );

    const columnsBlance = [
      {
        title: FunctionSearchAccountTableBalance,
        dataIndex: 'name',
      },
      {
        title: FunctionSearchAccountTableContact,
        dataIndex: 'address',
      },
    ];

    const dataBlance = [
      {
        key: 1,
        name: this.state.symbolBlance,
        address: this.state.symbolCode,
      },
    ];

    const columns = [
      {
        title: FunctionSearchAccountTableGroup,
        dataIndex: 'name',
      },
      {
        title: FunctionSearchAccountTableAddress,
        dataIndex: 'address',
      },
    ];

    const data = [
      {
        key: 1,
        name: 'active',
        address: this.state.activeAdd,
      },
      {
        key: 2,
        name: 'owner',
        address: this.state.ownerAdd,
      },
    ];

    return (
      <LayoutContent>
        <LayoutContentBox>
          <styleComps.ConBox>
            <FormComp>
              <Search
                placeholder="search account"
                enterButton={FunctionSearchButton}
                size="large"
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
                      {FunctionSearchEOSBalance}：{this.state.balance}
                    </span>
                    <span>
                      {FunctionSearchEOSStake}：{this.state.stake}
                    </span>
                    <span>
                      {FunctionSearchEOSVoteProxy}：{this.state.voteProxy}
                    </span>
                    {this.state.voteNodeStatus ? (
                      <span>
                        {FunctionSearchEOSVoteNode}：<br/>
                        {this.state.voteNode.map((key, i)=>( <Tag key={i}>{key}</Tag>))}
                      </span>
                    ) : (
                      <span />
                    )}
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
                      <Progress
                        type="dashboard"
                        percent={this.state.cpuScale}
                      />
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
                          {FunctionSearchNetRefund}：{
                            this.state.networkMortgage
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '2rem 0' }}>
                  <Tabs defaultActiveKey="1" onChange={this.searchBlance}>
                    <TabPane tab={FunctionSearchAccountBalance} key="1">
                      <div style={{ padding: '1rem 0' }}>
                        <span>{FunctionSearchAccountSyblom}：</span>
                        <Select
                          labelInValue
                          defaultValue={{ key: 'EOS' }}
                          style={{ width: 120 }}
                          onChange={this.handleChange}
                        >
                          <Option value="eosio.token">EOS</Option>
                          <Option value="eoscancancan">CAN</Option>
                          <Option value="everipediaiq">IQ</Option>
                          <Option value="eosiomeetone">MEETONE</Option>
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
          </styleComps.ConBox>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

AccountSearchPage.propTypes = {
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
});
const AccountSearchPageIntl = injectIntl(AccountSearchPage);
const AccountSearchPageForm = Form.create()(AccountSearchPageIntl);

export default connect(mapStateToProps)(AccountSearchPageForm);
