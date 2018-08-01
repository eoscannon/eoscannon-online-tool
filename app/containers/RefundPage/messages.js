/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  RefundAlertMessage: {
    id: 'RefundPage RefundAlertMessage',
    defaultMessage: '手动Refund',
  },
  RefundAlertDescription: {
    id: 'RefundPage RefundAlertDescription',
    defaultMessage: '在解质押3天后，资产未到账时，可手动Refund取回资产。',
  },
  OwnerPlaceholder: {
    id: 'RefundPage OwnerPlaceholder',
    defaultMessage: '请输入私钥对应的账户名',
  },
  OwnerLabel: {
    id: 'RefundPage OwnerLabel',
    defaultMessage: '账户名',
  },
});
