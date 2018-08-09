/*
 * HeaderComp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Layout, Select, Dropdown, Button, message ,Avatar } from 'antd';

import { Menu , Icon} from '../../utils/antdUtils';
import utilsMsg from '../../utils/messages';
import { storage } from 'utils/storage';
import styleComps from './styles'

// 自定义变量
const { Header, Sider, Content } = Layout

import {
  makeSelectLocale,
  makeSelectNetwork,
} from '../../containers/LanguageProvider/selectors';
const Option = Select.Option;
const SubMenu = Menu.SubMenu;

class HeaderComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedKeys: '1',
      collapsed: false,
      openKeys: [],
      rootSubmenuKeys: ['1', '2', '3', '4', '5'],
    };
  }
  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  componentWillMount() {
    let defaultSelectedKeys = '8';
    switch (window.location.hash.substring(1)) {
      case '/accountSearch':
        defaultSelectedKeys = '9';
        break;
      case '/createAccount':
        defaultSelectedKeys = '10';
        break;
      case '/proxy':
        defaultSelectedKeys = '2';
        break;
      case '/transfer':
        defaultSelectedKeys = '3';
        break;
      case '/refund':
        defaultSelectedKeys = '4';
        break;
      case '/buyrambytes':
        defaultSelectedKeys = '5';
        break;
      case '/vote':
        defaultSelectedKeys = '6';
        break;
      case '/updateauth':
        defaultSelectedKeys = '7';
        break;
      case '/stake':
        defaultSelectedKeys = '1';
        break;
      case '/sendMessage':
        defaultSelectedKeys = '0';
        break;
      default:
        defaultSelectedKeys = '8';
    }
    this.setState({
      defaultSelectedKeys,
    });
  }
  /**
   * 菜单选项卡打开或者闭合时调用；
   * openKeys = ['']，SubMenu的参数；
   * */
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1)
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  };

  changeLanguage = () => {
    const localeLanguage = this.props.locale === 'en' ? 'de' : 'en';
    this.props.onDispatchChangeLanguageReducer(localeLanguage);
  };
  handleChange = value => {
    //console.log('this.props.network header====', this.props.netWork);
    const network = this.props.netWork === 'main' ? 'test' : 'main';
    this.props.onDispatchChangeNetworkReducer(network);
  };

  handleMenuClick = value => {
    // if(value.key == '1'){
    //  location.href('https://github.com/eoscannon/EosCannon-Online-Tools-App/releases')
    // }else if(value.key == '2'){
    //  location.href('https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases')
    // }
  };

  render() {
    console.log('this.props.children==',this.props.children)

    const { formatMessage } = this.props.intl;
    const initInfo = formatMessage(utilsMsg.HeaderMenuInfoInit);
    const createAccount = formatMessage(utilsMsg.HeaderMenuCreateAccount);
    const tradeManage = formatMessage(utilsMsg.HeaderMenuTradeManage);
    const stake = formatMessage(utilsMsg.HeaderMenuStake);
    const sendMessage = formatMessage(utilsMsg.HeaderMenuSendMessage);
    const accountSearch = formatMessage(utilsMsg.HeaderMenuAccountSearch);
    const transfer = formatMessage(utilsMsg.HeaderMenuTransfer);
    const buyRamBytes = formatMessage(utilsMsg.HeaderMenuBuyRamBytes);
    const vote = formatMessage(utilsMsg.HeaderMenuVote);
    const proxy = formatMessage(utilsMsg.HeaderMenuProxy);
    const updateAuth = formatMessage(utilsMsg.HeaderMenuUpdateAuth);
    const refund = formatMessage(utilsMsg.HeaderMenuRefund);
    const mainNet = formatMessage(utilsMsg.HeaderMenuOffical);
    const testNet = formatMessage(utilsMsg.HeaderMenuTestNet);
    const OnlineAppDownLoad = formatMessage(utilsMsg.HeaderOnlineAppDownLoad);
    const AppDownLoad = formatMessage(utilsMsg.HeaderAppDownLoad);
    const OfflineAppDownLoad = formatMessage(utilsMsg.HeaderOfflineAppDownLoad);
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">
          <a href="https://github.com/eoscannon/EosCannon-Online-Tools-App/releases">
            <Icon type="android" />在线APP
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases">
            <Icon type="android" />离线APP
          </a>
        </Menu.Item>
      </Menu>
    );
    return (

      <Layout>

        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" style={{height: '32px',color: '#f5cb48',margin: '1.5rem',fontSize: '18px',fontWeight: 'bold'}}>EOS Cannon</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['8']}  openKeys={this.state.openKeys} onOpenChange={this.onOpenChange}>
            <Menu.SubMenu key="1" title={<span><Icon type="area-chart" /><span>{tradeManage}</span></span>}>
              <Menu.Item key="10">
                <Link to="/createAccount">
                  {createAccount}
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/stake">
                  {stake}
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/transfer">
                  {transfer}
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/buyrambytes">
                  {buyRamBytes}
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/vote">
                  {vote}
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/proxy">
                  {proxy}
                </Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link href="/updateauth" to="/updateauth">
                  {updateAuth}
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link href="/refund" to="/refund">
                  {refund}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="2" title={<span><Icon type="solution" /><span> {initInfo}</span></span>}>
              <Menu.Item key="8">
                <Link  to="/infoInit">
                  {initInfo}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="3" title={<span><Icon type="upload" /><span>{sendMessage}</span></span>}>
              <Menu.Item key="0">
                <Link  to="/sendMessage">
                  {sendMessage}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="4" title={<span><Icon type="user" />{accountSearch}</span>}>
              <Menu.Item key="9">
                <Link href="/accountSearch" to="/accountSearch">
                  {accountSearch}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="5" title={<span><Icon type="appstore-o" />{AppDownLoad}</span>}>
              <Menu.Item key="setting:1">
                <a
                  href="https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases"
                  target="_blank"
                >
                  {OnlineAppDownLoad}
                </a>
              </Menu.Item>
              <Menu.Item key="setting:2">
                <a
                  href="https://github.com/eoscannon/EosCannon-Online-Tools-App/releases"
                  target="_blank"
                >
                  {OfflineAppDownLoad}
                </a>
              </Menu.Item>
            </Menu.SubMenu>

          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{ fontSize: '18',lineHeight: '64',padding: '0 24px',cursor: 'pointer',transition: 'color .3s'}}
            />
            <div className="userBox" style={{float: 'right',display: 'flex',alignItems: 'center'}}>
              <Select
                className="netWork"
                labelInValue
                defaultValue={{ key: 'main' }}
                style={{ width: 110 }}
                onChange={this.handleChange}
              >
                <Option value="main">{mainNet}</Option>
                <Option value="test">{testNet}</Option>
              </Select>
              <div className="en" aria-hidden="true" onClick={this.changeLanguage} style={{padding: '0 1rem',color: 'blue'}}>
                {this.props.locale === 'en' ? '中文' : 'English'}
              </div>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280 }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>

      //<div className="dropDownContent">
      //  <Dropdown overlay={menu}>
      //    <Button style={{ marginLeft: 8 }}>
      //      APP下载 <Icon type="down" />
      //    </Button>
      //  </Dropdown>
      //</div>
    );
  }
}
HeaderComp.propTypes = {
  intl: PropTypes.object,
  locale: PropTypes.string,
  children: PropTypes.node,
  onDispatchChangeLanguageReducer: PropTypes.func,
  onDispatchChangeNetworkReducer: PropTypes.func,
};

const HeaderCompIntl = injectIntl(HeaderComp);
// 挂载中间件到组件；
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDispatchChangeLanguageReducer: locale =>
      dispatch({ type: 'app/LanguageToggle/CHANGE_LOCALE', locale }),
    onDispatchChangeNetworkReducer: locale =>
      dispatch({ type: 'app/Network/CHANGE_LOCALE', locale }),
  };
}

const mapStateToProps = createStructuredSelector({
  netWork: makeSelectNetwork(),
  locale: makeSelectLocale(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderCompIntl);

const HeaderWrapper = styled(Header)`
  .dropDownContent {
    display: none;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255,255,255,.2);
    margin: 16px;
  }

  @media (max-width: 700px) {
    .headerContent {
      display: none;
    }
    .dropDownContent {
      display: block;
      float: right;
    }
  }

  .logo {
    width: 113px;
    height: 31px;
    margin: 16px 0;
    line-height: 31px;
    font-size: 18px;
    font-weight: bold;
    color: #f5cb48;
    float: left;
    margin: 1.5rem;
  }
  .en {
    cursor: pointer;
    width: 40px;
    line-height: 64px;
    font-size: 12px;
    color: #f5cb48;
    text-align: right;
    float: right;

    &:hover {
      color: #aaa;
    }
  }
  .netWork {
    cursor: pointer;
    width: 40px;
    height: 31px;
    line-height: 64px;
    font-size: 12px;
    color: #f5cb48;
    text-align: right;
    float: right;
    position: fixed;
    right: 7rem;
    top: 1rem;
    &:hover {
      color: #aaa;
    }
  }
`;
