/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  CheckPrivateKeyMessage: {
    id: 'UpdateAuthPage CheckPrivateKeyMessage',
    defaultMessage: '校验私钥',
  },
  CheckPrivateKeyPlaceholder: {
    id: 'UpdateAuthPage CheckPrivateKeyPlaceholder',
    defaultMessage: '请输入需要校验的私钥',
  },
  GetPrivateKeyButtonMessage: {
    id: 'UpdateAuthPage GetPrivateKeyButtonMessage',
    defaultMessage: '生成公私钥',
  },
  ModifyPrivateKeyTitle: {
    id: 'UpdateAuthPage ModifyPrivateKeyTitle',
    defaultMessage: '修改私钥',
  },
  UpdateAuthAccountNamePlaceholder: {
    id: 'UpdateAuthPage UpdateAuthAccountNamePlaceholder',
    defaultMessage: '请输入私钥对应的账户名',
  },
  UpdateAuthActiveKeyPlaceholder: {
    id: 'UpdateAuthPage UpdateAuthActiveKeyPlaceholder',
    defaultMessage: '请输入您想要的公钥activeKey',
  },
  UpdateAuthOwnerKeyPlaceholder: {
    id: 'UpdateAuthPage UpdateAuthOwnerKeyPlaceholder',
    defaultMessage: '请输入您想要的公钥ownerKey',
  },
  PrivateKeyLabel: {
    id: 'UpdateAuthPage PrivateKeyLabel',
    defaultMessage: '私钥',
  },
  AccountLabel: {
    id: 'UpdateAuthPage AccountLabel',
    defaultMessage: '账户名',
  },
});
