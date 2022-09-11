import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Conversation from '../components/Conversation';
import RoomNum from '../components/RoomNum';
import { RootState } from '../redux/store';
import { logOut } from '../redux/userRedux';
import SocketObj from 'socket.io-client';
import { socketConnect, socketDisconnect } from '../redux/socketRedux';
import { mobile } from '../responsive';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;

  ${mobile({
    flexDirection: 'column',
  })}
`;

const Sidebar = styled.aside`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  background-color: lightcyan;

  ${mobile({
    flexDirection: 'row',
    flex: '0.1',
    padding: '0.4rem',
  })}
`;

const Wrapper = styled.div`
  flex: 3.3;

  background: linear-gradient(rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0.5)),
    url('../langPic.jpg') no-repeat;
  background-size: 80vw;
  background-position: right;
  background-attachment: fixed;

  ${mobile({
    flex: '4',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  })}
`;

const Logout = styled.button`
  width: fit-content;
  background-color: lightslategray;
  padding: 1rem 2rem;
  align-self: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid lightgray;
  border-radius: 1rem;
  font-size: 2rem;
  font-weight: 600;
  color: whitesmoke;

  ${mobile({
    padding: '0.2rem',
    fontSize: '0.4rem',
    alignSelf: 'center',
  })}

  &:active {
    background-color: red;
    transform: scale(0.95);
  }
`;

const AlertChoose = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: bolder;
  font-size: xx-large;
  color: white;

  ${mobile({
    height: '100%',
    fontSize: '1.4rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })}
`;

const Room = () => {
  const [roomNum, setRoomNum] = useState([
    'Korean',
    'English',
    'French',
    'Chinese',
    'Vietnamese',
  ]);
  const [selected, setSelected] = useState<string>('');
  const socket = useSelector((state: RootState) => state.socket.socket);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarHeight, setSidebarHeight] = useState<number>();

  const handleLogout = () => {
    socket?.disconnect();
    dispatch(socketDisconnect());
    dispatch(logOut());
    navigate('/');
  };

  useEffect(() => {
    const socketObj = SocketObj(`${import.meta.env.VITE_SERVER_URL}`).connect();
    dispatch(socketConnect(socketObj));
  }, []);

  useEffect(() => {
    socket?.emit('joinRoom', selected);
    socket?.on('joinRoomNum', (text) => {
      console.log(text);
    });
  }, [selected]);

  return (
    <Container>
      <Sidebar>
        {roomNum.map((num) => {
          return <RoomNum num={num} setSelected={setSelected} />;
        })}
        <Logout onClick={handleLogout}>Log Out</Logout>
      </Sidebar>
      <Wrapper>
        {selected ? (
          <Conversation selected={selected} socket={socket} />
        ) : (
          <AlertChoose>Choose the Chatting Box, please!!</AlertChoose>
        )}
      </Wrapper>
    </Container>
  );
};

export default Room;
