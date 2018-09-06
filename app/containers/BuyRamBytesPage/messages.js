/*
 * BuyRamBytesPage Messages
 *
 * This contains all the text for the BuyRamBytesPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  SwitchCheckedName: {
    id: 'BuyRamBytesPage SwitchCheckedName',
    defaultMessage: '购买',
  },
  SwitchUnCheckedName: {
    id: 'BuyRamBytesPage SwitchUnCheckedName',
    defaultMessage: '出售',
  },
  PayerAccountNameLabel: {
    id: 'BuyRamBytesPage PayerAccountNameLabel',
    defaultMessage: '支付账号',
  },
  ReceiverAccountNameLabel: {
    id: 'BuyRamBytesPage ReceiverAccountNameLabel',
    defaultMessage: '接收账号',
  },
  BytesLabel: {
    id: 'BuyRamBytesPage BytesLabel',
    defaultMessage: '字节数',
  },
  BuyPayerAccountNamePlaceholder: {
    id: 'BuyRamBytesPage BuyPayerAccountNamePlaceholder',
    defaultMessage: '支付账号',
  },
  SellPayerAccountNamePlaceholder: {
    id: 'BuyRamBytesPage SellPayerAccountNamePlaceholder',
    defaultMessage: '卖出账号',
  },
  ReceiverAccountNamePlaceholder: {
    id: 'BuyRamBytesPage ReceiverAccountNamePlaceholder',
    defaultMessage: '请输入用于接受所购买内存的账户名！不填，则默认为支付账户',
  },
  BytesQuantityPlaceholder: {
    id: 'BuyRamBytesPage BytesQuantityPlaceholder',
    defaultMessage: '内存数量，单位为byte，1KB=1024bytes',
  },
  EosQuantityPlaceholder: {
    id: 'BuyRamBytesPage EosQuantityPlaceholder',
    defaultMessage: '内存数量，单位为EOS',
  },
});
