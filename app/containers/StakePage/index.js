/*
 * StakePage
 *
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Switch } from 'antd';
import copy from 'copy-to-clipboard';
import {
  formItemLayout,
  getEos,
  getEosTest,
  getEosInfo,
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
import DealGetQrcode from '../../components/DealGetQrcode';
import messages from './messages';
import utilsMsg from '../../utils/messages';

const FormItem = Form.Item;

export class StakePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      isDelegatebw: true, // true：质押；false：解质押
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
   * 用户选择质押/解质押
   * */
  onSwitchChange = checked => {
    this.setState({
      isDelegatebw: checked,
    });
  };
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const {
      jsonInfo,
      //keyProvider,
      FromAccountName,
      stakeNetQuantity,
      stakeCpuQuantity,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        //keyProvider &&
        FromAccountName &&
        stakeNetQuantity &&
        stakeCpuQuantity,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        //keyProvider &&
        FromAccountName &&
        stakeNetQuantity &&
        stakeCpuQuantity &&
        transaction,
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数、选择的质押/解质押，生成签名报文，并将其赋值到文本框和生成对应的二维码
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
    const opts = {sign: false, broadcast: false}

    const {
      FromAccountName,
      ReceiverAccountName,
      stakeNetQuantity,
      stakeCpuQuantity,
    } = values;
    if (this.state.isDelegatebw) {
      eos
        .delegatebw({
          from: FromAccountName,
          receiver: ReceiverAccountName || FromAccountName,
          stake_net_quantity: `${Number(stakeNetQuantity).toFixed(4)} EOS`,
          stake_cpu_quantity: `${Number(stakeCpuQuantity).toFixed(4)} EOS`,
          transfer: 0,
        },opts)
        .then(tr => {
          this.props.form.setFieldsValue({
            transaction: JSON.stringify(tr.transaction),
          });
          this.setState({
            GetTransactionButtonLoading: false,
            QrCodeValue: JSON.stringify(tr.transaction),
          });
          this.openTransactionSuccessNotification();
        })
        .catch(err => {
          this.setState({
            GetTransactionButtonLoading: false,
          });
          openTransactionFailNotification(err.name);
        });
    } else {
      eos
        .undelegatebw({
          from: FromAccountName,
          receiver: ReceiverAccountName,
          unstake_net_quantity: `${Number(stakeNetQuantity).toFixed(4)} EOS`,
          unstake_cpu_quantity: `${Number(stakeCpuQuantity).toFixed(4)} EOS`,
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
    }
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
    const DelegateSwitchCheckedName = this.state.formatMessage(
      messages.DelegateSwitchCheckedName,
    );
    const DelegateSwitchUnCheckedName = this.state.formatMessage(
      messages.DelegateSwitchUnCheckedName,
    );
    const FromAccountNamePlaceholder = this.state.isDelegatebw
      ? this.state.formatMessage(messages.DelegateFromAccountNamePlaceholder)
      : this.state.formatMessage(messages.UnDelegateFromAccountNamePlaceholder);
    const ReceiverAccountNamePlaceholder = this.state.isDelegatebw
      ? this.state.formatMessage(
          messages.DelegateReceiverAccountNamePlaceholder,
        )
      : this.state.formatMessage(
          messages.UnDelegateReceiverAccountNamePlaceholder,
        );
    const ReceiverAccountNameHelp = this.state.isDelegatebw
      ? this.state.formatMessage(messages.DelegateReceiverAccountNameHelp)
      : this.state.formatMessage(messages.UnDelegateReceiverAccountNameHelp);
    const StakeNetQuantityPlaceholder = this.state.isDelegatebw
      ? this.state.formatMessage(messages.DelegateStakeNetQuantityPlaceholder)
      : this.state.formatMessage(
          messages.UnDelegateStakeNetQuantityPlaceholder,
        );
    const StakeCpuQuantityPlaceholder = this.state.isDelegatebw
      ? this.state.formatMessage(messages.DelegateStakeCpuQuantityPlaceholder)
      : this.state.formatMessage(
          messages.UnDelegateStakeCpuQuantityPlaceholder,
        );
    const FromLabel = this.state.formatMessage(messages.FromLabel);
    const ReceiverLabel = this.state.formatMessage(messages.ReceiverLabel);
    const NetQuantityLabel = this.state.formatMessage(
      messages.NetQuantityLabel,
    );
    const CpuQuantityLabel = this.state.formatMessage(
      messages.CpuQuantityLabel,
    );
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <ScanQrcode
              form={this.props.form}
              formatMessage={this.state.formatMessage}
            />
            <FormItem>
              <Switch
                checkedChildren={DelegateSwitchCheckedName}
                unCheckedChildren={DelegateSwitchUnCheckedName}
                defaultChecked={this.state.isDelegatebw}
                onChange={this.onSwitchChange}
              />
            </FormItem>
            <FormItem {...formItemLayout} label={FromLabel} colon>
              {getFieldDecorator('FromAccountName', {
                rules: [
                  { required: true, message: FromAccountNamePlaceholder },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={FromAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem
              help={ReceiverAccountNameHelp}
              {...formItemLayout}
              label={ReceiverLabel}
              colon
            >
              {getFieldDecorator('ReceiverAccountName', {
                rules: [
                  {
                    required: true,
                    message: ReceiverAccountNamePlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={ReceiverAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={NetQuantityLabel} colon>
              {getFieldDecorator('stakeNetQuantity', {
                rules: [
                  {
                    required: true,
                    message: StakeNetQuantityPlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={StakeNetQuantityPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={CpuQuantityLabel} colon>
              {getFieldDecorator('stakeCpuQuantity', {
                rules: [
                  {
                    required: true,
                    message: StakeCpuQuantityPlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder={StakeCpuQuantityPlaceholder}
                />,
              )}
            </FormItem>
            <DealGetQrcode
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

StakePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
};

const StakePageIntl = injectIntl(StakePage);
const StakePageForm = Form.create()(StakePageIntl);

export default StakePageForm;
