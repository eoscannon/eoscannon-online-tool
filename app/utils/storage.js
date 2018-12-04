// 设置本地存储方法对象；
const storage = {}
/**
 * 设置cookie
 * @param {[type]} key   [键名]
 * @param {[type]} value [键值]
 * @param {[type]} hours  [保存的时间（小时）] 默认保留24小时
 */
storage.set = (key, value, hours) => {
  const Hours = hours || 1
  const exp = new Date()
  const expires = exp.getTime() + Hours * 60 * 60 * 1000
  localStorage.setItem(key, JSON.stringify({ value, expires }))
}
/**
 * 获取cookie
 * @param {[type]} key   [键名]
 */
storage.get = key => {
  try {
    let val = null
    const o = JSON.parse(localStorage.getItem(key))
    if (o || o.expires > Date.now()) {
      val = o.value
    }
    return val
  } catch (e) {
    return localStorage.getItem(key)
  }
}
storage.setNetwork = name => {
  storage.set('Network', name)
}
storage.getNetwork = () => storage.get('Network')

storage.setChainId = name => {
  storage.set('ChainId', name)
}

storage.getForm = () => storage.get('Form')

storage.setForm = name => {
  storage.set('Form', name)
}
storage.getChainId = () => storage.get('ChainId')

storage.setTransferForm = TransferForm => {
  storage.set('TransferForm', TransferForm)
}
storage.getTransferForm = () => storage.get('TransferForm')

export { storage }
