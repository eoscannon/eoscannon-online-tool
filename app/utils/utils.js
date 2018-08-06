import EOS from 'eosjs';
import { notification } from 'antd';
import producers from './producers.json';
import utilsMsg from './messages';

const localChainId =
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

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

const getTransactionHeadersFromJsonInfo = jsonInfo => {
  const { refBlockNum, refBlockPrefix, expiration } = JSON.parse(jsonInfo);
  return {
    expiration,
    ref_block_num: refBlockNum,
    ref_block_prefix: refBlockPrefix,
  };
};

const getChainIdFromJsonInfoOrConfig = jsonInfo => {
  let { chainId } = JSON.parse(jsonInfo);
  chainId = chainId || localChainId;
  return chainId;
};

const getEosMain = () =>
  EOS({
    httpEndpoint: 'https://mainnet.eoscannon.io',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  });

const getEosTest = () =>
  EOS({
    httpEndpoint: 'https://tool.eoscannon.io/jungle',
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
  });

const getEos = type => (type === 'main' ? getEosMain() : getEosTest());

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
export {
  voteNodes,
  formItemLayout,
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getEos,
  getEosTest,
  getEosMain,
  getEosInfoDetail,
  openTransactionSuccessNotification,
  openTransactionFailNotification,
  openNotification,
};
