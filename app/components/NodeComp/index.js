import styled from 'styled-components';
import { Layout, Form } from 'antd';

const { Content } = Layout;

const LayoutContent = styled(Content)`
  background: #fff;
`;

const LayoutContentBox = styled.div`
  background: #fff;
`;

const FormComp = styled(Form)`
  max-width: 526px;
  &.ant-form {
    margin: 0 auto;
  }
  .form-button {
    display: block;
    padding: 0 45px;
    margin: 0 auto;
  }
  .ant-form-item-label {
    text-align: left;
  }
`;

export { LayoutContent, LayoutContentBox, FormComp };
