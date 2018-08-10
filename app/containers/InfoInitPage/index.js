/*
 * CreateAccountPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Input, Button, Alert } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

import { makeSelectNetwork } from '../LanguageProvider/selectors';
import { getEosInfoDetail, openNotification } from '../../utils/utils';
import messages from './messages';

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
    const infoAlertMessage = this.state.formatMessage(
      messages.infoAlertMessage,
    );
    const infoAlertDescription = this.state.formatMessage(
      messages.infoAlertDescription,
    );
    const infoAlertCopy = this.state.formatMessage(messages.infoAlertCopy);

    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            {/* {this.props.SelectedNetWork === 'test' ? ( */}
            {/* <FormItem style={{ textAlign: 'center', margin: '0 5% 5%' }}> */}
            {/* <Search */}
            {/* placeholder="network url" */}
            {/* enterButton="变更测试网" */}
            {/* size="default" */}
            {/* defaultValue={this.state.network} */}
            {/* onSearch={this.handleSearch} */}
            {/* /> */}
            {/* </FormItem> */}
            {/* ) : null} */}
            <FormItem>
              <Alert
                message={infoAlertMessage}
                description={infoAlertDescription}
                type="info"
              />
            </FormItem>
            <FormItem>
              <div style={{ textAlign: 'center' }}>
                <QRCode value={this.state.QrCodeValue} size={256} />
              </div>
            </FormItem>
            <FormItem>
              <TextArea
                value={this.state.QrCodeValue}
                rows="4"
                disabled="true"
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="form-button"
                onClick={this.handleCopyTransaction}
              >
                {infoAlertCopy}
              </Button>
            </FormItem>
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
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
