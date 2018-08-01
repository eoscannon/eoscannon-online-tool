/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  DelegateSwitchCheckedName: {
    id: 'StakePage DelegateSwitchCheckedName',
    defaultMessage: '质押',
  },
  DelegateSwitchUnCheckedName: {
    id: 'StakePage DelegateSwitchUnCheckedName',
    defaultMessage: '解质押',
  },
  DelegateFromAccountNamePlaceholder: {
    id: 'StakePage DelegateFromAccountNamePlaceholder',
    defaultMessage: '请输入用于质押的账户名',
  },
  UnDelegateFromAccountNamePlaceholder: {
    id: 'StakePage UnDelegateFromAccountNamePlaceholder',
    defaultMessage: '请输入用于解质押的账户名',
  },
  DelegateReceiverAccountNamePlaceholder: {
    id: 'StakePage DelegateReceiverAccountNamePlaceholder',
    defaultMessage: '请输入接受质押的账户名，不填，则默认使用用于质押的账户名',
  },
  UnDelegateReceiverAccountNamePlaceholder: {
    id: 'StakePage UnDelegateReceiverAccountNamePlaceholder',
    defaultMessage:
      '请输入接受解质押的账户名，不填，则默认使用用于解质押的账户名',
  },
  DelegateReceiverAccountNameHelp: {
    id: 'StakePage DelegateReceiverAccountNameHelp',
    defaultMessage: '注：该账户名若与用于质押的账户名不一致，则为质押给别人',
  },
  UnDelegateReceiverAccountNameHelp: {
    id: 'StakePage UnDelegateReceiverAccountNameHelp',
    defaultMessage:
      '注：该账户名若与用于解质押的账户名不一致，则为解质押给别人',
  },
  DelegateStakeNetQuantityPlaceholder: {
    id: 'StakePage DelegateStakeNetQuantityPlaceholder',
    defaultMessage: '请输入质押的Net数量',
  },
  UnDelegateStakeNetQuantityPlaceholder: {
    id: 'StakePage UnDelegateStakeNetQuantityPlaceholder',
    defaultMessage: '请输入解质押的Net数量',
  },
  DelegateStakeCpuQuantityPlaceholder: {
    id: 'StakePage DelegateStakeCpuQuantityPlaceholder',
    defaultMessage: '请输入质押的Cpu数量',
  },
  UnDelegateStakeCpuQuantityPlaceholder: {
    id: 'StakePage UnDelegateStakeCpuQuantityPlaceholder',
    defaultMessage: '请输入解质押的Cpu数量',
  },
  FromLabel: {
    id: 'StakePage FromLabel',
    defaultMessage: '质押账户',
  },
  ReceiverLabel: {
    id: 'StakePage ReceiverLabel',
    defaultMessage: '接收账户',
  },
  NetQuantityLabel: {
    id: 'StakePage NetQuantityLabel',
    defaultMessage: 'Net数量',
  },
  CpuQuantityLabel: {
    id: 'StakePage CpuQuantityLabel',
    defaultMessage: 'Cpu数量',
  },
});
