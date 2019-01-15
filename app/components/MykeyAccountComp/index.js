/*
 * MykeyAccountComp
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Alert, Card ,InputNumber, Table, Tooltip, } from 'antd'
import Fcbuffer from 'fcbuffer'
import config from './../../config'
import { storage } from '../../utils/storage'
import utilsMsg from '../../utils/messages'
import {
  openNotification,
  openTransactionSuccessNotification
} from '../../utils/utils'
import {Input ,Radio } from 'utils/antdUtils'


export default class MykeyAccountComp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eos: null,
      columnsData: [],
      checked: 'keydata',
      limit: this.props.limit,
      columnsMykey: [],
      lowerBound: this.props.lowerBound,
      upperBound: this.props.upperBound,
      scope: this.props.scope,
      eos: this.props.eos,
      mykeyVisvible: false,
      tableRows: []
    }
  }

  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.eos 
    ) {
      // console.log('next: ', nextProps)
      this.setState({ 
        eos: nextProps.eos ,
        mykeyVisvible: nextProps.mykeyVisvible, 
        columnsData: nextProps.columnsData,
        columnsMykey: nextProps.columnsMykey
      })

    }
  }
  componentDidMount () {
  }



  render () {
    const { getFieldDecorator } = this.props.form
    const MykeyAccountCompScope = this.props.formatMessage(
      utilsMsg.MykeyAccountCompScope,
    )
    const MykeyAccountCompLowerBound = this.props.formatMessage(
      utilsMsg.MykeyAccountCompLowerBound,
    )
    const MykeyAccountCompUpperBound = this.props.formatMessage(
      utilsMsg.MykeyAccountCompUpperBound,
    )
    const MykeyAccountCompLimit = this.props.formatMessage(
      utilsMsg.MykeyAccountCompLimit,
    )
    return (
      <div>
       {this.state.mykeyVisvible ? (
          <div >
            <Card title='MYKEY' bordered={true} type="inner" style={{ marginTop: '21px'}}>
              <div>
                <Radio.Group defaultValue="keydata" buttonStyle="solid" style={{padding: '10px 0'}} onChange={this.props.handleChangeCheck}>
                  <Radio.Button value="keydata" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>keydata</Radio.Button>
                  <Radio.Button value="backupdata" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>backupdata</Radio.Button>
                  <Radio.Button value="subacct" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>subacct</Radio.Button>
                  <Radio.Button value="subassetsum" style={{margin: '0 10px',border: '1px solid #1890ff',borderRadius: '3px',left: '0px'}}>subassetsum</Radio.Button>
                </Radio.Group>
              </div>
              <div style={{ display: 'flex', marginBottom: 30 }}>
                <Tooltip
                  title='Scope'
                  placement="topLeft"
                  overlayClassName="numeric-input"
                >
                  <Input addonBefore={MykeyAccountCompScope}  maxLength={18} value={this.props.scope} onChange={this.props.changeScope} style={{ marginRight: 20, marginLeft: 10}}/>
                </Tooltip>
                <Input addonBefore={MykeyAccountCompLowerBound}  value={this.props.lowerBound} onChange={this.props.changeLowerBound} style={{marginRight: 20}}/>
                <Input addonBefore={MykeyAccountCompUpperBound}   value={this.props.upperBound} onChange={this.props.changeUpperBound} style={{marginRight: 20}}/>
                <Tooltip
                  title='Limit'
                  placement="topLeft"
                  overlayClassName="numeric-input"
                >
                  <Input addonBefore={MykeyAccountCompLimit} value={this.props.limit} onChange={this.props.changeLimit} style={{marginRight: 20}}/>
                </Tooltip>
                <Button type="primary"  onClick={this.props.onSearch}>{this.props.FunctionSearchButton}</Button>
              </div>
              <Table columns={this.state.columnsMykey} bordered={false} dataSource={this.state.columnsData} scroll={{ x: 1500 | true }} pagination={{ pageSize: 50 }}/>
            </Card>
          </div>
        ) : null}
      </div>
    )
  }
}

MykeyAccountComp.propTypes = {
  eos: PropTypes.object,
  formatMessage: PropTypes.func,
  SelectedNetWork: PropTypes.string,
  mykeyVisvible: PropTypes.bool,
  handleChangeCheck: PropTypes.func,
  onSearch: PropTypes.func,
  changeLimit: PropTypes.func,
  changeUpperBound: PropTypes.func,
  changeLowerBound: PropTypes.func,
  changeScope: PropTypes.func,
  limit : PropTypes.number,
  lowerBound : PropTypes.string,
  upperBound : PropTypes.string,

  onSearch:PropTypes.func,
  columnsData: PropTypes.array,
  columnsMykey: PropTypes.array,
  FunctionSearchButton: PropTypes.string,
}
