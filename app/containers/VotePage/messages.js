/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  VotePageVoterPlaceholder: {
    id: 'VotePage VoterPlaceholder',
    defaultMessage: '请输入您投票的账户名',
  },
  VotePageProducersHelp: {
    id: 'VotePage ProducersHelp',
    defaultMessage: '注：请选择投票节点！可多选、可搜索、可输入，回车确认！',
  },
  VotePageProducersPlaceholder: {
    id: 'VotePage ProducersPlaceholder',
    defaultMessage: '请选择投票节点！可多选。可输入，回车确认！',
  },
  VoterLabel: {
    id: 'VotePage VoterLabel',
    defaultMessage: '账户名',
  },
  ProducersLabel: {
    id: 'VotePage ProducersLabel',
    defaultMessage: '节点',
  },
});
