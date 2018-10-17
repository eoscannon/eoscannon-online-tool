/*
 * ProxyPage
 *
 */

import React from "react";
import { injectIntl } from "react-intl";
import { Form, Icon, Input, Card, Col, Row, Modal, Tabs } from "antd";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { makeSelectNetwork } from "../LanguageProvider/selectors";
import {
    formItemLayout,
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
const { TabPane } = Tabs;

export class ProxyPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            eos: null,
            formatMessage: this.props.intl.formatMessage,
            GetTransactionButtonState: false, // 获取报文按钮可点击状态
            QrCodeValue: this.props.intl.formatMessage(utilsMsg.QrCodeInitValue), // 二维码内容
            transaction: {},
            scatterStatus: false,
            GetTransactionButtonScatterState: true
        };
    }
    /**
   * 链接scatter
   * */
    componentDidMount () {}
    /**
   * 输入框内容变化时，改变按钮状态
   * */
    componentWillReceiveProps (nextProps) {
        this.onValuesChange(nextProps);
    }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
      const values = nextProps.form.getFieldsValue();
      const { voter, proxy } = values;
      this.setState({
          GetTransactionButtonState: !!voter,
          GetTransactionButtonScatterState: !!proxy
      });
  };
  // 点击切换的回调
  callback = key => {
      if (key === "2") {
          this.setState({ scatterStatus: true });
      } else {
          this.setState({ scatterStatus: false });
      }
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
      this.setState({ scatterStatus: false });
      if (!this.state.GetTransactionButtonState) {
          return;
      }
      const values = this.props.form.getFieldsValue();
      const eos = getEos(this.props.SelectedNetWork);
      const { voter, proxy } = values;
      eos
          .voteproducer(
              {
                  voter,
                  proxy: proxy || "",
                  producers: []
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
      const { proxy } = values;
      eos
          .voteproducer(
              {
                  voter: account.name,
                  proxy: proxy || "",
                  producers: []
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
          });
  };
  render () {
      const { getFieldDecorator } = this.props.form;
      const VoterPlaceholder = this.state.formatMessage(
          messages.VoterPlaceholder,
      );
      const ProxyHelp = this.state.formatMessage(messages.ProxyHelp);
      const ProxyScatterHelp = this.state.formatMessage(
          messages.ProxyScatterHelp,
      );
      const ProxyPlaceholder = this.state.formatMessage(
          messages.ProxyPlaceholder,
      );
      // const VoterLabel = this.state.formatMessage(messages.VoterLabel);
      // const ProxyLabel = this.state.formatMessage(messages.ProxyLabel);
      const ProducersDealTranscationProxy = this.state.formatMessage(
          utilsMsg.ProducersDealTranscationProxy,
      );
      const ProducersSendTranscation = this.state.formatMessage(
          utilsMsg.ProducersSendTranscation,
      );
      const ProxyHelpScatter = this.state.formatMessage(
          utilsMsg.ProxyHelpScatter,
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
                              <Card title={ProducersDealTranscationProxy} bordered={false}>
                                  <FormItem {...formItemLayout}>
                                      {getFieldDecorator("voter", {
                                          rules: [{ required: true, message: VoterPlaceholder }]
                                      })(
                                          <Input
                                              prefix={
                                                  <Icon
                                                      type="user"
                                                      style={{ color: "rgba(0,0,0,.25)" }}
                                                  />
                                              }
                                              placeholder={VoterPlaceholder}
                                          />,
                                      )}
                                  </FormItem>
                                  <FormItem help={ProxyHelp} {...formItemLayout}>
                                      {getFieldDecorator("proxy", {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: ProxyPlaceholder
                                              }
                                          ],
                                          initialValue: "cannonproxy1"
                                      })(
                                          <Input
                                              prefix={
                                                  <Icon
                                                      type="user"
                                                      style={{ color: "rgba(0,0,0,.25)" }}
                                                  />
                                              }
                                              placeholder={ProxyPlaceholder}
                                          />,
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
                              <Card title={ProxyHelpScatter} bordered={false}>
                                  <FormItem help={ProxyHelp} {...formItemLayout}>
                                      {getFieldDecorator("proxy", {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: ProxyPlaceholder
                                              }
                                          ],
                                          initialValue: "cannonproxy1"
                                      })(
                                          <Input
                                              prefix={
                                                  <Icon
                                                      type="user"
                                                      style={{ color: "rgba(0,0,0,.25)" }}
                                                  />
                                              }
                                              placeholder={ProxyPlaceholder}
                                          />,
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

ProxyPage.propTypes = {
    form: PropTypes.object,
    intl: PropTypes.object,
    SelectedNetWork: PropTypes.string
};

const ProxyPageIntl = injectIntl(ProxyPage);
const ProxyPageForm = Form.create()(ProxyPageIntl);

const mapStateToProps = createStructuredSelector({
    SelectedNetWork: makeSelectNetwork()
});

export default connect(mapStateToProps)(ProxyPageForm);
