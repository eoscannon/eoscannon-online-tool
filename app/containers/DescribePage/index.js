/*
 * DescribePage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Card, Collapse } from 'antd';
import copy from 'copy-to-clipboard';

import {
  makeSelectNetwork,
  makeSelectLocale,
} from '../LanguageProvider/selectors';
import { getEosInfoDetail, openNotification } from '../../utils/utils';
import messages from './messages';
import teacherPic from './../../images/cannonTeach.jpg';
import teacherEnglishPic from './../../images/cannonTeachEnglish.jpg';

import { LayoutContentBox, FormComp } from '../../components/NodeComp';

const FormItem = Form.Item;
const Panel = Collapse.Panel;

export class DescribePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      QrCodeValue: '欢迎使用EosCannon在线工具', // 二维码内容,
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.SelectedNetWork &&
      nextProps.SelectedNetWork !== this.props.SelectedNetWork
    ) {
      this.handleGetTransaction(nextProps.SelectedNetWork);
    }
  }
  componentDidMount() {
    this.handleGetTransaction(this.props.SelectedNetWork);
  }
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = SelectedNetWork => {
    getEosInfoDetail(SelectedNetWork).then(BlockInfo => {
      this.props.form.setFieldsValue({
        transaction: JSON.stringify(BlockInfo),
      });
      this.setState({
        QrCodeValue: JSON.stringify(BlockInfo),
      });
    });
  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    copy(this.state.QrCodeValue);
    openNotification(this.state.formatMessage);
  };

  render() {
    const describePageZero = this.state.formatMessage(
      messages.describePageZero,
    );
    const describePageFirst = this.state.formatMessage(
      messages.describePageFirst,
    );
    const describePageSecond = this.state.formatMessage(
      messages.describePageSecond,
    );
    const describePageThird = this.state.formatMessage(
      messages.describePageThird,
    );
    const describePageFourth = this.state.formatMessage(
      messages.describePageFourth,
    );
    const describePagefivth = this.state.formatMessage(
      messages.describePagefivth,
    );
    const describePagefivthBold = this.state.formatMessage(
      messages.describePagefivthBold,
    );
    const describePagefivthBoldLast = this.state.formatMessage(
      messages.describePagefivthBoldLast,
    );
    const describePageSix = this.state.formatMessage(messages.describePageSix);
    const describePageSixLast = this.state.formatMessage(
      messages.describePageSixLast,
    );
    const describePageSenven = this.state.formatMessage(
      messages.describePageSenven,
    );
    const describePageSenvenBold = this.state.formatMessage(
      messages.describePageSenvenBold,
    );
    const describePageSenvenlast = this.state.formatMessage(
      messages.describePageSenvenlast,
    );
    const describePageEight = this.state.formatMessage(
      messages.describePageEight,
    );
    const describePageNinth = this.state.formatMessage(
      messages.describePageNinth,
    );
    const text = (
      <div>
        <p>{describePageFirst}</p>
        <p>{describePageSecond}</p>
        <p>{describePageThird}</p>
        <p>
          {describePageFourth}
          <br />
          1.{describePagefivth}
          <b style={{ color: '#000' }}>{describePagefivthBold}</b>
          {describePagefivthBoldLast}
          <br />
          2.<b style={{ color: '#000' }}>{describePageSix}</b>
          {describePageSixLast} <br />
          3.{describePageSenven}
          <b style={{ color: '#000' }}>{describePageSenvenBold}</b>
          {describePageSenvenlast} <br />
        </p>
        <div>
          {this.props.locale === 'en' ? (
            <img
              src={teacherEnglishPic}
              alt=""
              style={{ width: '100%' }}
            />
          ) : (
            <img src={teacherPic} alt="" style={{ width: '100%' }} />
          )}
        </div>
        <br />
        <br />
        <br />
        <p>
          <b style={{ color: '#000' }}>
            {describePageEight}
            <br />
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;{
            describePageNinth
          }
          </b>
        </p>
      </div>
    );
    const textTwo = (
      <div>
        <p>xxxxxxx</p>
        <p>xxxxxx</p>
        <p>xxxxxx</p>
      </div>
    );
    const textThird = (
      <div>
        <p>xxxxxx</p>
        <p>xxxxxx</p>
        <p>xxxxx</p>
      </div>
    );
    return (
      <LayoutContentBox>
        <FormComp>
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header={describePageZero} key="1">
              {text}
            </Panel>
            <Panel header="第二个介绍" key="2">
              {textTwo}
            </Panel>
            <Panel header="第三个介绍" key="3">
              {textThird}
            </Panel>
          </Collapse>
        </FormComp>
      </LayoutContentBox>
    );
  }
}

DescribePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
  locale: PropTypes.string,
};
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
  locale: makeSelectLocale(),
});

const DescribePageIntl = injectIntl(DescribePage);
const DescribePageForm = Form.create()(DescribePageIntl);
export default connect(mapStateToProps)(DescribePageForm);
