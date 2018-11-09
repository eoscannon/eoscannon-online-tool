/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  AppHelmetTitle: {
    id: 'Public AppHelmetTitle',
    defaultMessage: '佳能大户专属投票工具(在线版)'
  },
  HeaderMenuDelegate: {
    id: 'Public HeaderMenuDelegate',
    defaultMessage: '质押/解质押'
  },
  HeaderMenuTransfer: {
    id: 'Public HeaderMenuTransfer',
    defaultMessage: '转账'
  },
  HeaderMenuBuyRamBytes: {
    id: 'Public HeaderMenuBuyRamBytes',
    defaultMessage: '内存买卖'
  },
  HeaderMenuVote: {
    id: 'Public HeaderMenuVote',
    defaultMessage: '投票'
  },
  HeaderMenuIQ: {
    id: 'Public HeaderMenuIQ',
    defaultMessage: 'IQ'
  },
  HeaderMenuProxy: {
    id: 'Public HeaderMenuProxy',
    defaultMessage: '代理投票'
  },
  HeaderMenuUpdateAuth: {
    id: 'Public HeaderMenuUpdateAuth',
    defaultMessage: '私钥管理'
  },
  HeaderMenuRefund: {
    id: 'Public HeaderMenuRefund',
    defaultMessage: '手动Refund'
  },
  HeaderMenuAirgrab: {
    id: 'Public HeaderMenuAirgrab',
    defaultMessage: '空投'
  },
  HeaderMenuProposal: {
    id: 'Public HeaderMenuProposal',
    defaultMessage: '提案'
  },
  TransactionSuccessNotificationMsg: {
    id: 'Public TransactionSuccessNotificationMsg',
    defaultMessage: '生成签名报文成功'
  },
  TransactionSuccessNotificationDescription: {
    id: 'Public TransactionSuccessNotificationDescription',
    defaultMessage: '请点击下面的复制签名报文按钮或者扫描二维码获取签名报文'
  },
  TransactionFailNotificationMsg: {
    id: 'Public TransactionFailNotificationMsg',
    defaultMessage: '生成签名报文失败'
  },
  TransactionFailNotificationDescription: {
    id: 'Public TransactionFailNotificationDescription',
    defaultMessage: '请重新获取签名报文'
  },
  CopyTransactionSuccessNotificationMsg: {
    id: 'Public CopyTransactionSuccessNotificationMsg',
    defaultMessage: '已复制'
  },
  CopyMessage: {
    id: 'InfoInitPage infoAlertCopy',
    defaultMessage: '复制'
  },
  CopyTransactionSuccessNotificationDescription: {
    id: 'Public CopyTransactionSuccessNotificationDescription',
    defaultMessage: '已将签名报文复制到剪贴板，请前往https://tool.eoscannon.io/联网将报文播报发送'
  },
  JsonAlertMessage: {
    id: 'Public JsonAlertMessage',
    defaultMessage: '请输入相关交易报文'
  },
  JsonAlertDescription: {
    id: 'Public JsonAlertDescription',
    defaultMessage: '请前往离线版工具获取交易报文，打开工具，扫描二维码即可获得。'
  },
  FieldAlertMessage: {
    id: 'Public FieldAlertMessage',
    defaultMessage: '请输入为生成签名报文所需的字段'
  },
  FieldAlertDescription: {
    id: 'Public FieldAlertDescription',
    defaultMessage: '该页面为离线页面，输入的字段不会向外界泄露，请放心输入。'
  },
  CopyAlertMessage: {
    id: 'Public CopyAlertMessage',
    defaultMessage: '复制签名报文/扫描二维码'
  },
  CopyAlertDescription: {
    id: 'Public CopyAlertDescription',
    defaultMessage: '请将下面的签名报文复制后，前往https://tool.eoscannon.io/联网后进行播报发送。'
  },
  CopyOwnerAlertDescription: {
    id: 'Public CopyOwnerAlertDescription',
    defaultMessage: '打开离线工具APP，扫描以下二维码，并用Owner权限的私钥签名'
  },
  KeyProviderFormItemLabel: {
    id: 'Public KeyProviderFormItemLabel',
    defaultMessage: '请输入相关交易报文'
  },
  KeyProviderFormItemPlaceholder: {
    id: 'Public KeyProviderFormItemPlaceholder',
    defaultMessage:
      '请前往离线版工具获取交易报文，打开工具，扫描二维码即可获得。'
  },
  GetTransactionFormItemButtonName: {
    id: 'Public GetTransactionFormItemButtonName',
    defaultMessage: '生成签名报文'
  },
  OpenCameraButtonName: {
    id: 'Public OpenCameraButtonName',
    defaultMessage: '打开摄像头'
  },
  ScanQrcodeButtonName: {
    id: 'Public ScanQrcodeButtonName',
    defaultMessage: '扫描二维码'
  },
  JsonInfoPlaceholder: {
    id: 'Public JsonInfoPlaceholder',
    defaultMessage: '请输入联网获取的json字段'
  },
  TransactionTextAreaPlaceholder: {
    id: 'Public TransactionTextAreaPlaceholder',
    defaultMessage: '请复制生成的签名报文'
  },
  CopyTransactionButtonName: {
    id: 'Public CopyTransactionButtonName',
    defaultMessage: '复制签名报文'
  },
  QrCodeInitValue: {
    id: 'Public QrCodeInitValue',
    defaultMessage: ''
  },
  FooterCompText: {
    id: 'Public FooterCompText',
    defaultMessage: 'EOS佳能荣誉出品 ©2018'
  },

  HeaderMenuInfoInit: {
    id: 'Public HeaderMenuInfoInit',
    defaultMessage: '信息初始化'
  },
  HeaderMenuCreateAccount: {
    id: 'Public HeaderMenuCreateAccount',
    defaultMessage: '创建账号'
  },
  HeaderMenuSendMessage: {
    id: 'Public HeaderMenuSendMessage',
    defaultMessage: '发送报文'
  },
  HeaderMenuAccountSearch: {
    id: 'Public HeaderMenuAccountSearch',
    defaultMessage: '查询'
  },
  HeaderMenuOffical: {
    id: 'Public HeaderMenuOffical',
    defaultMessage: '正式网'
  },
  HeaderMenuTestNet: {
    id: 'Public HeaderMenuTestNet',
    defaultMessage: '测试网'
  },
  HeaderMenuOtherTestNet: {
    id: 'Public HeaderMenuOtherTestNet',
    defaultMessage: '其他测试网'
  },
  HeaderMenuStake: {
    id: 'Public HeaderMenuStake',
    defaultMessage: '质押'
  },
  ChangeTestNet: {
    id: 'Public ChangeTestNet',
    defaultMessage: '变更测试网'
  },
  HeaderMenuTradeManage: {
    id: 'Public HeaderMenuTradeManage',
    defaultMessage: '交易管理'
  },
  HeaderAppDownLoad: {
    id: 'Public HeaderAppDownLoad',
    defaultMessage: 'APP下载'
  },
  HeaderOnlineAppDownLoad: {
    id: 'Public HeaderOnlineAppDownLoad',
    defaultMessage: '在线APP下载'
  },
  HeaderOfflineAppDownLoad: {
    id: 'Public HeaderOfflineAppDownLoad',
    defaultMessage: '离线APP下载'
  },
  FieldAlertSendMessage: {
    id: 'Public FieldAlertSendMessage',
    defaultMessage: '发送报文'
  },
  FieldAlertSendMessageNew: {
    id: 'Public FieldAlertSendMessageNew',
    defaultMessage: '发送报文'
  },
  HeaderSendTrade: {
    id: 'Public FieldAlertSendMessage',
    defaultMessage: '发送交易'
  },
  SendSuccessMessage: {
    id: 'Public SendSuccessMessage',
    defaultMessage: '发送报文成功,请在页尾查看'
  },
  ScanCodeSendSuccess: {
    id: 'Public SendSuccess',
    defaultMessage: '发送成功'
  },
  ScanCodeSendSuccessMessage: {
    id: 'Public ScanCodeSendSuccessMessage',
    defaultMessage: '发送成功，已将相关操作广播，交易ID：'
  },
  ScanCodeSendFailed: {
    id: 'Public ScanCodeSendFailed',
    defaultMessage: '发送失败'
  },
  ScanCodeSendSure: {
    id: 'Public ScanCodeSendSure',
    defaultMessage: '确认'
  },
  ScanCodeSendCancel: {
    id: 'Public ScanCodeSendCancel',
    defaultMessage: '取消'
  },
  ProducersDealTranscation: {
    id: 'Public ProducersDealTranscation',
    defaultMessage: '生成交易'
  },
  ProducersSendTranscation: {
    id: 'Public ProducersSendTranscation',
    defaultMessage: '发送交易'
  },
  JsonAlertAttention: {
    id: 'Public JsonAlertAttention',
    defaultMessage: '注意'
  },
  JsonAlertAttentionArt: {
    id: 'Public JsonAlertAttentionArt',
    defaultMessage: '请输入正确的报文!'
  },
  HeaderMenuErrorMessage: {
    id: 'Header HeaderMenuErrorMessage',
    defaultMessage: '不是正确的网址'
  },
  HeaderMenuInputMessage: {
    id: 'Header HeaderMenuInputMessage',
    defaultMessage: '请输入'
  },
  HeaderInputTestNet: {
    id: 'Header HeaderInputTestNet',
    defaultMessage: '请输入测试网地址'
  },
  ScanCodeSendGetIt: {
    id: 'Header ScanCodeSendGetIt',
    defaultMessage: '知道了'
  },
  JsonAlertcloseCamera: {
    id: 'Header JsonAlertcloseCamera',
    defaultMessage: '关闭'
  },
  JsonAlertNoCamera: {
    id: 'Header JsonAlertNoCamera',
    defaultMessage: '已切换至无摄像头模式，将手动粘贴签名'
  },
  JsonAlertHaveCamera: {
    id: 'Header JsonAlertHaveCamera',
    defaultMessage: '已切换至摄像头扫描模式'
  },
  JsonAlerthaveCamera: {
    id: 'Header JsonAlerthaveCamera',
    defaultMessage: '有摄像头'
  },
  JsonAlertnoneCamera: {
    id: 'Header JsonAlertnoneCamera',
    defaultMessage: '无摄像头'
  },
  scatterSignature: {
    id: 'Header scatterSignature',
    defaultMessage: 'scatter签名'
  },
  ProducersChangeBP: {
    id: 'Header ProducersChangeBP',
    defaultMessage: '选择节点'
  },
  offlineSignature: {
    id: 'Header offlineSignature',
    defaultMessage: '离线签名'
  },
  ProxyHelpScatter: {
    id: 'Header ProxyHelpScatter',
    defaultMessage: '选择代理账户'
  },
  ProducersDealTranscationSelectBP: {
    id: 'Header ProducersDealTranscationSelectBP',
    defaultMessage: '步骤 1/3: 选择节点'
  },
  ProducersDealTranscationProxy: {
    id: 'Header ProducersDealTranscationProxy',
    defaultMessage: '步骤 1/3: 选择代理'
  }
})
