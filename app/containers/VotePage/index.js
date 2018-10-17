/*
 * VotePage
 *
 */

import React from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { Form, Icon, Input, Select, Card, Col, Row, Modal, Tabs } from "antd";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { makeSelectNetwork } from "../LanguageProvider/selectors";
import {
    formItemLayout,
    voteNodes,
    getEos,
    getEosByScatter,
    openTransactionFailNotification
} from "../../utils/utils";
import { LayoutContent } from "../../components/NodeComp";
import ScanQrcode from "../../components/ScanQrcode";
import DealGetQrcode from "../../components/DealGetQrcode";
import messages from "./messages";
import utilsMsg from "../../utils/messages";

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

export class VotePage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            eos: null,
            formatMessage: this.props.intl.formatMessage,
            GetTransactionButtonState: false, // 获取报文按钮可点击状态
            QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
            transaction: {},
            GetTransactionButtonScatterState: false,
            scatterStatus: false
        };
    }
    /**
   * 输入框内容变化时，改变按钮状态
   * */
    componentWillReceiveProps (nextProps) {
        this.onValuesChange(nextProps);
    }
    /**
   * 链接scatter
   * */
    componentDidMount () {}

  callback = key => {
      if (key === "2") {
          this.setState({ scatterStatus: true });
      } else {
          this.setState({ scatterStatus: false });
      }
  };
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
      const values = nextProps.form.getFieldsValue();
      const { voter, producers } = values;
      this.setState({
          GetTransactionButtonState: !!voter && !!producers,
          GetTransactionButtonScatterState: !!producers
      });
  };
  // * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
  handleGetTransaction = () => {
      this.setState({ scatterStatus: false });
      if (!this.state.GetTransactionButtonState) {
          return;
      }
      const values = this.props.form.getFieldsValue();
      const eos = getEos(this.props.SelectedNetWork);
      const { voter, producers } = values;
      producers.sort();
      eos
          .voteproducer(
              {
                  voter,
                  proxy: "",
                  producers
              },
              {
                  sign: false,
                  broadcast: false
              },
          )
          .then(tr => {
              this.setState({
                  eos,
                  transaction: tr.transaction
              });
          })
          .catch(err => {
              openTransactionFailNotification(this.state.formatMessage, err.name);
          });
  };

  /**
   * 使用scatter投票
   * */
  voteByScatter = () => {
      getEosByScatter(this.props.SelectedNetWork, this.handleTranscationScatter);
  };
  handleTranscationScatter = () => {
      this.setState({ scatterStatus: true });
      const eos = global.EosByScatter;
      const account = global.AccountByScatter;
      const values = this.props.form.getFieldsValue();
      const { producers } = values;
      producers.sort();
      eos
          .voteproducer(
              {
                  voter: account.name,
                  proxy: "",
                  producers
              },
              { authorization: [`${account.name}@${account.authority}`] },
          )
          .then(tr => {
              console.log(tr);
              Modal.success({
                  title: this.state.formatMessage(utilsMsg.ScanCodeSendSuccess),
                  content: `${this.state.formatMessage(
                      utilsMsg.ScanCodeSendSuccessMessage,
                  )} ${tr.transaction_id}`,
                  okText: this.state.formatMessage(utilsMsg.ScanCodeSendGetIt)
              });
          })
          .catch(err => {
              Modal.error({
                  title: this.state.formatMessage(utilsMsg.ScanCodeSendFailed),
                  content: `${err}`,
                  okText: this.state.formatMessage(utilsMsg.ScanCodeSendGetIt)
              });
              // openTransactionFailNotification(this.state.formatMessage, err.name);
          });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  render () {
      const { getFieldDecorator } = this.props.form;
      const VotePageVoterPlaceholder = this.state.formatMessage(
          messages.VotePageVoterPlaceholder,
      );
      const VotePageProducersPlaceholder = this.state.formatMessage(
          messages.VotePageProducersPlaceholder,
      );
      const ProxyScatterHelp = this.state.formatMessage(
          messages.ProxyScatterHelp,
      );
      const ProducersDealTranscationSelectBP = this.state.formatMessage(
          utilsMsg.ProducersDealTranscationSelectBP,
      );
      const ProducersSendTranscation = this.state.formatMessage(
          utilsMsg.ProducersSendTranscation,
      );
      const ProducersChangeBP = this.state.formatMessage(
          utilsMsg.ProducersChangeBP,
      );
      const scatterSignature = this.state.formatMessage(
          utilsMsg.scatterSignature,
      );
      const offlineSignature = this.state.formatMessage(
          utilsMsg.offlineSignature,
      );
      return (
          <LayoutContent>
              <Row gutter={16}>
                  <Tabs defaultActiveKey="1" onChange={this.callback}>
                      <TabPane tab={offlineSignature} key="1">
                          <Col span={12}>
                              <Card title={ProducersDealTranscationSelectBP} bordered={false}>
                                  <FormItem {...formItemLayout}>
                                      {getFieldDecorator("voter", {
                                          rules: [
                                              { required: true, message: VotePageVoterPlaceholder }
                                          ]
                                      })(
                                          <Input
                                              prefix={
                                                  <Icon
                                                      type="user"
                                                      style={{ color: "rgba(0,0,0,.25)" }}
                                                  />
                                              }
                                              placeholder={VotePageVoterPlaceholder}
                                          />,
                                      )}
                                  </FormItem>
                                  <FormItem {...formItemLayout}>
                                      {getFieldDecorator("producers", {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: VotePageProducersPlaceholder
                                              }
                                          ]
                                      })(
                                          <Select
                                              mode="tags"
                                              style={{ width: "100%" }}
                                              placeholder={VotePageProducersPlaceholder}
                                          >
                                              {voteNodes.map(item => (
                                                  <Option key={item}>{item}</Option>
                                              ))}
                                          </Select>,
                                      )}
                                  </FormItem>
                                  <DealGetQrcode
                                      eos={this.state.eos}
                                      form={this.props.form}
                                      formatMessage={this.state.formatMessage}
                                      GetTransactionButtonClick={this.handleGetTransaction}
                                      GetTransactionButtonState={
                                          this.state.GetTransactionButtonState
                                      }
                                      QrCodeValue={this.state.QrCodeValue}
                                      SelectedNetWork={this.props.SelectedNetWork}
                                      transaction={this.state.transaction}
                                      voteByScatterClick={this.voteByScatter}
                                      scatterStatus={this.state.scatterStatus}
                                      GetTransactionButtonScatterState={
                                          this.state.GetTransactionButtonScatterState
                                      }
                                  />
                              </Card>
                          </Col>
                          <Col span={12}>
                              <Card title={ProducersSendTranscation} bordered={false}>
                                  <ScanQrcode
                                      eos={this.state.eos}
                                      form={this.props.form}
                                      formatMessage={this.state.formatMessage}
                                      SelectedNetWork={this.props.SelectedNetWork}
                                      transaction={this.state.transaction}
                                  />
                              </Card>
                          </Col>
                      </TabPane>
                      <TabPane tab={scatterSignature} key="2">
                          <Col span={12}>
                              <Card title={ProducersChangeBP} bordered={false}>
                                  <FormItem {...formItemLayout}>
                                      {getFieldDecorator("producers", {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: VotePageProducersPlaceholder
                                              }
                                          ]
                                      })(
                                          <Select
                                              mode="tags"
                                              style={{ width: "100%" }}
                                              placeholder={VotePageProducersPlaceholder}
                                          >
                                              {voteNodes.map(item => (
                                                  <Option key={item}>{item}</Option>
                                              ))}
                                          </Select>,
                                      )}
                                  </FormItem>
                                  <DealGetQrcode
                                      eos={this.state.eos}
                                      form={this.props.form}
                                      formatMessage={this.state.formatMessage}
                                      GetTransactionButtonClick={this.handleGetTransaction}
                                      GetTransactionButtonState={
                                          this.state.GetTransactionButtonState
                                      }
                                      QrCodeValue={this.state.QrCodeValue}
                                      SelectedNetWork={this.props.SelectedNetWork}
                                      transaction={this.state.transaction}
                                      voteByScatterClick={this.voteByScatter}
                                      scatterStatus={this.state.scatterStatus}
                                      GetTransactionButtonScatterState={
                                          this.state.GetTransactionButtonScatterState
                                      }
                                  />
                              </Card>
                          </Col>
                      </TabPane>
                  </Tabs>
              </Row>
          </LayoutContent>
      );
  }
}

VotePage.propTypes = {
    form: PropTypes.object,
    intl: PropTypes.object,
    SelectedNetWork: PropTypes.string
};

const VotePageIntl = injectIntl(VotePage);
const VotePageForm = Form.create()(VotePageIntl);

const mapStateToProps = createStructuredSelector({
    SelectedNetWork: makeSelectNetwork()
});

export default connect(mapStateToProps)(VotePageForm);
