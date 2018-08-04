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
import { Layout, Select, Dropdown, Button, Icon, message  } from 'antd';

import { Menu } from '../../utils/antdUtils';
import utilsMsg from '../../utils/messages';
import { storage } from 'utils/storage';

import { makeSelectLocale,makeSelectNetwork } from '../../containers/LanguageProvider/selectors';
const { Header } = Layout;
const Option = Select.Option;

class HeaderComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedKeys: '1',
    };
  }
  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  componentWillMount() {
    let defaultSelectedKeys = '8';
    switch (window.location.hash.substring(1)) {
      case '/accountSearch':
        defaultSelectedKeys = '3';
        break;
      case '/sendMessage':
        defaultSelectedKeys = '1';
        break;
      default:
        defaultSelectedKeys = '8';
    }
    this.setState({
      defaultSelectedKeys,
    });
  }

  changeLanguage = () => {
    const localeLanguage = this.props.locale === 'en' ? 'de' : 'en';
    this.props.onDispatchChangeLanguageReducer(localeLanguage);
  };
  handleChange=(value)=> {
    console.log(value); // { key: "lucy", label: "Lucy (101)" }
    //if(value.key=='test') {
    //  storage.setNetwork('https://tool.eoscannon.io/jungle')
    //}else if(value.key=='main'){
    //  storage.setNetwork('https://mainnet.eoscannon.io')
    //}
    console.log('this.props.network header====',this.props.netWork )
    const network = this.props.netWork === 'main' ? 'test' : 'main';
    this.props.onDispatchChangeNetworkReducer(network);

  }

  handleMenuClick=(value)=> {
    //if(value.key == '1'){
    //  location.href('https://github.com/eoscannon/EosCannon-Online-Tools-App/releases')
    //}else if(value.key == '2'){
    //  location.href('https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases')
    //}
  }

  render() {
    const { formatMessage } = this.props.intl;
    const createAccount = formatMessage(utilsMsg.HeaderMenuInfoInit);
    const stake = formatMessage(utilsMsg.HeaderMenuSendMessage);
    const accountSearch = formatMessage(utilsMsg.HeaderMenuAccountSearch);
    const mainNet = formatMessage(utilsMsg.HeaderMenuOffical);
    const testNet = formatMessage(utilsMsg.HeaderMenuTestNet);
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1"><a href="https://github.com/eoscannon/EosCannon-Online-Tools-App/releases"><Icon type="android" />在线APP</a></Menu.Item>
        <Menu.Item key="2"><a href="https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases"><Icon type="android" />离线APP</a></Menu.Item>
      </Menu>
    );
    return (
      <HeaderWrapper>
        <div className="logo">EOS Cannon</div>
          <div className='headerContent'>
            <Select className="netWork"  labelInValue defaultValue={{ key: 'main' }} style={{ width: 110 }} onChange={this.handleChange}>
              <Option value="main">{mainNet}</Option>
              <Option value="test">{testNet}</Option>
            </Select>
            <div className="en" aria-hidden="true" onClick={this.changeLanguage}>
              {this.props.locale === 'en' ? '中文' : 'English'}
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[this.state.defaultSelectedKeys]}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="8">
                <Link href="/infoInit" to="/infoInit">
                  {createAccount}
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link href="/sendMessage" to="/sendMessage">
                  {stake}
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href="/accountSearch" to="/accountSearch">
                  {accountSearch}
                </Link>
              </Menu.Item>

              <Menu.Item key="4">
                <a  href="https://github.com/eoscannon/EosCannon-Online-Tools-App/releases" target='_blank'>
                  在线APP下载
                </a>
              </Menu.Item>
              <Menu.Item key="5">
                <a  href="https://github.com/eoscannon/EosCannon-Offline-Tools-App/releases"  target='_blank'>
                  离线APP下载
                </a>
              </Menu.Item>
            </Menu>
          </div>
        <div className='dropDownContent'>
          <Dropdown overlay={menu}>
            <Button style={{ marginLeft: 8 }}>
              APP下载 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>

      </HeaderWrapper>
    );
  }
}
HeaderComp.propTypes = {
  intl: PropTypes.object,
  locale: PropTypes.string,
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
  mapDispatchToProps
)(HeaderCompIntl);

const HeaderWrapper = styled(Header)`
  position: fixed;
  z-index: 1000;
  width: 100%;
  .dropDownContent{
      display: none;
    }
  @media (max-width: 700px) {
    .headerContent{
      display: none;

    }
    .dropDownContent{
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
    margin-right: 1.5rem;

  }
  .en {
    cursor: pointer;
    width: 40px;
    height: 31px;
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
