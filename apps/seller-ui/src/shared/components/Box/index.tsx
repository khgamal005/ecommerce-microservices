'use client';

import styled from "styled-components";

interface BoxProps {
  css?: React.CSSProperties;
}

const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.75rem;

  /* apply inline custom styles safely */
  ${(props) => props.css && { ...props.css }}
`;

export default Box;


