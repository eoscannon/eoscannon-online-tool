/*
 * HeaderComp
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Helmet } from 'react-helmet'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Select, Popover, Modal, Input, message, Form } from 'antd'
import EOS from 'eosjs'
import {
  formItemLayout
} from '../../utils/utils'
import { Menu, Icon, Tooltip } from '../../utils/antdUtils'
import utilsMsg from '../../utils/messages'
import { storage } from '../../utils/storage'
import FooterComp from '../../components/Footer'
import eosCannonLogo from '../../images/eosLogo.png'
import eosCannonLogoBig from '../../images/eos_cannon_logo_opacity4.png'
import downloadAndroid from './1.1.3.png'
import downloadIos from './ios.png'
import config from '../../config';
import {
  makeSelectLocale,
  makeSelectNetwork
} from '../../containers/LanguageProvider/selectors'

// 自定义变量
const { Header, Sider, Content } = Layout
const { Option } = Select
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item

class HeaderComp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      LogoName: true,
      defaultSelectedKeys: '3',
      collapsed: false,
      openKeys: ['tradeManage'],
      rootSubmenuKeys: ['1', '2', '3', '4', '5'],
      testNetUrl: '',
      visible: false,
      mainNetwork:'main',
      current: 'mail',
    }
  }

  componentWillReceiveProps (nextProps) {
    let value =  this.props.form.getFieldsValue()
    const {formItemNetWork} = value
    if( formItemNetWork !== nextProps.netWork){
      this.props.form.setFieldsValue({formItemNetWork : nextProps.netWork})
    }

  }
  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  componentWillMount () {
    // getEosByScatter();
    let defaultSelectedKeys = '3'
    switch (window.location.hash.substring(1)) {
      case '/iq':
        defaultSelectedKeys = '13'
        break
      case '/dscribe':
        defaultSelectedKeys = '12'
        break
      case '/accountSearch':
        defaultSelectedKeys = '9'
        break
      case '/createAccount':
        defaultSelectedKeys = '10'
        break
      case '/proxy':
        defaultSelectedKeys = '2'
        break
      case '/transfer':
        defaultSelectedKeys = '3'
        break
      case '/refund':
        defaultSelectedKeys = '4'
        break
      case '/buyrambytes':
        defaultSelectedKeys = '5'
        break
      case '/vote':
        defaultSelectedKeys = '6'
        break
      case '/updateauth':
        defaultSelectedKeys = '7'
        break
      case '/stake':
        defaultSelectedKeys = '1'
        break
      case '/airgrab':
        defaultSelectedKeys = '11'
        break
      case '/sendMessage':
        defaultSelectedKeys = '0'
        break
      case '/proposal':
        defaultSelectedKeys = '14'
        break
      case '/forumVote':
        defaultSelectedKeys = '15'
        break
      case '/worbli':
        defaultSelectedKeys = '16'
        break
      case '/scanLogin':
        defaultSelectedKeys = '17'
        break
      default:
        defaultSelectedKeys = '3'
    }
    this.setState({
      defaultSelectedKeys
    })
    storage.setBaseSymbol('EOS')
    
    let network = storage.getNetwork() || 'main'
    this.setState({mainNetwork:network, testNetUrl:network})
    this.props.onDispatchChangeNetworkReducer(network)

  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1,
    )
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  };

  changeLanguage = () => {
    const localeLanguage = this.props.locale.startsWith('en') ? 'zh' : 'en'
    this.props.onDispatchChangeLanguageReducer(localeLanguage)
  };

  handleChange = value => {
    let reg = new RegExp('https')
    if (value === 'other' || reg.test(this.props.SelectedNetWork)) {
      this.setState({
        visible: true
      })
      storage.setBaseSymbol('EOS')
    }else{
      for(let i=0 ;i<config.netWorkConfig.length;i++){
        if(value === config.netWorkConfig[i].networkName){
          storage.setBaseSymbol(config.netWorkConfig[i].BaseSymbol)
        }
      }
    }
    storage.setNetwork(value)
    this.props.onDispatchChangeNetworkReducer(value)
  };

  changeNet = e => {
    const { value } = e.target
    this.setState({ testNetUrl: value })
  };

  setNetWork = () => {
    const value = this.state.testNetUrl
    if (value !== '') {
      const status = !!value.match(/https:\/\/.*/gi)
      if (!status) {
        message.error(
          this.props.intl.formatMessage(utilsMsg.HeaderMenuErrorMessage),
        )
        return
      }
    } else {
      message.error(
        this.props.intl.formatMessage(utilsMsg.HeaderMenuInputMessage),
      )
      return
    }
    const eos = EOS({
      httpEndpoint: value,
      chainId: null
    })
    eos.getInfo({}).then(info => {
      storage.setChainId(info.chain_id)
    })
    storage.setNetwork(value)
    this.setState({
      visible: false
    })
  };

  hideModal = () => {
    this.setState({
      visible: false
    })
  };

  toggle = () => {
    this.setState(
      {
        collapsed: !this.state.collapsed
      },
      () => {
        if (this.state.collapsed) {
          this.setState({
            LogoName: false
          })
        } else {
          setTimeout(() => {
            this.setState({
              LogoName: true
            })
          }, 150)
        }
      },
    )
  };

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form
    
    const { formatMessage } = this.props.intl
    const initInfo = formatMessage(utilsMsg.HeaderMenuInfoInit)
    const createAccount = formatMessage(utilsMsg.HeaderMenuCreateAccount)
    const tradeManage = formatMessage(utilsMsg.HeaderMenuTradeManage)
    const stake = formatMessage(utilsMsg.HeaderMenuStake)
    const sendMessage = formatMessage(utilsMsg.HeaderMenuSendMessage)
    const accountSearch = formatMessage(utilsMsg.HeaderMenuAccountSearch)
    const transfer = formatMessage(utilsMsg.HeaderMenuTransfer)
    const buyRamBytes = formatMessage(utilsMsg.HeaderMenuBuyRamBytes)
    const vote = formatMessage(utilsMsg.HeaderMenuVote)
    const IQ = formatMessage(utilsMsg.HeaderMenuIQ)
    const proxy = formatMessage(utilsMsg.HeaderMenuProxy)
    const updateAuth = formatMessage(utilsMsg.HeaderMenuUpdateAuth)
    const refund = formatMessage(utilsMsg.HeaderMenuRefund)
    const airgrab = formatMessage(utilsMsg.HeaderMenuAirgrab)
    const proposal = formatMessage(utilsMsg.HeaderMenuProposal)
    const StatusText = formatMessage(utilsMsg.HeaderMenuStatusText)

    const mainNet = formatMessage(utilsMsg.HeaderMenuOffical)
    const testNet = formatMessage(utilsMsg.HeaderMenuTestNet)
    const otherTestNet = formatMessage(utilsMsg.HeaderMenuOtherTestNet)
    const OfflineAppDownLoad = formatMessage(utilsMsg.HeaderOfflineAppDownLoad)
    const AppDownLoad = formatMessage(utilsMsg.HeaderAppDownLoad)
    const OnlineAppDownLoad = formatMessage(utilsMsg.HeaderOnlineAppDownLoad)
    const sendTrade = formatMessage(utilsMsg.HeaderSendTrade)
    const inputTestNet = formatMessage(utilsMsg.HeaderInputTestNet)
    const sure = formatMessage(utilsMsg.ScanCodeSendSure)
    const cancel = formatMessage(utilsMsg.ScanCodeSendCancel)
    const HelpPage = formatMessage(utilsMsg.HelpPage)

    
    const contentAndriod = (
      <div>
        <div>
          <img src={downloadAndroid} alt="" style={{ width: 120 }} />
          <div style={{ textAlign: 'center' }}>Android</div>
        </div>
      </div>
    )
    const contentIos = (
      <div>
        <div>
          <img src={downloadIos} alt="" style={{ width: 120 }} />
          <div style={{ textAlign: 'center' }}>IOS</div>
        </div>
      </div>
    )

    return (
      <Layout>
        <Helmet
          titleTemplate={`%s -${formatMessage(utilsMsg.AppHelmetTitle)}`}
          defaultTitle={formatMessage(utilsMsg.AppHelmetTitle)}
        >
          <meta
            name="description"
            content={formatMessage(utilsMsg.AppHelmetTitle)}
          />
        </Helmet>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width="250"
        >
          <div
            className="logo"
            style={{
              height: '32px',
              color: '#f5cb48',
              margin: '1.5rem',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '2.5rem'
            }}
          >
            <Link href="/" to="/" innerRef={() => {}}>
              {this.state.LogoName ? (
                <img src={eosCannonLogoBig} alt="" width="75%" />
              ) : (
                <img src={eosCannonLogo} alt="" width="32" />
              )}
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[this.state.defaultSelectedKeys]}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            // defaultOpenKeys = {["tradeManage"]}
          >
            <Menu.Item key="9">
              <Link
                href="/accountSearch"
                to="/accountSearch"
                innerRef={() => {}}
                style={{ display:'flex',alignItems: 'center'}}
              >
                <Icon type="user" />
                <span>{accountSearch}</span>
              </Link>
            </Menu.Item>
           
            {/* <Menu.Item key="17">
              <Link
                href="/scanLogin"
                to="/scanLogin"
                innerRef={() => {}}
              >
                <Icon type="user" />
                <span>扫码登录</span>
              </Link>
            </Menu.Item> */}
            <SubMenu
              key="tradeManage"
              title={
                <span>
                  <Icon type="area-chart" />
                  <span>{tradeManage}</span>
                </span>
              }
            >
              <Menu.Item key="10">
                <Link to="/createAccount" href="/createAccount">
                  {createAccount}
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/stake" href="/stake">
                  {stake}
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/transfer" href="/transfer">
                  {transfer}
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/buyrambytes" href="/buyRamBytes">
                  {buyRamBytes}
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/vote" href="/vote">
                  {vote}
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/proxy" href="/proxy">
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
              <Menu.Item key="11">
                <Link href="/airgrab" to="/airgrab">
                  {airgrab}
                </Link>
              </Menu.Item>
              <Menu.Item key="13">
                <Link href="/iq" to="/iq">
                  {IQ}
                </Link>
              </Menu.Item>
              <Menu.Item key="14">
                <Link href="/proposal" to="/proposal">
                  {proposal}
                </Link>
              </Menu.Item>
              <Menu.Item key="15">
                <Link href="/forumVote" to="/forumVote">
                  {StatusText}
                </Link>
              </Menu.Item>
              <Menu.Item key="16">
                <Link href="/worbli" to="/worbli">
                 Worbli
                </Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/infoInit" href="/infoInit">
                  {initInfo}
                </Link>
              </Menu.Item>
              <Menu.Item key="0">
                <Link to="/sendMessage" href="/sendMessage">
                  {sendMessage}
                </Link>
              </Menu.Item>
            </SubMenu>
            {/* <Menu.SubMenu
              key="2"
              title={
                <span>
                  <Icon type="solution" />
                  <span> {sendTrade}</span>
                </span>
              }
            >
            </Menu.SubMenu> */}
            <Menu.SubMenu
              key="15"
              title={
                <span>
                  <Icon type="appstore-o" />
                  <span> {AppDownLoad}</span>
                </span>
              }
            >
              <Menu.Item key="setting:1">
                <Popover placement="right" content={contentIos}>
                  <a href="https://www.pgyer.com/F7Td" target="_blank">
                    {OnlineAppDownLoad}
                  </a>
                </Popover>
              </Menu.Item>
              <Menu.Item key="setting:2">
                <Popover placement="right" content={contentAndriod}>
                  <a
                    href="https://tool.eoscannon.io:444/offline.1.1.3.apk"
                    target="_blank"
                  >
                    {OfflineAppDownLoad}
                  </a>
                </Popover>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="12">
              <Link
                href="/dscribe"
                to="/dscribe"
                innerRef={() => {}}
                style={{ display:'flex',alignItems: 'center'}}
              >
                <Icon type="notification" />
                <span>{HelpPage} </span>
              </Link>
            </Menu.Item>
          </Menu>

        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{
                fontSize: '18',
                padding: '0 24px',
                cursor: 'pointer',
                transition: 'color .3s'
              }}
            />
            {/*
             <span>一般操作请使用active key</span>
             */}
              {/* <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
              >
          
                <SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />Navigation Three - Submenu</span>}>
                  <MenuItemGroup title="Item 1">
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                  </MenuItemGroup>
                  <MenuItemGroup title="Item 2">
                    <Menu.Item key="setting:3">Option 3</Menu.Item>
                    <Menu.Item key="setting:4">Option 4</Menu.Item>
                  </MenuItemGroup>
                </SubMenu>
              </Menu> */}
            <div
              className="userBox"
              style={{ float: 'right', display: 'flex', alignItems: 'center' }}
            >
            {/* <Form> */}
              <FormItem
                {...formItemLayout}
                style={{marginBottom:0,}}
              >
              {getFieldDecorator('formItemNetWork', {
                initialValue: this.state.mainNetwork,
                rules: [
                  {
                    required: true,
                  }
                ]
              })(
                <Select
                  className="netWork"
                  style={{ width: 110 }}
                  onChange={this.handleChange}
                >
                  <Option value="main">{mainNet}</Option>
                  <Option value="worbli">{testNet}</Option>
                  <Option value="telos">TELOS</Option>
                  <Option value="kylin">KYLIN</Option>
                  <Option value="bos">BOS</Option>
                  <Option value="other">{otherTestNet}</Option>
                </Select>
              )}
              </FormItem>
            {/* </Form> */}
              
              <div
                className="en"
                aria-hidden="true"
                onClick={this.changeLanguage}
                style={{ padding: '0 1rem', color: 'blue' }}
              >
                {this.props.locale === 'en' ? '中文' : 'English'}
              </div>
            </div>
          </Header>
          <div style={{ background: '#fff' }}>{this.props.children}</div>
          <FooterComp />
          <Modal
            title={inputTestNet}
            visible={this.state.visible}
            onOk={this.setNetWork}
            onCancel={this.hideModal}
            okText={sure}
            cancelText={cancel}
          >
            <Tooltip title="https://mainnet.eoscannon.io">
              <Input onChange={this.changeNet} />
            </Tooltip>
          </Modal>
        </Layout>
      </Layout>
    )
  }
}

HeaderComp.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  locale: PropTypes.string,
  children: PropTypes.node,
  onDispatchChangeLanguageReducer: PropTypes.func,
  onDispatchChangeNetworkReducer: PropTypes.func
}

const HeaderCompIntl = injectIntl(HeaderComp)
// 挂载中间件到组件；
const HeaderCompForm = Form.create()(HeaderCompIntl)

function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    onDispatchChangeLanguageReducer: locale =>
      dispatch({ type: 'app/LanguageToggle/CHANGE_LOCALE', locale }),
    onDispatchChangeNetworkReducer: locale =>
      dispatch({ type: 'app/Network/CHANGE_LOCALE', locale })
  }
}

const mapStateToProps = createStructuredSelector({
  netWork: makeSelectNetwork(),
  locale: makeSelectLocale()
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderCompForm)
