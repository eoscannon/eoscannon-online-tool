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

import {
  makeSelectNetwork,
  makeSelectLocale
} from '../LanguageProvider/selectors'
import { getEosInfoDetail, openNotification } from '../../utils/utils'
import messages from './messages'

import FormCode from '../../components/FormCode' 

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
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.SelectedNetWork &&
      nextProps.SelectedNetWork !== this.props.SelectedNetWork
    ) {
      this.handleGetTransaction(nextProps.SelectedNetWork)
    }
  }
  handleStorage=()=>{
    storage.setForm(this.props.form)
  }

  componentDidMount () {  }
 
  render () {
    const describePageZero = this.state.formatMessage(
      messages.describePageZero,
    )
    
    return (
      <LayoutContentBox>
        <FormComp>
        <FormCode
          form={this.props.form}
          formatMessage={this.state.formatMessage}
        />
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
