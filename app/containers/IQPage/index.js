/*
 * IQPage
 *
 */

import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Switch, Card, Col, Row, Radio, Button } from 'antd'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import {
  formItemLayout,
  getEos,
  openTransactionFailNotification
} from '../../utils/utils'
import { LayoutContent } from '../../components/NodeComp'
import ScanQrcode from '../../components/ScanQrcode'
import DealGetQrcode from '../../components/DealGetQrcode'
import messages from './messages'
import utilsMsg from '../../utils/messages'

import { makeSelectNetwork } from '../LanguageProvider/selectors'
import { message } from 'antd/lib/index'

const FormItem = Form.Item
const FormItemButtonStyle = {
  textAlign: 'center'
}

export class IQPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      SearchButtonState: false,
      IqAction: 'stake',
      isSearchIqBalance: false,
      isSearchIqBalanceSuccess: false,
      IqBalanceFromStake: 0,
      StakeIdsForRefund: [],
      isSearchStakeIdsSuccess: false,
      isSearchStakeIds: false,
      isVoteApprove: true,
      eos: null,
      formatMessage: this.props.intl.formatMessage,
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
      transaction: {}
    }
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    this.onValuesChange(nextProps)
  }

  /**
   * 选择功能选项
   * */
  radioActionOnChange = e => {
    this.setState(
      {
        IqAction: e.target.value,
        GetTransactionButtonState: false
      },
      () => {
        this.onValuesChange(this.props)
      },
    )
  };

  /**
   * 根据选项，获取输入框
   * */
  getFormItemNodes = () => {
    const { IqAction } = this.state
    let FromItem = null
    switch (IqAction) {
      case 'refund':
        FromItem = this.getIqRefundFormItem()
        break
      case 'vote':
        FromItem = this.getIqVoteFormItem()
        break
      case 'reward':
        FromItem = this.getIqRewardFormItem()
        break
      default:
        FromItem = this.getIqStakeFormItem()
        break
    }
    return FromItem
  };

  /**
   * 获取IQ质押输入框
   * */
  getIqStakeFormItem = () => {
    const { getFieldDecorator } = this.props.form
    const {
      SearchButtonState,
      IqBalanceFromStake,
      isSearchIqBalanceSuccess,
      isSearchIqBalance
    } = this.state
    const StakeIqQuantityButtonName = this.state.formatMessage(
      messages.StakeIqQuantityButtonName,
    )
    const StakeIqQuantityInputPlaceholder = this.state.formatMessage(
      messages.StakeIqQuantityInputPlaceholder,
    )
    const StakeIqSearchIqBalanceSuccess = this.state.formatMessage(
      messages.StakeIqSearchIqBalanceSuccess,
      { IqBalanceFromStake },
    )
    const StakeIqSearchIqBalanceFail = this.state.formatMessage(
      messages.StakeIqSearchIqBalanceFail,
    )
    return (
      <div>
        <FormItem style={FormItemButtonStyle}>
          <Button
            type="primary"
            disabled={!SearchButtonState}
            onClick={this.getAvailableIqForStake}
          >
            {StakeIqQuantityButtonName}
          </Button>
          {isSearchIqBalance ? (
            isSearchIqBalanceSuccess ? (
              <p>{StakeIqSearchIqBalanceSuccess}</p>
            ) : (
              <p>{StakeIqSearchIqBalanceFail}</p>
            )
          ) : null}
        </FormItem>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('stakeIqQuantity', {
            rules: [
              {
                required: true,
                message: StakeIqQuantityInputPlaceholder
              }
            ]
          })(
            <Input
              prefix={
                <Icon
                  type="pay-circle-o"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              placeholder={StakeIqQuantityInputPlaceholder}
            />,
          )}
        </FormItem>
      </div>
    )
  };

  /**
   * 获取IQ赎回输入框
   * */
  getIqRefundFormItem = () => {
    const { getFieldDecorator } = this.props.form
    const {
      SearchButtonState,
      StakeIdsForRefund,
      isSearchStakeIdsSuccess,
      isSearchStakeIds
    } = this.state
    const RefundIqButtonName = this.state.formatMessage(
      messages.RefundIqButtonName,
    )
    const RefundIqInputPlaceholder = this.state.formatMessage(
      messages.RefundIqInputPlaceholder,
    )
    const RefundIqSearchStakeIdSuccess = this.state.formatMessage(
      messages.RefundIqSearchStakeIdSuccess,
      { StakeIdsForRefund: StakeIdsForRefund.join(', ') },
    )
    const RefundIqSearchStakeIdFail = this.state.formatMessage(
      messages.RefundIqSearchStakeIdFail,
    )
    return (
      <div>
        <FormItem style={FormItemButtonStyle}>
          <Button
            type="primary"
            disabled={!SearchButtonState}
            onClick={this.getAvailableStakeIdForRefund}
          >
            {RefundIqButtonName}
          </Button>
          {isSearchStakeIds ? (
            isSearchStakeIdsSuccess ? (
              <p>{RefundIqSearchStakeIdSuccess}</p>
            ) : (
              <p>{RefundIqSearchStakeIdFail}</p>
            )
          ) : null}
        </FormItem>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('refundIqQuantity', {
            rules: [
              {
                required: true,
                message: RefundIqInputPlaceholder
              }
            ]
          })(
            <Input
              prefix={
                <Icon
                  type="pay-circle-o"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              placeholder={RefundIqInputPlaceholder}
            />,
          )}
        </FormItem>
      </div>
    )
  };

  /**
   * 获取IQ文章投票输入框
   * */
  getIqVoteFormItem = () => {
    const { getFieldDecorator } = this.props.form
    const {
      SearchButtonState,
      BrainPowerForVote,
      isSearchBrainPowerSuccess,
      isSearchBrainPower
    } = this.state
    const VoteButtonName = this.state.formatMessage(messages.VoteButtonName)
    const VoteSearchBrainPowerSuccess = this.state.formatMessage(
      messages.VoteSearchBrainPowerSuccess,
      { BrainPowerForVote },
    )
    const VoteSearchBrainPowerFail = this.state.formatMessage(
      messages.VoteSearchBrainPowerFail,
    )
    const VoteProposalHashInputPlaceholder = this.state.formatMessage(
      messages.VoteProposalHashInputPlaceholder,
    )
    const VoteBrainpowerAmountInputPlaceholder = this.state.formatMessage(
      messages.VoteBrainpowerAmountInputPlaceholder,
    )
    const VoteSwitchCheckedName = this.state.formatMessage(
      messages.VoteSwitchCheckedName,
    )
    const VoteSwitchUnCheckedName = this.state.formatMessage(
      messages.VoteSwitchUnCheckedName,
    )
    return (
      <div>
        <FormItem style={FormItemButtonStyle}>
          <Button
            type="primary"
            disabled={!SearchButtonState}
            onClick={this.getAvailableBrainPowerForVote}
          >
            {VoteButtonName}
          </Button>
          {isSearchBrainPower ? (
            <p>
              {isSearchBrainPowerSuccess
                ? VoteSearchBrainPowerSuccess
                : VoteSearchBrainPowerFail}
            </p>
          ) : null}
        </FormItem>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('VoteProposalHash', {
            rules: [
              {
                required: true,
                message: VoteProposalHashInputPlaceholder
              }
            ]
          })(
            <Input
              prefix={
                <Icon
                  type="pay-circle-o"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              placeholder={VoteProposalHashInputPlaceholder}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('VoteBrainpowerAmount', {
            rules: [
              {
                required: true,
                message: VoteBrainpowerAmountInputPlaceholder
              }
            ]
          })(
            <Input
              prefix={
                <Icon
                  type="pay-circle-o"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              placeholder={VoteBrainpowerAmountInputPlaceholder}
            />,
          )}
        </FormItem>
        <FormItem>
          <Switch
            checkedChildren={VoteSwitchCheckedName}
            unCheckedChildren={VoteSwitchUnCheckedName}
            defaultChecked={this.state.isVoteApprove}
            onChange={this.onVoteSwitchChange}
          />
        </FormItem>
      </div>
    )
  };

  /**
   * 获取IQ领取奖励输入框
   * */
  getIqRewardFormItem = () => <div />;

  /**
   * 文章投票，用户选择赞成/反对
   * */
  onVoteSwitchChange = checked => {
    this.setState({
      isVoteApprove: checked
    })
  };

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue()
    const { IqAccountName } = values
    const { IqAction } = this.state
    let GetTransactionButtonState = false
    switch (IqAction) {
      case 'refund':
        const { refundIqQuantity } = values
        GetTransactionButtonState = !!IqAccountName && !!refundIqQuantity
        break
      case 'vote':
        const { VoteProposalHash, VoteBrainpowerAmount } = values
        GetTransactionButtonState =
          !!IqAccountName && !!VoteProposalHash && !!VoteBrainpowerAmount
        break
      case 'reward':
        GetTransactionButtonState = !!IqAccountName
        break
      default:
        const { stakeIqQuantity } = values
        GetTransactionButtonState = !!IqAccountName && !!stakeIqQuantity
    }
    this.setState({
      GetTransactionButtonState,
      SearchButtonState: !!IqAccountName
    })
  };

  /**
   * 根据选项，生成未签名报文
   * */
  getTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return
    }
    const eos = getEos(this.props.SelectedNetWork)
    const values = this.props.form.getFieldsValue()
    const { IqAccountName } = values
    const { IqAction } = this.state
    let actions = null

    if (IqAction === 'stake') {
      eos
        .getAbi('everipediaiq')
        .then(res => {
          eos.fc.abiCache.abi('everipediaiq', res.abi)
        })
        .catch(err => {
          message.error(`${err}`)
        })
    } else {
      eos
        .getAbi('eparticlectr')
        .then(res => {
          eos.fc.abiCache.abi('eparticlectr', res.abi)
        })
        .catch(err => {
          message.error(`${err}`)
        })
    }

    switch (IqAction) {
      case 'refund':
        actions = this.getRefundTransaction(values, IqAccountName)
        break
      case 'vote':
        actions = this.getVoteTransaction(values, IqAccountName)
        break
      case 'reward':
        actions = this.getRewardTransaction(values, IqAccountName)
        break
      default:
        actions = this.getStakeTransaction(values, IqAccountName)
        break
    }

    if (!actions) {return}

    eos
      .transaction(
        {
          actions
        },
        {
          sign: false,
          broadcast: false
        },
      )
      .then(tr => {
        this.setState({
          eos,
          transaction: tr.transaction
        })
      })
      .catch(err => {
        openTransactionFailNotification(this.state.formatMessage, err.name)
      })
  };

  /**
   * 生成质押IQ未签名报文
   * */
  getStakeTransaction = (values, IqAccountName) => {
    const { stakeIqQuantity } = values
    const actions = [
      {
        account: 'everipediaiq',
        name: 'brainmeiq',
        authorization: [
          {
            actor: IqAccountName,
            permission: 'active'
          }
        ],
        data: {
          staker: IqAccountName,
          amount: stakeIqQuantity
        }
      }
    ]
    return actions
  };

  /**
   * 生成赎回IQ未签名报文
   * */
  getRefundTransaction = (values, IqAccountName) => {
    const { refundIqQuantity } = values
    const actions = [
      {
        account: 'eparticlectr',
        name: 'brainclmid',
        authorization: [
          {
            actor: IqAccountName,
            permission: 'active'
          }
        ],
        data: {
          claimant: IqAccountName,
          stakeid: refundIqQuantity
        }
      }
    ]
    return actions
  };

  /**
   * 生成文章投票IQ未签名报文
   * */
  getVoteTransaction = (values, IqAccountName) => {
    const { VoteProposalHash, VoteBrainpowerAmount } = values
    const { isVoteApprove } = this.state
    const actions = [
      {
        account: 'eparticlectr',
        name: 'votebyhash',
        authorization: [
          {
            actor: IqAccountName,
            permission: 'active'
          }
        ],
        data: {
          voter: IqAccountName,
          proposal_hash: VoteProposalHash,
          approve: Number(isVoteApprove),
          amount: VoteBrainpowerAmount
        }
      }
    ]
    return actions
  };

  /**
   * 生成领取奖励IQ未签名报文
   * */
  getRewardTransaction = (values, IqAccountName) => {
    const actions = [
      {
        account: 'eparticlectr',
        name: 'rewardclmall',
        authorization: [
          {
            actor: IqAccountName,
            permission: 'active'
          }
        ],
        data: {
          user: IqAccountName
        }
      }
    ]
    return actions
  };

  /**
   * 查询用户可质押IQ数量
   * */
  getAvailableIqForStake = () => {
    const values = this.props.form.getFieldsValue()
    const { IqAccountName } = values
    const eos = getEos(this.props.SelectedNetWork)
    eos
      .getAbi('everipediaiq')
      .then(res => {
        eos.fc.abiCache.abi('everipediaiq', res.abi)
        eos
          .getCurrencyBalance('everipediaiq', IqAccountName, 'IQ')
          .then(re => {
            const IqBalanceFromStake = Number(
              re[0].substring(0, re[0].length - 3),
            )
            this.setState({
              IqBalanceFromStake,
              isSearchIqBalance: true,
              isSearchIqBalanceSuccess: true
            })
          })
          .catch(err => {
            this.setState({
              IqBalanceFromStake: 0,
              isSearchIqBalance: true,
              isSearchIqBalanceSuccess: false
            })
          })
      })
      .catch(err => {
        message.error(`${err}`)
      })
  };

  /**
   * 查询用户可赎回的StakeId
   * */
  getAvailableStakeIdForRefund = () => {
    const values = this.props.form.getFieldsValue()
    const { IqAccountName } = values
    const eos = getEos(this.props.SelectedNetWork)
    const nextAccountName =
      IqAccountName.substr(0, IqAccountName.length - 1) +
      String.fromCharCode(
        IqAccountName.charCodeAt(IqAccountName.length - 1) + 1,
      )
    eos
      .getAbi('eparticlectr')
      .then(res => {
        eos.fc.abiCache.abi('eparticlectr', res.abi)
        eos
          .getTableRows({
            scope: 'eparticlectr',
            code: 'eparticlectr',
            table: 'staketbl',
            json: true,
            key_type: 'name',
            index_position: '2',
            limit: '999999999999',
            lower_bound: IqAccountName,
            upper_bound: nextAccountName
          })
          .then(tr => {
            const { rows } = tr
            const StakeIdsForRefund = []
            const nowCompletionTime = Math.ceil(new Date().getTime() / 1000)
            rows.forEach(item => {
              // 过期检查
              if (item.completion_time <= nowCompletionTime) {
                StakeIdsForRefund.push(item.id)
              }
            })
            this.setState({
              StakeIdsForRefund,
              isSearchStakeIds: true,
              isSearchStakeIdsSuccess: true
            })
          })
          .catch(err => {
            openTransactionFailNotification(this.state.formatMessage, err.name)
            this.setState({
              StakeIdsForRefund: [],
              isSearchStakeIds: true,
              isSearchStakeIdsSuccess: false
            })
          })
      })
      .catch(err => {
        message.error(`${err}`)
      })
  };

  /**
   * 查询用户可赎回的BrainPower
   * */
  getAvailableBrainPowerForVote = () => {
    const values = this.props.form.getFieldsValue()
    const { IqAccountName } = values
    const eos = getEos(this.props.SelectedNetWork)
    const nextAccountName =
      IqAccountName.substr(0, IqAccountName.length - 1) +
      String.fromCharCode(
        IqAccountName.charCodeAt(IqAccountName.length - 1) + 1,
      )
    eos
      .getAbi('eparticlectr')
      .then(res => {
        eos.fc.abiCache.abi('eparticlectr', res.abi)
        eos
          .getTableRows({
            scope: 'eparticlectr',
            code: 'eparticlectr',
            table: 'brainpwrtbl',
            lower_bound: IqAccountName,
            upper_bound: nextAccountName,
            json: true
          })
          .then(tr => {
            const { rows } = tr
            const BrainPowerForVote = rows[0].power
            this.setState({
              BrainPowerForVote,
              isSearchBrainPower: true,
              isSearchBrainPowerSuccess: true
            })
          })
          .catch(err => {
            openTransactionFailNotification(this.state.formatMessage, err.name)
            this.setState({
              BrainPowerForVote: 0,
              isSearchBrainPower: true,
              isSearchBrainPowerSuccess: false
            })
          })
      })
      .catch(err => {
        message.error(`${err}`)
      })
  };

  render () {
    const { getFieldDecorator } = this.props.form
    const IqAccountNamePlaceholder = this.state.formatMessage(
      messages.IqAccountNamePlaceholder,
    )
    const StakeRadioButtonName = this.state.formatMessage(
      messages.StakeRadioButtonName,
    )
    const RefundRadioButtonName = this.state.formatMessage(
      messages.RefundRadioButtonName,
    )
    const ArticleVoteRadioButtonName = this.state.formatMessage(
      messages.ArticleVoteRadioButtonName,
    )
    const RewardRadioButtonName = this.state.formatMessage(
      messages.RewardRadioButtonName,
    )
    const ProducersDealTranscation = this.state.formatMessage(
      utilsMsg.ProducersDealTranscation,
    )
    const ProducersSendTranscation = this.state.formatMessage(
      utilsMsg.ProducersSendTranscation,
    )
    return (
      <LayoutContent>
        <Row gutter={16}>
          <Col lg={12} xs={24}>
            <Card title={ProducersDealTranscation} bordered={false}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('IqAccountName', {
                  rules: [
                    { required: true, message: IqAccountNamePlaceholder }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder={IqAccountNamePlaceholder}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                <Radio.Group
                  buttonStyle="solid"
                  defaultValue={this.state.IqAction}
                  onChange={this.radioActionOnChange}
                >
                  <Radio.Button value="stake">
                    {StakeRadioButtonName}
                  </Radio.Button>
                  <Radio.Button value="refund">
                    {RefundRadioButtonName}
                  </Radio.Button>
                  <Radio.Button value="vote">
                    {ArticleVoteRadioButtonName}
                  </Radio.Button>
                  <Radio.Button value="reward">
                    {RewardRadioButtonName}
                  </Radio.Button>
                </Radio.Group>
              </FormItem>
              {this.getFormItemNodes()}
              <DealGetQrcode
                eos={this.state.eos}
                form={this.props.form}
                formatMessage={this.state.formatMessage}
                GetTransactionButtonClick={this.getTransaction}
                GetTransactionButtonState={this.state.GetTransactionButtonState}
                QrCodeValue={this.state.QrCodeValue}
                SelectedNetWork={this.props.SelectedNetWork}
                transaction={this.state.transaction}
              />
            </Card>
          </Col>
          <Col lg={12} xs={24}>
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
    )
  }
}

IQPage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string
}

const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork()
})

const IQPageIntl = injectIntl(IQPage)
const IQPageForm = Form.create(mapStateToProps)(IQPageIntl)

export default connect(mapStateToProps)(IQPageForm)
