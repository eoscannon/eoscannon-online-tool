/*
 * UpdateAuthPage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Alert, Card, Button } from 'antd';
import copy from 'copy-to-clipboard';
import ecc from 'eosjs-ecc';
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

export class UpdateAuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      GetPrivateKeyButtonLoading: false,
      KeyDescription: '',
      GetCheckPrivateKeyButtonLoading: false,
      GetCheckPrivateKeyButtonState: false,
      CheckDescription: '',
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
    const {
      CheckKeyProvide,
      jsonInfo,
      keyProvider,
      AccountName,
      ActiveKey,
      OwnerKey,
      transaction,
    } = values;
    this.setState({
      GetCheckPrivateKeyButtonState: !CheckKeyProvide,
    });
    this.setState({
      GetTransactionButtonState:
        jsonInfo && keyProvider && AccountName && (ActiveKey || OwnerKey),
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        AccountName &&
        (ActiveKey || OwnerKey) &&
        transaction,
    });
  };
  /**
   * 校验私钥
   * */
  handleCheckPrivateKey = () => {
    this.setState({
      GetCheckPrivateKeyButtonLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const { CheckPrivateKey } = values;
    const CheckDescription =
      ecc.isValidPrivate(CheckPrivateKey) === true ? (
        <div>
          <p>私钥 Private Key: {CheckPrivateKey}</p>
          <p>公钥 Public Key: {ecc.privateToPublic(CheckPrivateKey)}</p>
        </div>
      ) : (
        <div>
          <p>您的私钥 Private Key: {CheckPrivateKey} 是不合法的私钥</p>
        </div>
      );
    this.setState({
      CheckDescription,
      GetCheckPrivateKeyButtonLoading: false,
    });
  };
  /**
   * 生成公私钥
   * */
  handleCreatePrivateKey = () => {
    this.setState({
      GetPrivateKeyButtonLoading: true,
    });
    ecc.randomKey().then(privateKey => {
      const KeyDescription = (
        <div>
          <p>公钥 Public Key: {ecc.privateToPublic(privateKey)}</p>
          <p>私钥 Private Key: {privateKey}</p>
          <p>如果使用该公私钥，请记下私钥，请不要在网络上传输私钥。</p>
        </div>
      );
      this.setState({
        KeyDescription,
        GetPrivateKeyButtonLoading: false,
      });
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
      .transaction({
        actions,
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
    const CheckPrivateKeyMessage = this.state.formatMessage(
      messages.CheckPrivateKeyMessage,
    );
    const CheckPrivateKeyPlaceholder = this.state.formatMessage(
      messages.CheckPrivateKeyPlaceholder,
    );
    const GetPrivateKeyButtonMessage = this.state.formatMessage(
      messages.GetPrivateKeyButtonMessage,
    );
    const ModifyPrivateKeyTitle = this.state.formatMessage(
      messages.ModifyPrivateKeyTitle,
    );
    const UpdateAuthAccountNamePlaceholder = this.state.formatMessage(
      messages.UpdateAuthAccountNamePlaceholder,
    );
    const UpdateAuthActiveKeyPlaceholder = this.state.formatMessage(
      messages.UpdateAuthActiveKeyPlaceholder,
    );
    const UpdateAuthOwnerKeyPlaceholder = this.state.formatMessage(
      messages.UpdateAuthOwnerKeyPlaceholder,
    );
    const PrivateKeyLabel = this.state.formatMessage(messages.PrivateKeyLabel);
    const AccountLabel = this.state.formatMessage(messages.AccountLabel);
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <Card title={CheckPrivateKeyMessage} style={{ marginBottom: 24 }}>
              <FormItem>
                <Alert
                  message={CheckPrivateKeyMessage}
                  description={this.state.CheckDescription}
                  type="info"
                />
              </FormItem>
              <FormItem {...formItemLayout} label={PrivateKeyLabel} colon>
                {getFieldDecorator('CheckPrivateKey', {
                  rules: [
                    { required: true, message: CheckPrivateKeyPlaceholder },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={CheckPrivateKeyPlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  className="form-button"
                  loading={this.state.GetCheckPrivateKeyButtonLoading}
                  disabled={!this.state.GetCheckPrivateKeyButtonState}
                  onClick={this.handleCheckPrivateKey}
                >
                  {CheckPrivateKeyMessage}
                </Button>
              </FormItem>
            </Card>
            <Card
              title={GetPrivateKeyButtonMessage}
              style={{ marginBottom: 24 }}
            >
              <FormItem>
                <Alert
                  message={GetPrivateKeyButtonMessage}
                  description={this.state.KeyDescription}
                  type="info"
                />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  className="form-button"
                  loading={this.state.GetPrivateKeyButtonLoading}
                  onClick={this.handleCreatePrivateKey}
                >
                  {GetPrivateKeyButtonMessage}
                </Button>
              </FormItem>
            </Card>
            <Card title={ModifyPrivateKeyTitle}>
              <ScanQrcode
                form={this.props.form}
                formatMessage={this.state.formatMessage}
              />
              <FormItem {...formItemLayout} label={AccountLabel} colon>
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
              <FormItem {...formItemLayout} label="ActiveKey" colon>
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
              <FormItem {...formItemLayout} label="OwnerKey" colon>
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
                CopyTransactionButtonState={
                  this.state.CopyTransactionButtonState
                }
                handleCopyTransaction={this.handleCopyTransaction}
              />
            </Card>
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

UpdateAuthPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const UpdateAuthPageIntl = injectIntl(UpdateAuthPage);
const UpdateAuthPageForm = Form.create()(UpdateAuthPageIntl);

export default UpdateAuthPageForm;
