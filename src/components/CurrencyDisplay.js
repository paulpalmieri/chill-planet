import React from "react";

import styled from "styled-components";

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px;
    div {
        padding-left: 10px;
    }
`;

const CurrencyDisplay = (props) => {
  return (
    <FlexRowContainer>
      <img height={16} src={props.png}></img>
      <div>{props.owned}</div>
    </FlexRowContainer>
  );
};

export default CurrencyDisplay;
