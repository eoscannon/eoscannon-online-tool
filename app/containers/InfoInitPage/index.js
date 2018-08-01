/*
 * CreateAccountPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import copy from 'copy-to-clipboard';
import { storage } from 'utils/storage';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  getEosTest,
  openNotification,
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
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors';

const FormItem = Form.Item;
const Search = Input.Search;

export class CreateAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: '', // 二维码内容,
      network:'https://tool.eoscannon.io/jungle',
      networkMethod:''
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    console.log("nextProps===",nextProps)
    //console.log("this.state.networkMethod===",this.state.networkMethod)
    this.setState({
      networkMethod: nextProps.netWork
    })
    if(this.props.netWork == 'test'){
      this.setState({
        network: 'https://tool.eoscannon.io/jungle'
      })
    }
    //存到storage中
    storage.setNetwork(nextProps.netWork)
    if(nextProps.netWork != this.props.netWork ){
      this.init(nextProps.netWork)
    }
  }
  componentWillMount(){
    this.init(this.props.netWork)
  }

  init=(value)=>{
    if(value == 'test'){
      this.setState({
        network: 'https://tool.eoscannon.io/jungle'
      })
    }else {
      this.setState({
        network: 'https://mainnet.eoscannon.io'
      })
    }
    console.log('this.props.netWork value===',value)
    this.handleGetTransaction(value)
  }
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = (netWork) => {
    //let network = storage.getNetwork()
    let eos
    if(netWork=='main'){
       eos = getEos();
    }else if(netWork == 'test'){
      eos = getEosTest();
    }else{
      return
    }
    const expireInSeconds = 60 * 60; // 1 hour
    eos.getInfo({}).then((info) => {
      const chainDate = new Date(`${info.head_block_time}Z`);
      const expiration = new Date(chainDate.getTime() + expireInSeconds * 1000);
      const expirationStr = expiration.toISOString().split('.')[0];
      const refBlockNum = info.last_irreversible_block_num & 0xffff;
      eos.getBlock(info.last_irreversible_block_num).then(block => {
        const refBlockPrefix = block.ref_block_prefix;
        const transactionHeaders = {
          expiration: expirationStr,
          refBlockNum: refBlockNum,
          refBlockPrefix: refBlockPrefix,
          chainId: info.chain_id
        };
        this.props.form.setFieldsValue({
          transaction: JSON.stringify(block),
        });
        this.setState({
          GetTransactionButtonLoading: false,
          value: transactionHeaders,
          QrCodeValue: JSON.stringify(transactionHeaders),
        });
      });
    }).catch(err => {
      this.setState({
        GetTransactionButtonLoading: false,
      });
      openTransactionFailNotification(this.state.formatMessage, err.name);
    });


  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    //if (!this.state.CopyTransactionButtonState) {
    //  return;
    //}
    copy(this.state.QrCodeValue);
    openNotification(this.state.formatMessage);
  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleSearch = () => {
    console.log('val:',value)
    this.setState({
      network: value
    })
  };

  render() {
    const { formatMessage } = this.props.form;
    //console.log('this.props.netWork info===',this.props.netWork )

    //const ChangeTestNet = this.state.formatMessage(messages.ChangeTestNet);
    const NameLabel = this.state.formatMessage(messages.NameLabel);
    const BytesLabel = this.state.formatMessage(messages.BytesLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormItem  style={{ textAlign: 'center',margin: '0 5% 5%' }}>
            <FormComp>
              {
                this.props.netWork == 'test' ?(
                  <Search
                    placeholder="network url"
                    enterButton="变更测试网"
                    size="default"
                    defaultValue={this.state.network}
                    onSearch={this.handleSearch}
                  />
                ) : (<span></span>)
              }
            </FormComp>
          </FormItem>
          <FormComp>
            <GetQrcode
              GetTransactionButtonLoading={
                this.state.GetTransactionButtonLoading
              }

              QrCodeValue={this.state.QrCodeValue}
              CopyTransactionButtonState={this.state.CopyTransactionButtonState}
              handleCopyTransaction={this.handleCopyTransaction}
            />
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}


CreateAccountPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  netWork: makeSelectNetwork(),
});

const CreateAccountPageIntl = injectIntl(CreateAccountPage);
const CreateAccountPageForm = Form.create()(CreateAccountPageIntl);
export default connect(
  mapStateToProps
)(CreateAccountPageForm);
//export default CreateAccountPageForm;
