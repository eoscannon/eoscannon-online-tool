import EOS from 'eosjs';
import { notification } from 'antd';
import producers from './producers.json';
import utilsMsg from './messages';
import {storage} from './storage';
import config from "./../config";

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 19 },
  },
};

const voteNodes = [];
producers.forEach(item => {
  voteNodes.push(item.owner);
});

const getEosMain = () =>
  EOS({
    httpEndpoint: config.mainHttpEndpoint,
    chainId: config.mainChainId,
    expireInSeconds: 60 * 60,
  });

const getEosTest = () =>
  EOS({
    httpEndpoint: config.testHttpEndpoint,
    chainId: config.testChainId,
    expireInSeconds: 60 * 60,
  });

const getEosOtherTest = () =>
  EOS({
    httpEndpoint: storage.getNetwork(),
    expireInSeconds: 60 * 60,
  });

const getEos = type => {
  //console.log('type====', type)
  switch (type) {
    case 'main':
      return getEosMain()
      break;
    case 'test':
      return getEosTest()
      break;
    case 'other':
      return getEosOtherTest()
      break;
    default:
      return getEosMain();
  }
};

// InfoInitPage 获取初始化信息
async function getEosInfoDetail(type) {
  const eos = getEos(type);
  const Info = await eos.getInfo({});
  const chainDate = new Date(`${Info.head_block_time}Z`);
  const expiration = new Date(chainDate.getTime() + 60 * 60 * 1000);
  const Block = await eos.getBlock(Info.last_irreversible_block_num);
  return {
    expiration: expiration.toISOString().split('.')[0],
    refBlockNum: Info.last_irreversible_block_num & 0xffff,
    refBlockPrefix: Block.ref_block_prefix,
    chainId: Info.chain_id,
  };
}

/**
 * 提示用户签名成功
 * */
const openTransactionSuccessNotification = formatMessage => {
  notification.success({
    message: formatMessage(utilsMsg.TransactionSuccessNotificationMsg),
    description: formatMessage(
      utilsMsg.TransactionSuccessNotificationDescription,
    ),
    duration: 3,
  });
};
/**
 * 提示用户签名失败
 * */
const openTransactionFailNotification = (formatMessage, what) => {
  notification.error({
    message: formatMessage(utilsMsg.TransactionFailNotificationMsg),
    description: `${what}，${formatMessage(
      utilsMsg.TransactionFailNotificationDescription,
    )}`,
    duration: 3,
  });
};
/**
 * 提示用户已复制成功
 * */
const openNotification = formatMessage => {
  notification.success({
    message: formatMessage(utilsMsg.CopyTransactionSuccessNotificationMsg),
    description: formatMessage(
      utilsMsg.CopyTransactionSuccessNotificationDescription,
    ),
    duration: 3,
  });
};
/**
 * 币种列表
 * */
const symbolList = [
  { symbol: 'EOS', contract: 'eosio', digit: 4 },
  { symbol: 'CAN', contract: 'eoscancancan', digit: 4 },
  { symbol: 'IQ', contract: 'everipediaiq', digit: 3 },
  { symbol: 'MEETONE', contract: 'eosiomeetone', digit: 4 },
  { symbol: 'CETOS', contract: 'gyztomjugage', digit: 4 },
  { symbol: 'EOX', contract: 'eoxeoxeoxeox', digit: 4 },
  { symbol: 'EDNA', contract: 'ednazztokens', digit: 4 },
  { symbol: 'HORUS', contract: 'horustokenio', digit: 4 },
  { symbol: 'CHL', contract: 'challengedac', digit: 4 },
  { symbol: 'BLACK', contract: 'eosblackteam', digit: 4 },
  { symbol: 'ADD', contract: 'eosadddddddd', digit: 4 },
  { symbol: 'CET', contract: 'eosiochaince', digit: 4 },
  { symbol: 'WIZZ', contract: 'wizznetwork1', digit: 4 },
];

export {
  voteNodes,
  formItemLayout,
  getEos,
  getEosTest,
  getEosMain,
  getEosInfoDetail,
  openTransactionSuccessNotification,
  openTransactionFailNotification,
  openNotification,
  symbolList
};
