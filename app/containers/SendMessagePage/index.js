/*
 * StakePage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Switch, Button, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import { storage } from 'utils/storage';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectNetwork } from '../../containers/LanguageProvider/selectors';
import styleComps from './styles';

import {
  formItemLayout,
  getEos,
  getEosTest,
  openTransactionSuccessNotification,
  openNotification,
} from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';

import ScanSendQrcode from '../../components/ScanSendQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;
const confirm = Modal.confirm;

export class SendMessagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      isDelegatebw: true, // true：质押；false：解质押
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      transaction_id:'',
      netWork:'',
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    this.setState({netWork: nextProps.netWork})
  }
  componentWillMount(){
    let netWork  = storage.getNetwork()
    this.setState({netWork: this.props.netWork})

  }
  /**
   * 用户点击发送签名报文，并提示用户已发送
   * */
  sendMessage= () => {
    let eos = null
    console.log("this.state.netWork====",this.state.netWork)
    if(this.state.netWork =='main'){
      eos = getEos()
    }else{
      eos = getEosTest()
    }
   eos.pushTransaction(JSON.parse(this.props.form.getFieldsValue().jsonInfo)).then((res) => {

      message.success(`发送报文成功,请在页尾查看transaction_id=${res.transaction_id}`);
      this.setState({transaction_id: res.transaction_id})

    }).catch((err) => {
      console.log('Err:',err);
       confirm({
         title: '错误信息',
         content: err+'' ,
         onOk() {},
         onCancel() {},
       });
    });

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const DelegateSwitchCheckedName = this.state.formatMessage(
      messages.DelegateSwitchCheckedName
    );
    return (
      <LayoutContent>
        <LayoutContentBox>
          <styleComps.ConBox>

            <FormComp>
              <ScanSendQrcode
                form={this.props.form}
                transaction={this.state.transaction}
                formatMessage={this.state.formatMessage}/>
            </FormComp>
            {/*
             <FormComp>
             <Button
             type="primary"
             className="form-button"
             onClick={this.sendMessage}>
             发送
             </Button>

             </FormComp>
            */}
            <FormComp>
              <FormItem style={{ textAlign: 'center'}}>txid:{this.state.transaction_id}</FormItem>
            </FormComp>
          </styleComps.ConBox>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

SendMessagePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  netWork: makeSelectNetwork(),
});

const SendMessagePageIntl = injectIntl(SendMessagePage);
const SendMessagePageForm = Form.create()(SendMessagePageIntl);

export default connect(
  mapStateToProps
)(SendMessagePageForm);
