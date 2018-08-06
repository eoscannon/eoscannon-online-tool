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

const getEosInfo = values =>
  EOS({
    // httpEndpoint: 'https://mainnet.eoscannon.io',
    httpEndpoint: 'https://api.eoseco.com',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  });

const getEosInfoDetail = values => {
  let eos;
  if (values.netWork == 'main') {
    eos = getEosInfo();
  } else if (values.netWork == 'test') {
    eos = getEosTest();
  } else {
    return;
  }
  const expireInSeconds = 60 * 60; // 1 hour
  eos
    .getInfo({})
    .then(info => {
      const chainDate = new Date(`${info.head_block_time}Z`);
      const expiration = new Date(chainDate.getTime() + expireInSeconds * 1000);
      const expirationStr = expiration.toISOString().split('.')[0];
      const refBlockNum = info.last_irreversible_block_num & 0xffff;
      eos.getBlock(info.last_irreversible_block_num).then(block => {
        const refBlockPrefix = block.ref_block_prefix;
        const transactionHeaders = {
          expiration: expirationStr,
          refBlockNum,
          refBlockPrefix,
          chainId: info.chain_id,
        };
        return JSON.stringify(transactionHeaders);
      });
    })
    .catch(err => {
      openTransactionFailNotification(this.state.formatMessage, err.name);
    });
};

const getEos = values => {
  const { keyProvider, jsonInfo } = values;
  const transactionHeaders = getTransactionHeadersFromJsonInfo(jsonInfo);
  const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
  return EOS({
    httpEndpoint: null,
    chainId,
    // keyProvider:false,
    transactionHeaders,
  });
};

const getEosTest = values =>
  EOS({
    httpEndpoint: 'https://tool.eoscannon.io/jungle',
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
  });

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
  getEosInfo,
  getEosInfoDetail,
  openTransactionSuccessNotification,
  openTransactionFailNotification,
  openNotification,
};
