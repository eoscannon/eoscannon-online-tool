/*
 * CreateAccountPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Input, Button, Alert, Card } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

import { makeSelectNetwork } from '../LanguageProvider/selectors';
import { getEosInfoDetail, openNotification } from '../../utils/utils';
import messages from './messages';
import teacherPic from './../../images/cannonTeach.jpg';

import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';

const FormItem = Form.Item;
const { TextArea } = Input;

export class CreateAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      QrCodeValue: '欢迎使用EosCannon在线工具', // 二维码内容,
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.SelectedNetWork &&
      nextProps.SelectedNetWork !== this.props.SelectedNetWork
    ) {
      this.handleGetTransaction(nextProps.SelectedNetWork);
    }
  }
  componentDidMount() {
    this.handleGetTransaction(this.props.SelectedNetWork);
  }
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = SelectedNetWork => {
    getEosInfoDetail(SelectedNetWork).then(BlockInfo => {
      this.props.form.setFieldsValue({
        transaction: JSON.stringify(BlockInfo),
      });
      this.setState({
        QrCodeValue: JSON.stringify(BlockInfo),
      });
    });
  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    copy(this.state.QrCodeValue);
    openNotification(this.state.formatMessage);
  };

  render() {
    //const DescriblePageDescmessage = this.state.formatMessage(
    //  messages.DescriblePageDescmessage,
    //);
    const infoAlertDescription = this.state.formatMessage(
      messages.infoAlertDescription,
    );
    const infoAlertCopy = this.state.formatMessage(messages.infoAlertCopy);

    return (
      <LayoutContentBox>
        <FormComp>
          <FormItem>
            <Card title="佳能工具介绍" bordered={false}>
              <p>佳能工具，私钥和签名都在离线手机上，也就是私钥完全不接触网络，是最安全的使用私钥的方式。我们可以把它当做冷钱包使用。建议小额账户用钱包管理，大额账户用佳能工具管理。</p>
              <p>佳能工具分为两部分：离线APP + 在线发送</p>
              <p>离线APP可从左边菜单栏点击下载。</p>
              <p>
                所有交易分为三个步骤：<br/>
                1.生成<b style={{color: '#000'}}>未签名</b>的交易 <br/>
                2.<b style={{color: '#000'}}>离线</b>APP签名 <br/>
                3.在线发送<b style={{color: '#000'}}>已签名</b>的交易 <br/>
              </p>
              <div>
                <img src={teacherPic} alt=""  style={{width:'100%'}}/>
              </div>
              <br/>
              <br/>
              <br/>
              <p>
                注意：绝大部分操作，使用active私钥签名即可； <br/>
               &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改权限的公私钥操作，请使用owner私钥签名。
              </p>
              <p>
                EOS Cannon Tool, always keep the private key and sign transaction on offline phone, is the safest way to use private key. It can be used as a cold wallet. We recommend you use other wallets to manage small account, and use Cannon Tool to manage large account.
              </p>
              <p>Cannon Tool has two parts: offline APP + online PC</p>
              <p>Offline APP can be downloaded by clicking the left menu.</p>
              <p>
                All transactions can divide into three steps: <br/>
                1.	Generate <b style={{color: '#000'}}>unsigned </b>transaction <br/>
                2.	<b style={{color: '#000'}}>Offline APP </b> sign transaction <br/>
                3.	Send <b style={{color: '#000'}}>signed</b> transaction <br/>
              </p>
              <p>
                Tips: For most actions,<b style={{color: '#000'}}>active</b> private key is needed to sign transaction; <br/>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For changing keys, please use <b style={{color: '#000'}}>owner</b> private key to sign transaction.
              </p>
            </Card>
          </FormItem>
        </FormComp>
      </LayoutContentBox>
    );
  }
}

CreateAccountPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
};
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
});

const CreateAccountPageIntl = injectIntl(CreateAccountPage);
const CreateAccountPageForm = Form.create()(CreateAccountPageIntl);
export default connect(mapStateToProps)(CreateAccountPageForm);
