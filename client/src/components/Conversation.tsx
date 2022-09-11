import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Message from './Message';
import { axiosReq } from '../requrestMethod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type ConversationType = {
  selected: string;
  socket?: Socket<DefaultEventsMap, DefaultEventsMap> | null;
};

type MessageType = {
  _id: string;
  _v?: number;
  from: string;
  room: string;
  text: string;
  updatedAt?: string;
  createdAt?: string;
};

type RoonmNumType = {
  ref: any;
};

type ConvboxType = {
  ref: any;
};

const RoomNum = styled.div<RoonmNumType>`
  width: 100%;
  text-align: center;
  background-color: darkslateblue;
  margin: 0 0 0.2rem 0;
  font-size: 2rem;
  font-weight: bolder;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Convbox = styled.div<ConvboxType>`
  flex: 16;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const Textbox = styled.form`
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: lightgreen;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 1.6rem;
`;

const Button = styled.button`
  font-size: 1rem;
  background-color: aliceblue;
  border: 2px solid darkcyan;
  color: darkslategray;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;

const Conversation = ({ selected, socket }: ConversationType) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState<string>();
  const [user, setUser] = useState<string>();
  const [afterEdit, setAfterEdit] = useState<boolean>(false);
  const [scrollBol, setScrollBol] = useState<boolean>(false);
  const state = useSelector((state: RootState) => state);
  const convboxRef = useRef<HTMLDivElement>();
  const roonmNumRef = useRef<HTMLDivElement>();

  const scrollToBottom = () => {
    const convboxRefHeight = convboxRef.current?.clientHeight;
    const roomNumRefHeight = roonmNumRef.current?.clientHeight;
    const scrollHeight = convboxRefHeight! + roomNumRefHeight!;
    setScrollBol(false);
    return convboxRef.current?.scrollTo({
      top: scrollHeight,
      left: 0,
    });
  };

  useEffect(() => {
    setUser(state.user.user?.email.split('@')[0]);
  }, []);

  const handleText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScrollBol(false);
    const sendMessage = async () => {
      const res = await axiosReq.post('/sendMessage', {
        from: user,
        room: selected,
        text: text,
      });
      const newMessage = res.data.savedNewMessage;
      socket?.emit('sendMessage', newMessage);
    };
    sendMessage();
  };

  useEffect(() => {
    socket?.on('getMessage', (getNewMessage) => {
      setMessages([...messages, getNewMessage]);
    });
    !scrollBol && scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      const res = await axiosReq.get(`/getMessage/${selected}`);
      setMessages(res.data);
    };
    getMessages();
  }, [afterEdit, selected]);

  useEffect(() => {
    setAfterEdit(false);
    socket?.on('getAfterEditMsg', (afterEdit) => {
      setAfterEdit(afterEdit);
    });
    socket?.on('getAfterDelMsg', (afterEdit) => {
      setAfterEdit(afterEdit);
    });
  }, [afterEdit]);

  return (
    <Container>
      <RoomNum ref={roonmNumRef}>{selected}</RoomNum>
      <Convbox ref={convboxRef}>
        {Array.from(messages).map((msg) => (
          <Message
            msg={msg}
            user={user}
            messages={messages}
            setMessages={setMessages}
            selected={selected}
            setAfterEdit={setAfterEdit}
            setScrollBol={setScrollBol}
          />
        ))}
      </Convbox>
      <Textbox onSubmit={handleText}>
        <Input onChange={(e) => setText(e.target.value)} />
        <Button type='submit'>Send Message</Button>
      </Textbox>
    </Container>
  );
};

export type { MessageType };
export default Conversation;
