/*
 * ProxyPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input } from 'antd';
import copy from 'copy-to-clipboard';
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
  openTransactionSuccessNotification,
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

const FormItem = Form.Item;

export class ProxyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    this.onValuesChange(nextProps);
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const { jsonInfo, keyProvider, voter, transaction } = values;
    this.setState({
      GetTransactionButtonState: jsonInfo && keyProvider && voter,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo && keyProvider && voter && transaction,
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    this.setState({
      GetTransactionButtonLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const eos = getEos(values);
    const { voter, proxy } = values;
    eos
      .voteproducer({
        voter,
        proxy: proxy || '',
        producers: [],
      })
      .then(tr => {
        this.props.form.setFieldsValue({
          transaction: JSON.stringify(tr.transaction),
        });
        this.setState({
          GetTransactionButtonLoading: false,
          QrCodeValue: JSON.stringify(tr.transaction),
        });
        openTransactionSuccessNotification(this.state.formatMessage);
      })
      .catch(err => {
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
    if (!this.state.CopyTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const { transaction } = values;
    copy(transaction);
    openNotification(this.state.formatMessage);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const VoterPlaceholder = this.state.formatMessage(
      messages.VoterPlaceholder,
    );
    const ProxyHelp = this.state.formatMessage(messages.ProxyHelp);
    const ProxyPlaceholder = this.state.formatMessage(
      messages.ProxyPlaceholder,
    );
    const VoterLabel = this.state.formatMessage(messages.VoterLabel);
    const ProxyLabel = this.state.formatMessage(messages.ProxyLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
            />
            <FormItem {...formItemLayout} label={VoterLabel} colon>
              {getFieldDecorator('voter', {
                rules: [{ required: true, message: VoterPlaceholder }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={VoterPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem
              help={ProxyHelp}
              {...formItemLayout}
              label={ProxyLabel}
              colon
            >
              {getFieldDecorator('proxy', {
                rules: [
                  {
                    required: true,
                    message: ProxyPlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={ProxyPlaceholder}
                />,
              )}
            </FormItem>
            <GetQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
              GetTransactionButtonClick={this.handleGetTransaction}
              GetTransactionButtonLoading={
                this.state.GetTransactionButtonLoading
              }
              GetTransactionButtonDisabled={
                this.state.GetTransactionButtonState
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

ProxyPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const ProxyPageIntl = injectIntl(ProxyPage);
const ProxyPageForm = Form.create()(ProxyPageIntl);

export default ProxyPageForm;
