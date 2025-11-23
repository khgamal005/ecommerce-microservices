'use client';

import styled from "styled-components";

interface BoxProps {
  css?: React.CSSProperties;
}

const Box = styled.div.attrs<BoxProps>(props => ({
  style: props.css || {}
}))<BoxProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export default Box;


