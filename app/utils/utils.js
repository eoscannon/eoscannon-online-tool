import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import EOS from 'eosjs'
import { notification } from 'antd'
import producers from './producers.json'
import utilsMsg from './messages'
import { storage } from './storage'
import config from './../config'

ScatterJS.plugins(new ScatterEOS())

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 19 }
  }
}

const voteNodes = []
producers.forEach(item => {
  voteNodes.push(item.owner)
})

const getEosMain = () =>
  EOS({
    httpEndpoint: config.mainHttpEndpoint,
    chainId: config.mainChainId,
    expireInSeconds: 60 * 60
  })

const getEosTest = () =>
  EOS({
    httpEndpoint: config.testHttpEndpoint,
    chainId: config.testChainId,
    expireInSeconds: 60 * 60
  })

const getEosOtherTest = () =>
  EOS({
    httpEndpoint: storage.getNetwork(),
    chainId: storage.getChainId(),
    expireInSeconds: 60 * 60
  })

const getEos = type => {
  switch (type) {
    case 'main':
      return getEosMain()
    case 'test':
      return getEosTest()
    case 'other':
      return getEosOtherTest()
    default:
      return getEosMain()
  }
}

const getEosByScatter = (type, callback) => {
  switch (type) {
    case 'main':
      return getEosMainScatter(callback)
    case 'test':
      return getEosTestScatter(callback)
    case 'other':
      return getEosOtherTestScatter(callback)
    default:
      return getEosMainScatter(callback)
  }
}

// 使用scatter进行签名
const getEosMainScatter = callback => {
  const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'mainnet.eoscannon.io',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  }
  ScatterJS.scatter
    .connect('EOSCannonTool')
    .then(connected => {
      if (!connected) {return}
      const { scatter } = ScatterJS
      scatter.forgetIdentity().then(() => {
        global.scatter = scatter
        window.scatter = null
        const requiredFields = { accounts: [network] }
        scatter
          .getIdentity(requiredFields)
          .then(() => {
            const account = scatter.identity.accounts.find(
              x => x.blockchain === 'eos',
            )
            global.AccountByScatter = account
            const eosOptions = { expireInSeconds: 60 * 5 }
            const eos = scatter.eos(network, EOS, eosOptions)
            global.EosByScatter = eos
            callback()
          })
          .catch(err => {
            console.log('err:', err)
          })
      })
    })
    .catch(err => {
      console.log('err==', err)
      // 从测试网切换过来如果测试数据为空，此处需要重新获取identity
      const { scatter } = ScatterJS
      const requiredFields = { accounts: [network] }
      scatter.getIdentity(requiredFields).then(() => {
        const account = scatter.identity.accounts.find(
          x => x.blockchain === 'eos',
        )
        global.AccountByScatter = account
        const eosOptions = { expireInSeconds: 60 * 5 }
        const eos = scatter.eos(network, EOS, eosOptions)
        global.EosByScatter = eos
        callback()
      })
    })
}

const getEosTestScatter = callback => {
  const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: config.testEndpoint,
    port: 443,
    chainId: config.testChainId
  }
  ScatterJS.scatter
    .connect('EOSCannonTool')
    .then(connected => {
      if (!connected) {return}
      const { scatter } = ScatterJS
      scatter
        .forgetIdentity()
        .then(() => {
          global.scatter = scatter
          window.scatter = null
          const requiredFields = { accounts: [network] }
          scatter.getIdentity(requiredFields).then(() => {
            const account = scatter.identity.accounts.find(
              x => x.blockchain === 'eos',
            )
            global.AccountByScatter = account
            const eosOptions = { expireInSeconds: 60 * 5 }
            const eos = scatter.eos(network, EOS, eosOptions)
            global.EosByScatter = eos
            callback()
          })
        })
        .catch(err => {
          console.log('err==', err)
        })
    })
    .catch(err => {
      console.log('err==', err)
      // 从测试网切换过来如果测试数据为空，此处需要重新获取identity
      const { scatter } = ScatterJS
      const requiredFields = { accounts: [network] }
      scatter.getIdentity(requiredFields).then(() => {
        const account = scatter.identity.accounts.find(
          x => x.blockchain === 'eos',
        )
        global.AccountByScatter = account
        const eosOptions = { expireInSeconds: 60 * 5 }
        const eos = scatter.eos(network, EOS, eosOptions)
        global.EosByScatter = eos
        callback()
      })
    })
}

const getEosOtherTestScatter = callback => {
  console.log(storage.getNetwork().slice(8))
  const network = {
    blockchain: 'eos',
    protocol: 'https',
    host: storage.getNetwork().slice(8),
    port: 443,
    chainId: storage.getChainId()
  }
  ScatterJS.scatter
    .connect('EOSCannonTool')
    .then(connected => {
      if (!connected) {return}
      const { scatter } = ScatterJS
      scatter
        .forgetIdentity()
        .then(() => {
          global.scatter = scatter
          window.scatter = null
          const requiredFields = { accounts: [network] }
          scatter.getIdentity(requiredFields).then(() => {
            const account = scatter.identity.accounts.find(
              x => x.blockchain === 'eos',
            )
            global.AccountByScatter = account
            const eosOptions = { expireInSeconds: 60 * 5 }
            const eos = scatter.eos(network, EOS, eosOptions)
            global.EosByScatter = eos
            callback()
          })
        })
        .catch(err => {
          console.log('err==', err)
        })
    })
    .catch(err => {
      console.log('err==', err)
      // 从测试网切换过来如果测试数据为空，此处需要重新获取identity
      const { scatter } = ScatterJS
      const requiredFields = { accounts: [network] }
      scatter.getIdentity(requiredFields).then(() => {
        const account = scatter.identity.accounts.find(
          x => x.blockchain === 'eos',
        )
        global.AccountByScatter = account
        const eosOptions = { expireInSeconds: 60 * 5 }
        const eos = scatter.eos(network, EOS, eosOptions)
        global.EosByScatter = eos
        callback()
      })
    })
}
// InfoInitPage 获取初始化信息
async function getEosInfoDetail (type) {
  const eos = getEos(type)
  const Info = await eos.getInfo({})
  const chainDate = new Date(`${Info.head_block_time}Z`)
  const expiration = new Date(chainDate.getTime() + 60 * 60 * 1000)
  const Block = await eos.getBlock(Info.last_irreversible_block_num)
  return {
    expiration: expiration.toISOString().split('.')[0],
    refBlockNum: Info.last_irreversible_block_num & 0xffff,
    refBlockPrefix: Block.ref_block_prefix,
    chainId: Info.chain_id
  }
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
    duration: 3
  })
}
/**
 * 提示用户签名失败
 * */
const openTransactionFailNotification = (formatMessage, what) => {
  notification.error({
    message: formatMessage(utilsMsg.TransactionFailNotificationMsg),
    description: `${what}，${formatMessage(
      utilsMsg.TransactionFailNotificationDescription,
    )}`,
    duration: 3
  })
}
/**
 * 提示用户已复制成功
 * */
const openNotification = formatMessage => {
  notification.success({
    message: formatMessage(utilsMsg.CopyTransactionSuccessNotificationMsg),
    description: formatMessage(
      utilsMsg.CopyTransactionSuccessNotificationDescription,
    ),
    duration: 3
  })
}
/**
 * 币种列表
 * */
const symbolList = [
  { symbol: 'EOS', contract: 'eosio.token', digit: 4 },
  { symbol: 'CAN', contract: 'eoscancancan', digit: 4 },
  { symbol: 'IQ', contract: 'everipediaiq', digit: 3 },
  { symbol: 'MEETONE', contract: 'eosiomeetone', digit: 4 },
  // { symbol: 'CETOS', contract: 'gyztomjugage', digit: 4 },
  { symbol: 'EOX', contract: 'eoxeoxeoxeox', digit: 4 },
  { symbol: 'EDNA', contract: 'ednazztokens', digit: 4 },
  { symbol: 'HORUS', contract: 'horustokenio', digit: 4 },
  { symbol: 'CHL', contract: 'challengedac', digit: 4 },
  { symbol: 'BLACK', contract: 'eosblackteam', digit: 4 },
  { symbol: 'ADD', contract: 'eosadddddddd', digit: 4 },
  { symbol: 'POOR', contract: 'poormantoken', digit: 4 },
  { symbol: 'CET', contract: 'eosiochaince', digit: 4 },
  { symbol: 'WIZZ', contract: 'wizznetwork1', digit: 4 },
  { symbol: 'RIDL', contract: 'ridlridlcoin', digit: 4 },
  { symbol: 'TRYBE', contract: 'trybenetwork', digit: 4 },
  { symbol: 'ATD', contract: 'eosatidiumio', digit: 4 },
  { symbol: 'PUB', contract: 'publytoken11', digit: 4 }
]

/**
 * 空投列表
 * */
const airgrabList = [
  {
    key: '1',
    symbol: 'ATD',
    account: 'eosatidiumio',
    method: 'signup',
    url: 'https://www.atidium.io'
  },
  {
    key: '2',
    symbol: 'POOR',
    account: 'poormantoken',
    method: 'signup',
    url: 'https://eostoolkit.io'
  },
  {
    key: '3',
    symbol: 'RIDL',
    account: 'ridlridlcoin',
    method: 'claim',
    url: 'https://ridl.get-scatter.com'
  },
  {
    key: '4',
    symbol: 'TRYBE',
    account: 'trybenetwork',
    method: 'claim',
    url: 'https://trybe.one'
  },
  {
    key: '5',
    symbol: 'WIZZ',
    account: 'wizznetwork1',
    method: 'signup',
    url: 'https://wizz.network'
  }
]

export {
  voteNodes,
  formItemLayout,
  getEos,
  getEosTest,
  getEosMain,
  getEosByScatter,
  getEosInfoDetail,
  openTransactionSuccessNotification,
  openTransactionFailNotification,
  openNotification,
  symbolList,
  airgrabList
}
