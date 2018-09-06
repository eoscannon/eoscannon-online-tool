/*
 * UpdateAuthPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Card, Col, Row, Modal } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectNetwork } from '../LanguageProvider/selectors';
import {
  formItemLayout,
  getEos,
  openTransactionFailNotification,
} from '../../utils/utils';
import { LayoutContent } from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';
import DealGetQrcode from '../../components/DealGetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;

export class UpdateAuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {},
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
    const { AccountName, ActiveKey, OwnerKey } = values;
    this.setState({
      GetTransactionButtonState: !!AccountName && (!!ActiveKey || !!OwnerKey),
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const eos = getEos(this.props.SelectedNetWork);
    const { AccountName, ActiveKey, OwnerKey } = values;
    const actions = [];
    if (ActiveKey) {
      const UpdateActiveKeyAction = {
        account: 'eosio',
        name: 'updateauth',
        authorization: [
          {
            actor: AccountName,
            permission: 'owner',
          },
        ],
        data: {
          account: AccountName,
          permission: 'active',
          parent: 'owner',
          auth: ActiveKey,
        },
      };
      actions.push(UpdateActiveKeyAction);
    }
    if (OwnerKey) {
      const UpdateOwnerKeyAction = {
        account: 'eosio',
        name: 'updateauth',
        authorization: [
          {
            actor: AccountName,
            permission: 'owner',
          },
        ],
        data: {
          account: AccountName,
          permission: 'owner',
          parent: '',
          auth: OwnerKey,
        },
      };
      actions.push(UpdateOwnerKeyAction);
    }
    eos
      .transaction(
        {
          actions,
        },
        {
          sign: false,
          broadcast: false,
        },
      )
      .then(tr => {
        this.setState({
          eos,
          transaction: tr.transaction,
        });
        Modal.warning({
          title: '',
          content: '修改权限请在离线工具上使用Owner私钥进行签名！',
        });
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const UpdateAuthAccountNamePlaceholder = this.state.formatMessage(
      messages.UpdateAuthAccountNamePlaceholder,
    );
    const UpdateAuthActiveKeyPlaceholder = this.state.formatMessage(
      messages.UpdateAuthActiveKeyPlaceholder,
    );
    const UpdateAuthOwnerKeyPlaceholder = this.state.formatMessage(
      messages.UpdateAuthOwnerKeyPlaceholder,
    );
    // const AccountLabel = this.state.formatMessage(messages.AccountLabel);
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    );
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    );
    return (
      <LayoutContent>
        <Row gutter={16}>
          <Col span={12}>
            <Card title={ProducersDealTranscation} bordered={false}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('AccountName', {
                  rules: [
                    {
                      required: true,
                      message: UpdateAuthAccountNamePlaceholder,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={UpdateAuthAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('ActiveKey', {
                  rules: [
                    {
                      required: true,
                      message: UpdateAuthActiveKeyPlaceholder,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="unlock"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder={UpdateAuthActiveKeyPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('OwnerKey', {
                  rules: [
                    {
                      required: false,
                      message: UpdateAuthOwnerKeyPlaceholder,
                    },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="unlock"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder={UpdateAuthOwnerKeyPlaceholder}
                  />,
                )}
              </FormItem>
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.handleGetTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                QrCodeValue={this.state.QrCodeValue}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={ProducersSendTranscation} bordered={false}>
              <ScanQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
              />
            </Card>
          </Col>
        </Row>
      </LayoutContent>
    );
  }
}

UpdateAuthPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
};

const UpdateAuthPageIntl = injectIntl(UpdateAuthPage);
const UpdateAuthPageForm = Form.create()(UpdateAuthPageIntl);

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
});

export default connect(mapStateToProps)(UpdateAuthPageForm);
