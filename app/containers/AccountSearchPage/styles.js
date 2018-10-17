import styled from "styled-components";

const ConBox = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  .content {
    display: flex;
    padding-top: 2rem;
  }
  .firstContent {
    width: 50%;
    span {
      display: block;
      padding-bottom: 1.2rem;
    }
  }
  .contentDetail {
    text-align: center;
  }
  .secondContent {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  .contentDetailDesc {
    display: block;
    .contentDetailDescTitle {
      padding-top: 1rem;
      font-weight: bold;
    }
    span {
      text-align: center;
      display: block;
    }
  }
`;

const styleComps = {
    ConBox
};

export default styleComps;
