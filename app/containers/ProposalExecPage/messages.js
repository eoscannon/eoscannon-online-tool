/*
 * ForumPage Messages
 *
 * This contains all the text for the ForumPage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  ExecuterAccountNamePlaceholder: {
    id: 'ProposalExecPage ExecuterAccountNamePlaceholder',
    defaultMessage: '执行账号'
  },
  ProposalFirstOne: {
    id: 'ProposalPage ProposalFirstOne',
    defaultMessage: '步骤1/3:填写提案表单'
  },
  ProposalPermission: {
    id: 'ProposalPage ProposalPermission',
    defaultMessage: '签名权限'
  },
  Proposaler: {
    id: 'ProposalPage Proposaler',
    defaultMessage: '执行人'
  },
  VoterLabel: {
    id: 'ProxyPage VoterLabel',
    defaultMessage: '投票账户'
  },
  ProxyLabel: {
    id: 'ProxyPage ProxyLabel',
    defaultMessage: '代理账户'
  },
  ProxyScatterHelp: {
    id: 'ProxyPage ProxyScatterHelp',
    defaultMessage: '注：使用Scatter将使用已登录的账号签名'
  },
  ProposalName: {
    id: 'ProposalPage ProposalName',
    defaultMessage: '提案名称'
  }
})
