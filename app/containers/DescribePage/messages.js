/*
 * DescribePage Messages
 *
 * This contains all the text for the DescribePage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  describePageZero: {
    id: 'DescribePage describePageZero',
    defaultMessage: '佳能工具介绍'
  },
  describePageFirst: {
    id: 'DescribePage describePageFirst',
    defaultMessage:
      '佳能工具，私钥和签名都在离线手机上，也就是私钥完全不接触网络，是最安全的使用私钥的方式。我们可以把它当做冷钱包使用。建议小额账户用钱包管理，大额账户用佳能工具管理。'
  },
  describePageSecond: {
    id: 'DescribePage describePageSecond',
    defaultMessage: '佳能工具分为两部分：离线APP + 在线发送'
  },
  describePageThird: {
    id: 'DescribePage describePageThird',
    defaultMessage: '离线APP可从左边菜单栏点击下载。'
  },
  describePageFourth: {
    id: 'DescribePage describePageFourth',
    defaultMessage: '所有交易分为三个步骤：'
  },
  describePagefivth: {
    id: 'DescribePage describePagefivth',
    defaultMessage: '所有交易分为三个步骤：'
  },
  describePagefivthBold: {
    id: 'DescribePage describePagefivthBold',
    defaultMessage: '未签名：'
  },
  describePagefivthBoldLast: {
    id: 'DescribePage describePagefivthBoldLast',
    defaultMessage: '的交易：'
  },
  describePageSix: {
    id: 'DescribePage describePageSix',
    defaultMessage: '离线APP'
  },
  describePageSixLast: {
    id: 'DescribePage describePageSixLast',
    defaultMessage: '签名'
  },
  describePageSenven: {
    id: 'DescribePage describePageSenven',
    defaultMessage: '在线发送'
  },
  describePageSenvenBold: {
    id: 'DescribePage describePageSenvenBold',
    defaultMessage: '已签名'
  },
  describePageSenvenlast: {
    id: 'DescribePage describePageSenvenlast',
    defaultMessage: '已签名'
  },
  describePageEight: {
    id: 'DescribePage describePageEight',
    defaultMessage: '注意：绝大部分操作，使用active私钥签名即可'
  },
  describePageNinth: {
    id: 'DescribePage describePageNinth',
    defaultMessage: '修改权限的公私钥操作，请使用owner私钥签名。'
  },
  describePageOwnerFirst: {
    id: 'DescribePage describePageOwnerFirst',
    defaultMessage: '与ETH相比，EOS多了账号和权限的概念。'
  },
  describePageOwnerSecond: {
    id: 'DescribePage describePageOwnerSecond',
    defaultMessage: '为什么引入账号？为了方便易记，少出错，比如eostothemoon。EOS的账号类似于ETH地址，ETH地址为0x开头的42位长的字符串，而EOS账号仅为12位长度的字符。ETH所有的操作，都是针对地址，相应地，EOS所有的操作都是针对账号。'
  },
  describePageOwnerThird: {
    id: 'DescribePage describePageOwnerThird',
    defaultMessage: '为什么引入权限？为了安全。不同的权限，可以设定不同的操作，比如active权限不能修改别的权限，而owner权限可以。权限的表现形式是公私钥对，也就是说，一个权限，对应一个公钥和私钥。使用公私钥就是指使用对应的权限。EOS任何账号，都有2个默认的权限，owner和active。平时的操作，都用active权限，修改权限的私钥时，则用owner权限。'
  },
  describePageErrorFirst: {
    id: 'DescribePage describePageErrorFirst',
    defaultMessage: '权限不对，请检查私钥是否正确；除了改私钥，其它操作是否用的是active权限的私钥签名。'
  },
  describePageErrorSecond: {
    id: 'DescribePage describePageErrorSecond',
    defaultMessage: '部分字段输入错误，请检查。'
  },
  describePageErrorThird: {
    id: 'DescribePage describePageErrorThird',
    defaultMessage: 'CPU不足，请先抵押CPU。可以使用 https://tool.eoscannon.io/#/accountSearch 查询CPU是否足够。'
  },
  describePageOwnerZero: {
    id: 'DescribePage describePageOwnerZero',
    defaultMessage: '什么是OwnerKey和ActiveKey？'
  },
  describePageErrorZero: {
    id: 'DescribePage describePageErrorZero',
    defaultMessage: '常见500错误'
  }
})
