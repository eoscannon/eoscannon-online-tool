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

const getEosTelosTest = () =>
  EOS({
    httpEndpoint: config.testTelosHttpEndpoint,
    chainId: config.testTelosChainId,
    expireInSeconds: 60 * 60
  })
const getEosBOSTest = () =>
  EOS({
    httpEndpoint: config.testBosHttpEndpoint,
    chainId: config.testBosChainId,
    expireInSeconds: 60 * 60
  })

const getEosKylinTest = () =>
  EOS({
    httpEndpoint: config.testKylinHttpEndpoint,
    chainId: config.testKylinChainId,
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
    case 'telos':
      return getEosTelosTest()
    case 'bos':
      return getEosBOSTest()
    case 'kylin':
      return getEosKylinTest()
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
  { symbol: 'MEETONE', contract: 'eosiomeetone', digit: 4 },
  { symbol: 'IQ', contract: 'everipediaiq', digit: 3 },

  { symbol: 'EBTC', contract: 'bitpietokens', digit: 4 },
  { symbol: 'EETH', contract: 'bitpietokens', digit: 4 },

  { symbol: 'ADD', contract: 'eosadddddddd', digit: 4 },
  { symbol: 'ADE', contract: 'buildertoken', digit: 4 },
  { symbol: 'ARN', contract: 'aeronaerozzz', digit: 4 },
  { symbol: 'ATD', contract: 'eosatidiumio', digit: 4 },

  { symbol: 'BEAN', contract: 'thebeantoken', digit: 4 },
  { symbol: 'BEST', contract: 'eosgamecoin2', digit: 4 },
  { symbol: 'BETX', contract: 'thebetxtoken', digit: 4 },
  { symbol: 'BG', contract: 'bgbgbgbgbgbg', digit: 4 },
  { symbol: 'BINGO', contract: 'bingobetoken', digit: 4 },
  { symbol: 'BLACK', contract: 'eosblackteam', digit: 4 },
  { symbol: 'BOCAI', contract: 'eosbocai2222', digit: 4 },
  { symbol: 'BOID', contract: 'boidcomtoken', digit: 4 },
  { symbol: 'BTN', contract: 'eosbuttonbtn', digit: 4 },

  { symbol: 'CANDY', contract: 'eoscandymain', digit: 4 },
  { symbol: 'CAT', contract: 'tokenbyeocat', digit: 4 },
  { symbol: 'CET', contract: 'eosiochaince', digit: 4 },
  { symbol: 'CHIP', contract: 'eostgctoken1', digit: 4 },
  { symbol: 'CHL', contract: 'challengedac', digit: 4 },
  { symbol: 'CITY', contract: 'funcitytoken', digit: 4 },
  { symbol: 'CTN', contract: 'funcitytoken', digit: 4 },
  { symbol: 'CUBE', contract: 'eoscubetoken', digit: 4 },

  { symbol: 'DAB', contract: 'eoscafekorea', digit: 4 },
  { symbol: 'DBET', contract: 'dbetminepool', digit: 4 },
  { symbol: 'DEOS', contract: 'thedeosgames', digit: 4 },
  { symbol: 'DET', contract: 'dacincubator', digit: 4 },
  { symbol: 'DIA', contract: 'diatokencore', digit: 4 },
  { symbol: 'DICE', contract: 'betdicetoken', digit: 4 },
  { symbol: 'DK', contract: 'dicekingcoin', digit: 4 },

  { symbol: 'EATCOIN', contract: 'eatscience14', digit: 4 },
  { symbol: 'ECASH', contract: 'horustokenio', digit: 4 },
  { symbol: 'ECTT', contract: 'ectchaincoin', digit: 4 },
  { symbol: 'EDNA', contract: 'ednazztokens', digit: 4 },
  { symbol: 'EETH', contract: 'ethsidechain', digit: 4 },
  { symbol: 'EGT', contract: 'eosiotokener', digit: 4 },
  { symbol: 'ENB', contract: 'eosenbpocket', digit: 4 },
  { symbol: 'EOSDAC', contract: 'eosdactokens', digit: 4 },
  { symbol: 'EOSISH', contract: 'buildertoken', digit: 4 },
  { symbol: 'EOSNTS', contract: 'eosninetiess', digit: 4 },
  { symbol: 'EOSYX', contract: 'eosyxtoken11', digit: 4 },
  { symbol: 'EOSWIN', contract: 'etwineos1111', digit: 4 },
  { symbol: 'EOX', contract: 'eoxeoxeoxeox', digit: 4 },
  { symbol: 'EPT', contract: 'alibabapoole', digit: 4 },
  { symbol: 'EPRA', contract: 'epraofficial', digit: 4 },
  { symbol: 'ET', contract: 'endlesstoken', digit: 4 },
  { symbol: 'ESA', contract: 'shadowbanker', digit: 4 },
  { symbol: 'ESB', contract: 'esbcointoken', digit: 4 },
  { symbol: 'EVR', contract: 'eosvrtokenss', digit: 4 },

  { symbol: 'FAID', contract: 'eosfaidchain', digit: 4 },
  { symbol: 'FAIR', contract: 'faireostoken', digit: 4 },
  { symbol: 'FAST', contract: 'fastwinadmin', digit: 4 },
  { symbol: 'FC', contract: 'fcfundadmins', digit: 4 },
  { symbol: 'FISH', contract: 'fishingtoken', digit: 4 },
  { symbol: 'FISH', contract: 'fishjoytoken', digit: 4 },
  { symbol: 'FOS', contract: 'farmeosbankx', digit: 4 },
  { symbol: 'FUN', contract: 'eosfuntoken1', digit: 4 },

  { symbol: 'GMC', contract: 'lihengyang13', digit: 4 },
  { symbol: 'GT', contract: 'eosgetgtoken', digit: 4 },
  { symbol: 'GYM', contract: 'gymrewardsio', digit: 4 },

  { symbol: 'HORUS', contract: 'horustokenio', digit: 4 },
  { symbol: 'HVT', contract: 'hirevibeshvt', digit: 4 },

  { symbol: 'IGC', contract: 'eosindiegame', digit: 4 },
  { symbol: 'INF', contract: 'infinicoinio', digit: 4 },
  { symbol: 'ITECOIN', contract: 'itecointoken', digit: 4 },

  { symbol: 'JKR', contract: 'eosjackscoin', digit: 4 },
  { symbol: 'JUST', contract: 'eosjusttoken', digit: 4 },

  { symbol: 'KARMA', contract: 'therealkarma', digit: 4 },
  { symbol: 'KEEP', contract: 'eoskeep.x', digit: 4 },
  { symbol: 'KEO', contract: 'keoskorea111', digit: 4 },
  { symbol: 'KKK', contract: 'fairkuai3kkk', digit: 4 },

  { symbol: 'LITE', contract: 'buildertoken', digit: 4 },
  { symbol: 'LKT', contract: 'chyyshayysha', digit: 4 },
  { symbol: 'LLG', contract: 'llgonebtotal', digit: 4 },
  { symbol: 'LNT', contract: 'lucknumtokengit ', digit: 4 },
  { symbol: 'LOTT', contract: 'forlot111222', digit: 4 },
  { symbol: 'LOVE', contract: 'lovewintoken', digit: 4 },
  { symbol: 'LT', contract: 'luckbettoken', digit: 4 },
  { symbol: 'LUCK', contract: 'eosluckchain', digit: 4 },
  { symbol: 'LUCKY', contract: 'eoslucktoken', digit: 4 },
  { symbol: 'LZB', contract: 'gqydooigenes', digit: 4 },

  { symbol: 'MAX', contract: 'eosmax1token', digit: 4 },
  { symbol: 'MEV', contract: 'eosvegasjack', digit: 4 },
  { symbol: 'MUGL', contract: 'mugglesspell', digit: 4 },
  { symbol: 'MORE', contract: 'eosiomoreone', digit: 4 },

  { symbol: 'NUTS', contract: 'nutscontract', digit: 4 },

  { symbol: 'OBT', contract: 'obtain.e', digit: 4 },
  { symbol: 'OCT', contract: 'octtothemoon', digit: 4 },
  { symbol: 'ONE', contract: 'onedicewarm2', digit: 4 },

  { symbol: 'P', contract: 'ppppp.e', digit: 4 },
  { symbol: 'PGL', contract: 'prospectorsg', digit: 4 },
  { symbol: 'PKE', contract: 'pokereotoken', digit: 4 },
  { symbol: 'POKER', contract: 'eospokercoin', digit: 4 },
  { symbol: 'POOR', contract: 'poormantoken', digit: 4 },
  { symbol: 'PSI', contract: 'psidicetoken', digit: 4 },
  { symbol: 'PSO', contract: 'cryptopesosc', digit: 4 },
  { symbol: 'PTI', contract: 'ptitokenhome', digit: 4 },
  { symbol: 'PUB', contract: 'publytoken11', digit: 4 },
  { symbol: 'PXS', contract: 'pxstokensapp', digit: 4 },

  { symbol: 'RAN', contract: 'eosrandtoken', digit: 4 },
  { symbol: 'RIDL', contract: 'ridlridlcoin', digit: 4 },
  { symbol: 'ROLL', contract: 'luckymeissue', digit: 4 },
  { symbol: 'ROY', contract: 'eosroyaleroy', digit: 4 },

  { symbol: 'SEED', contract: 'parslseed123', digit: 4 },
  { symbol: 'SEVEN', contract: 'xxxsevensxxx', digit: 4 },
  { symbol: 'SHAPE', contract: 'gmaslaunches', digit: 4 },
  { symbol: 'SHARE', contract: 'share.x', digit: 4 },
  { symbol: 'SLIEMT', contract: 'fastwinitemf', digit: 4 },
  { symbol: 'SST', contract: 'skillshareio', digit: 4 },
  { symbol: 'STAR', contract: 'fastwinitems', digit: 4 },
  { symbol: 'SVN', contract: 'eoseventoken', digit: 4 },

  { symbol: 'TASTE', contract: 'taste.x', digit: 4 },
  { symbol: 'TBT', contract: 'trustbetteam', digit: 4 },
  { symbol: 'TEA', contract: 'linzongsheng', digit: 4 },
  { symbol: 'TGC', contract: 'eostgctoken1', digit: 4 },
  { symbol: 'TKC', contract: 'tkcointkcoin', digit: 4 },
  { symbol: 'TOB', contract: 'tobetiotoken', digit: 4 },
  { symbol: 'TOE', contract: 'talkoneos123', digit: 4 },
  { symbol: 'TOOK', contract: 'taketooktook', digit: 4 },
  { symbol: 'TOP', contract: 'topdapptoken', digit: 4 },
  { symbol: 'TPT', contract: 'tokendapppub', digit: 4 },
  { symbol: 'TRYBE', contract: 'trybenetwork', digit: 4 },
  { symbol: 'TXT', contract: 'trusteamwins', digit: 4 },

  { symbol: 'UCTT', contract: 'uctokenowner', digit: 4 },

  { symbol: 'WECASH', contract: 'weosservices', digit: 4 },
  { symbol: 'WIN', contract: 'windividends', digit: 4 },
  { symbol: 'WINS', contract: 'eoswinonewww', digit: 4 },
  { symbol: 'WIZBOX', contract: 'wizboxairdro', digit: 4 },
  { symbol: 'WIZZ', contract: 'wizznetwork1', digit: 4 },

  { symbol: 'YDAPP', contract: 'dacincubator', digit: 4 },
  { symbol: 'YOU', contract: 'youbaoyoubao', digit: 4 },
  { symbol: 'YT', contract: 'okkkkkkkkkkk', digit: 4 },
  { symbol: 'YUM', contract: 'yumgamescoin', digit: 4 },

  { symbol: 'ZKS', contract: 'zkstokensr4u', digit: 0 }

]

const symbolListWorbli = [
  { symbol: 'WBI', contract: 'eosio.token', digit: 4 }
]
/**
 * 空投列表
 * */
const airgrabList = [
  {
    key: '12',
    symbol: 'SLAM',
    account: 'slamdevelops',
    method: 'signup',
    url: 'https://slamgames.io'
  },
  {
    key: '11',
    symbol: 'BRM',
    account: 'openbrmeos11',
    method: 'open',
    url: 'https://openbrm.io'
  },
  {
    key: '10',
    symbol: 'NEB',
    account: 'nebulatokenn',
    method: 'open',
    url: 'https://nebulaprotocol.com'
  },
  {
    key: '8',
    symbol: 'HVT',
    account: 'hirevibeshvt',
    method: 'claim',
    url: 'https://www.hirevibes.io/'
  },
  {
    key: '7',
    symbol: 'ZKS',
    account: 'zkstokensr4u',
    method: 'claim',
    url: 'https://zks.one'
  },
  {
    key: '9',
    symbol: 'INF',
    account: 'infinicoinio',
    method: 'open',
    url: 'https://www.infiniverse.net/'
  },
  {
    key: '6',
    symbol: 'DEOS',
    account: 'thedeosgames',
    method: 'claim',
    url: 'http://deosgames.com'
  },
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
  /**  {
    key: '3',
    symbol: 'RIDL',
    account: 'ridlridlcoin',
    method: 'claim',
    url: 'https://ridl.get-scatter.com'
  },
**/
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
  airgrabList,
  symbolListWorbli
}

