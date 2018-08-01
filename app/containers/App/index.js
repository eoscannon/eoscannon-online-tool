/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

import InfoInitPage from 'containers/InfoInitPage/Loadable';
import SendMessagePage from 'containers/SendMessagePage/Loadable';
import ProxyPage from 'containers/ProxyPage/Loadable';
import VotePage from 'containers/VotePage/Loadable';
import AccountSearchPage from 'containers/AccountSearchPage/Loadable';
import RefundPage from 'containers/RefundPage/Loadable';
import BuyRamBytesPage from 'containers/BuyRamBytesPage/Loadable';
import UpdateAuthPage from 'containers/UpdateAuthPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import utilsMsg from '../../utils/messages';

class App extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Layout>
        <Helmet
          titleTemplate={`%s -${formatMessage(utilsMsg.AppHelmetTitle)}`}
          defaultTitle={formatMessage(utilsMsg.AppHelmetTitle)}
        >
          <meta
            name="description"
            content={formatMessage(utilsMsg.AppHelmetTitle)}
          />
        </Helmet>
        <Header />
        <Switch>
          <Route exact path="/" component={InfoInitPage} />
          <Route path="/infoInit" component={InfoInitPage} />
          <Route path="/sendMessage" component={SendMessagePage} />
          <Route path="/proxy" component={ProxyPage} />
          <Route path="/vote" component={VotePage} />
          <Route path="/accountSearch" component={AccountSearchPage} />
          <Route path="/refund" component={RefundPage} />
          <Route path="/buyrambytes" component={BuyRamBytesPage} />
          <Route path="/updateauth" component={UpdateAuthPage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
        <Footer />
      </Layout>
    );
  }
}
App.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(App);
