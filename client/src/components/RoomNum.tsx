import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { mobile } from '../responsive';

type RoomNumPropsType = {
  num: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const Container = styled.div`
  width: 85%;
  background-color: #ff6666;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  cursor: pointer;
  user-select: none;
  border: 1px solid lightgray;
  margin-bottom: 2rem;
  border-radius: 1rem;

  ${mobile({
    width: '6rem',
    padding: '0.2rem',
    marginBottom: '0',
  })}

  &:active {
    background-color: red;
    transform: scale(0.95);
  }
`;

const RoomName = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: whitesmoke;

  ${mobile({
    fontSize: '0.8rem',
  })}
`;

const RoomNum = ({ num, setSelected }: RoomNumPropsType) => {
  const handleClick = () => {
    setSelected(num.toLowerCase());
  };

  return (
    <Container onClick={handleClick}>
      <RoomName>{num}</RoomName>
    </Container>
  );
};

export default RoomNum;
