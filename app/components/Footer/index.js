/*
 * FooterComp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Layout } from 'antd';
import utilsMsg from '../../utils/messages';
import github from './github.svg';
const { Footer } = Layout;

class FooterComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <FooterWrapper>
        {formatMessage(utilsMsg.FooterCompText)}
        <a href="https://github.com/eoscannon" target="_blank">
          <img src={github} alt="" width="19" />
        </a>
      </FooterWrapper>
    );
  }
}
FooterComp.propTypes = {
  intl: PropTypes.object,
};
export default injectIntl(FooterComp);

const FooterWrapper = styled(Footer)`
  text-align: center;
  background: #fff !important;
  a {
    img {
      margin: 0 0 0.2rem 0.2rem;
    }
  }
`;
