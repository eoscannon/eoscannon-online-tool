/*
 * GetQrcode
 *
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Alert } from 'antd'
import QRCode from 'qrcode.react'
import utilsMsg from '../../utils/messages'

const FormItem = Form.Item
const { TextArea } = Input

export default class GetQrcode extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const keyProviderLabel = this.props.formatMessage(
      utilsMsg.KeyProviderFormItemLabel,
    )
    const keyProviderPlaceholder = this.props.formatMessage(
      utilsMsg.KeyProviderFormItemPlaceholder,
    )
    const CopyMessage = this.props.formatMessage(utilsMsg.CopyMessage)
    return (
      <div>
        <FormItem>
          <Alert
            message={keyProviderLabel}
            description={keyProviderPlaceholder}
            type="info"
          />
        </FormItem>
        <FormItem>
          <div style={{ textAlign: 'center' }}>
            <QRCode
              value={this.props.QrCodeValue}
              size={256}
              style={{ transform: 'rotate(270deg)' }}
            />
          </div>
        </FormItem>
        <FormItem>
          <TextArea value={this.props.QrCodeValue} rows="4" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            className="form-button"
            onClick={this.props.handleCopyTransaction}
          >
            {CopyMessage}
          </Button>
        </FormItem>
      </div>
    )
  }
}

GetQrcode.propTypes = {
  formatMessage: PropTypes.func,
  QrCodeValue: PropTypes.string,
  handleCopyTransaction: PropTypes.func
}
