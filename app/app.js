/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import FontFaceObserver from 'fontfaceobserver'
import createHashHistory from 'history/createHashHistory'
import 'sanitize.css/sanitize.css'
import LanguageProvider from 'containers/LanguageProvider'

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico'

// Import root app
import AirgrabPage from 'containers/AirgrabPage/Loadable'
import InfoInitPage from 'containers/InfoInitPage/Loadable'
import SendMessagePage from 'containers/SendMessagePage/Loadable'
import ProxyPage from 'containers/ProxyPage/Loadable'
import VotePage from 'containers/VotePage/Loadable'
import AccountSearchPage from 'containers/AccountSearchPage/Loadable'
import RefundPage from 'containers/RefundPage/Loadable'
import BuyRamBytesPage from 'containers/BuyRamBytesPage/Loadable'
import UpdateAuthPage from 'containers/UpdateAuthPage/Loadable'
import StakePage from 'containers/StakePage/Loadable'
import TransferPage from 'containers/TransferPage/Loadable'
import CreateAccountPage from 'containers/CreateAccountPage/Loadable'
import DescribePage from 'containers/DescribePage/Loadable'
import IQPage from 'containers/IQPage/Loadable'
import Header from 'components/Header'

import configureStore from './configureStore'

// Import i18n messages
import { translationMessages } from './i18n'

// Import CSS reset and Global Styles
import './global-styles'

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {})

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded')
})

// Create redux store with history
const initialState = {}
const history = createHashHistory()
const store = configureStore(initialState, history)
const MOUNT_NODE = document.getElementById('app')

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Router history={history}>
          <Switch>
            <Header>
              <Route exact path="/" component={DescribePage} />
              <Route path="/infoInit" component={InfoInitPage} />
              <Route path="/sendMessage" component={SendMessagePage} />
              <Route path="/transfer" component={TransferPage} />
              <Route path="/proxy" component={ProxyPage} />
              <Route path="/vote" component={VotePage} />
              <Route
                path="/accountSearch"
                exact
                component={AccountSearchPage}
              />
              <Route
                path="/accountSearch/:account"
                component={AccountSearchPage}
              />
              <Route path="/refund" component={RefundPage} />
              <Route path="/stake" component={StakePage} />
              <Route path="/buyrambytes" component={BuyRamBytesPage} />
              <Route path="/createAccount" component={CreateAccountPage} />
              <Route path="/updateauth" component={UpdateAuthPage} />
              <Route path="/dscribe" component={DescribePage} />
              <Route path="/airgrab" component={AirgrabPage} />
              <Route path="/iq" component={IQPage} />
            </Header>
          </Switch>
        </Router>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE,
  )
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE)
    render(translationMessages)
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'))
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/zh.js')
      ]),
    )
    .then(() => render(translationMessages))
    .catch(err => {
      throw err
    })
} else {
  render(translationMessages)
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
// }
