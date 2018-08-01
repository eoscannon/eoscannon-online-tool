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
const { Footer } = Layout;

class FooterComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <FooterWrapper>{formatMessage(utilsMsg.FooterCompText)}
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
   .githubPic{
      width: 1.5rem;
       padding-bottom: .3rem;
  }
`;
