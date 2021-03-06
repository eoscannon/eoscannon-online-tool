/*
 * DescribePage
 *
 */

import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Form, Collapse } from 'antd'
import copy from 'copy-to-clipboard'

import {
  makeSelectNetwork,
  makeSelectLocale
} from '../LanguageProvider/selectors'
import { getEosInfoDetail, openNotification } from '../../utils/utils'
import messages from './messages'
import teacherPic from './../../images/cannonTeach.jpg'
import teacherEnglishPic from './../../images/cannonTeachEnglish.jpg'
import assertMessagePic from './img/assert_message.jpg'
import authorizationPic from './img/authorization.jpg'
import cpuLimitsPic from './img/cpu_limits.jpg'

import { LayoutContentBox, FormComp } from '../../components/NodeComp'

// const FormItem = Form.Item;
const { Panel } = Collapse

export class DescribePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formatMessage: this.props.intl.formatMessage,
      QrCodeValue: '欢迎使用EosCannon在线工具' // 二维码内容,
    }
  }
 

  render () {
    const describePageZero = this.state.formatMessage(
      messages.describePageZero,
    )
    const describePageFirst = this.state.formatMessage(
      messages.describePageFirst,
    )
    const describePageSecond = this.state.formatMessage(
      messages.describePageSecond,
    )
    const describePageThird = this.state.formatMessage(
      messages.describePageThird,
    )
    const describePageFourth = this.state.formatMessage(
      messages.describePageFourth,
    )
    const describePagefivth = this.state.formatMessage(
      messages.describePagefivth,
    )
    const describePagefivthBold = this.state.formatMessage(
      messages.describePagefivthBold,
    )
    const describePagefivthBoldLast = this.state.formatMessage(
      messages.describePagefivthBoldLast,
    )
    const describePageSix = this.state.formatMessage(messages.describePageSix)
    const describePageSixLast = this.state.formatMessage(
      messages.describePageSixLast,
    )
    const describePageSenven = this.state.formatMessage(
      messages.describePageSenven,
    )
    const describePageSenvenBold = this.state.formatMessage(
      messages.describePageSenvenBold,
    )
    const describePageSenvenlast = this.state.formatMessage(
      messages.describePageSenvenlast,
    )
    const describePageEight = this.state.formatMessage(
      messages.describePageEight,
    )
    const describePageNinth = this.state.formatMessage(
      messages.describePageNinth,
    )
    const describePageErrorFirst = this.state.formatMessage(
      messages.describePageErrorFirst,
    )
    const describePageErrorZero = this.state.formatMessage(
      messages.describePageErrorZero,
    )
    const describePageErrorSecond = this.state.formatMessage(
      messages.describePageErrorSecond,
    )
    const describePageErrorThird = this.state.formatMessage(
      messages.describePageErrorThird,
    )

    const describePageOwnerZero = this.state.formatMessage(
      messages.describePageOwnerZero,
    )
    const describePageOwnerFirst = this.state.formatMessage(
      messages.describePageOwnerFirst,
    )
    const describePageOwnerSecond = this.state.formatMessage(
      messages.describePageOwnerSecond,
    )
    const describePageOwnerThird = this.state.formatMessage(
      messages.describePageOwnerThird,
    )
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
            <img src={teacherEnglishPic} alt="" style={{ width: '100%' }} />
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
    )
    const textTwo = (
      <div>
        <p>{describePageOwnerFirst}</p>
        <p>{describePageOwnerSecond}</p>
        <p>{describePageOwnerThird}</p>
      </div>
    )
    const textThird = (
      <div>
        <div>
          <span>
            1.<span>{describePageErrorFirst}</span>
          </span>
          <p>
            <img src={authorizationPic} alt="" style={{ width: '580px' }} />
          </p>
        </div>
        <div>
          <span>
            2.<span>{describePageErrorSecond}</span>
          </span>
          <p>
            <img src={assertMessagePic} alt="" style={{ width: '580px' }} />
          </p>
        </div>
        <div>
          <span>
            3.<span>{describePageErrorThird}</span>
          </span>
          <p>
            <img src={cpuLimitsPic} alt="" style={{ width: '580px' }} />
          </p>
        </div>
      </div>
    )
    return (
      <LayoutContentBox>
        <FormComp>
          <Collapse bordered={false}>
            <Panel header={describePageZero} key="1">
              {text}
            </Panel>
            <Panel header={describePageOwnerZero} key="2">
              {textTwo}
            </Panel>
            <Panel header={describePageErrorZero} key="3">
              {textThird}
            </Panel>
          </Collapse>
        </FormComp>
      </LayoutContentBox>
    )
  }
}

DescribePage.propTypes = {
  form: PropTypes.object,
  intl: PropTypes.object,
  SelectedNetWork: PropTypes.string,
  locale: PropTypes.string
}
const mapStateToProps = createStructuredSelector({
  SelectedNetWork: makeSelectNetwork(),
  locale: makeSelectLocale()
})

const DescribePageIntl = injectIntl(DescribePage)
const DescribePageForm = Form.create()(DescribePageIntl)
export default connect(mapStateToProps)(DescribePageForm)
