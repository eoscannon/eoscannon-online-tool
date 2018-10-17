import { injectGlobal } from "styled-components";

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background: #fff;
  }
  .ant-layout-content{
    background: #fff;
    margin : 0!important;
  }
  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .ant-menu-submenu  .ant-menu-vertical{
    display:none;
  }

  #app {
    background-color: #fafafa;
    height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  .ant-layout-footer{
    padding: 14px 50px!important;
  }
  .ant-layout{
    height: 100%;
  }
  .ant-form-item-control-wrapper{
    width:100%!important;
  }
`;
