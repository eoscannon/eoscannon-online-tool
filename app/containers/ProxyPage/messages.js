/*
 * ProxyPage Messages
 *
 * This contains all the text for the ProxyPage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  VoterPlaceholder: {
    id: 'ProxyPage VoterPlaceholder',
    defaultMessage: '请输入您投票的账户名'
  },
  ProxyHelp: {
    id: 'ProxyPage ProxyHelp',
    defaultMessage: '注：请输入代理投票的账户名！为空将取消代理！'
  },
  ProxyPlaceholder: {
    id: 'ProxyPage ProxyPlaceholder',
    defaultMessage: '请输入代理投票的账户名！ 为空将取消代理'
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
  }
})
