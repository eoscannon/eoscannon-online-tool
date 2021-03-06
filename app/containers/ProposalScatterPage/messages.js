/*
 * VotePage Messages
 *
 * This contains all the text for the VotePage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  VotePageVoterPlaceholder: {
    id: 'VotePage VoterPlaceholder',
    defaultMessage: '请输入您投票的账户名'
  },
  VotePageProducersHelp: {
    id: 'VotePage ProducersHelp',
    defaultMessage: '注：请选择投票节点！可多选、可搜索、可输入，回车确认！'
  },
  VotePageProducersPlaceholder: {
    id: 'VotePage ProducersPlaceholder',
    defaultMessage: '请选择投票节点！可多选。可输入，回车确认！'
  },
  VoterLabel: {
    id: 'VotePage VoterLabel',
    defaultMessage: '账户名'
  },
  ProducersLabel: {
    id: 'VotePage ProducersLabel',
    defaultMessage: '节点'
  },
  ProposalName: {
    id: 'ProposalPage ProposalName',
    defaultMessage: '提案名称'
  },
  ProxyScatterHelp: {
    id: 'ProxyPage ProxyScatterHelp',
    defaultMessage: '注：使用Scatter将使用已登录的账号签名'
  },
  Proposaler: {
    id: 'ProposalPage Proposaler',
    defaultMessage: '投票人'
  },
})
