/*
 * FormCode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert, Icon, Modal } from 'antd';
import utilsMsg from '../../utils/messages';
import { formItemLayout } from '../../utils/utils';
import { storage } from '../../utils/storage'

const FormItem = Form.Item;
const { TextArea } = Input;

export default class FormCode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleStorage=()=>{
    const values = this.props.form.getFieldsValue()
    storage.setForm(values)
    Modal.success({
      content: '设置成功！',
      okText: '关闭'
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
  
    return (
      <div>
        <FormItem {...formItemLayout} colon>
          {getFieldDecorator('refBlockNum', {
            rules: [{ required: true, message: 'ref_block_num' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='ref_block_num'
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} colon>
          {getFieldDecorator('refBlockPrefix', {
            rules: [{ required: true, message: 'ref_block_prefix' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='ref_block_prefix'
            />,
          )}
        </FormItem>

        <FormItem {...formItemLayout} colon>
          {getFieldDecorator('chain_id', {
            initialValue: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
            rules: [{ required: true, message: 'chain_id' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='chain_id'
            />,
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button
              type="primary"
              className="form-button"
              style={{ display: 'inline', marginRight: 5 }}
              onClick={this.handleStorage}
            >
              确认
            </Button>
        </FormItem>

      </div>
    );
  }
}

FormCode.propTypes = {
  form: PropTypes.object,
  formatMessage: PropTypes.func,  
};
