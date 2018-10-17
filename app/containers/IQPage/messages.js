/*
 * IqPage Messages
 *
 * This contains all the text for the IqPage component.
 */
import { defineMessages } from "react-intl";

export default defineMessages({
    IqAccountNamePlaceholder: {
        id: "IqPage IqAccountNamePlaceholder",
        defaultMessage: "IQ账号"
    },
    StakeRadioButtonName: {
        id: "IqPage StakeRadioButtonName",
        defaultMessage: "抵押IQ"
    },
    RefundRadioButtonName: {
        id: "IqPage RefundRadioButtonName",
        defaultMessage: "赎回IQ"
    },
    ArticleVoteRadioButtonName: {
        id: "IqPage ArticleVoteRadioButtonName",
        defaultMessage: "文章投票"
    },
    RewardRadioButtonName: {
        id: "IqPage RewardRadioButtonName",
        defaultMessage: "领取奖励"
    },
    StakeIqQuantityInputPlaceholder: {
        id: "IqPage StakeIqQuantityInputPlaceholder",
        defaultMessage: "请输入IQ质押数量"
    },
    StakeIqQuantityButtonName: {
        id: "IqPage StakeIqQuantityButtonName",
        defaultMessage: "查询可质押的IQ数量"
    },
    StakeIqSearchIqBalanceSuccess: {
        id: "IqPage StakeIqSearchIqBalanceSuccess",
        defaultMessage: "查询成功，可使用的IQ数量为：{IqBalanceFromStake}，仅供参考"
    },
    StakeIqSearchIqBalanceFail: {
        id: "IqPage StakeIqSearchIqBalanceFail",
        defaultMessage: "查询失败，请检查账户名是否正确。"
    },
    RefundIqButtonName: {
        id: "IqPage RefundIqButtonName",
        defaultMessage: "查询StakeId"
    },
    RefundIqInputPlaceholder: {
        id: "IqPage RefundIqInputPlaceholder",
        defaultMessage: "请输入StakeId"
    },
    RefundIqSearchStakeIdSuccess: {
        id: "IqPage RefundIqSearchStakeIdSuccess",
        defaultMessage: "查询成功，可赎回的StakeId: {StakeIdsForRefund}，仅供参考。"
    },
    RefundIqSearchStakeIdFail: {
        id: "IqPage RefundIqSearchStakeIdFail",
        defaultMessage: "查询失败，请检查账户名是否正确。"
    },
    VoteButtonName: {
        id: "IqPage VoteButtonName",
        defaultMessage: "查询BrainPower"
    },
    VoteSearchBrainPowerSuccess: {
        id: "IqPage VoteSearchBrainPowerSuccess",
        defaultMessage: "查询成功，可使用的BrainPower为: {BrainPowerForVote}，仅供参考。"
    },
    VoteSearchBrainPowerFail: {
        id: "IqPage VoteSearchBrainPowerFail",
        defaultMessage: "查询失败，请检查账户名是否正确。"
    },
    VoteProposalHashInputPlaceholder: {
        id: "IqPage VoteProposalHashInputPlaceholder",
        defaultMessage: "请输入文章Hash值"
    },
    VoteBrainpowerAmountInputPlaceholder: {
        id: "IqPage VoteBrainpowerAmountInputPlaceholder",
        defaultMessage: "请输入投票Brainpower数量"
    },
    VoteSwitchCheckedName: {
        id: "IqPage VoteSwitchCheckedName",
        defaultMessage: "赞成"
    },
    VoteSwitchUnCheckedName: {
        id: "IqPage VoteSwitchUnCheckedName",
        defaultMessage: "反对"
    }
});
