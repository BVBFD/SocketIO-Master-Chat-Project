import { useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/store';
import { axiosReq } from '../requrestMethod';
import { MessageType } from './Conversation';
import { mobile } from '../responsive';

type MessagePropsType = {
  msg: MessageType;
  user?: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  messages: MessageType[];
  selected: string;
  setAfterEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollBol: React.Dispatch<React.SetStateAction<boolean>>;
};

type ContainerPropsType = {
  own: boolean;
};

const Container = styled.div<ContainerPropsType>`
  display: flex;
  background-color: white;
  margin: 0.4rem;
  padding: 0.6rem 1.2rem;
  width: fit-content;
  border-radius: 1rem;
  align-self: ${(props) => (props.own ? 'flex-start' : 'flex-end')};
  position: relative;
`;

const Spanfrom = styled.span`
  font-weight: bold;
`;

const Ptext = styled.p`
  margin-left: 2rem;
`;

const DFbox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 2rem;
  justify-content: center;
  position: relative;
  bottom: 0.2rem;
  position: relative;
`;

const Delete = styled.div`
  font-size: x-small;
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -0.2rem;
  color: white;
  background-color: red;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }

  ${mobile({
    fontSize: 'x-small',
  })}
`;

const Fix = styled.div`
  font-size: x-small;
  width: 1.4rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -0.6rem;
  border-radius: 50%;
  border: none;
  color: white;
  background-color: blue;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }

  ${mobile({
    fontSize: 'x-small',
  })}
`;

const EditBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 20%;
  left: 100%;
  z-index: 9999;
`;

const EditInput = styled.input`
  height: 1.6rem;
`;

const EditButton = styled.button`
  height: 1.6rem;
  padding: 0 0.2rem;
`;

const Message = ({
  msg,
  user,
  setMessages,
  messages,
  selected,
  setAfterEdit,
  setScrollBol,
}: MessagePropsType) => {
  const [own, setOwn] = useState<boolean>();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>();
  const socket = useSelector((state: RootState) => state.socket.socket);

  const handleDel = async () => {
    setScrollBol(true);
    if (own) {
      await axiosReq.delete(`/removeMessage/${msg._id}`);
      const newArray = messages.filter((massage) => massage._id !== msg._id);
      setMessages(newArray);
      socket?.emit('afterDelMsg', { room: selected, afterDelBol: true });
    }
  };

  const handleOpenEdit = async () => {
    if (own) {
      openEdit ? setOpenEdit(false) : setOpenEdit(true);
    }
  };

  const handleNetEdit = async () => {
    setScrollBol(true);
    if (own) {
      setAfterEdit(false);
      await axiosReq.put(`/editMessage/${msg._id}`, {
        text: editText,
      });
      socket?.emit('afterEditMsg', { afterEditBol: true, room: selected });
    }
    setAfterEdit(true);
  };

  useEffect(() => {
    setOwn(user === msg.from);
  }, [messages, user]);

  return (
    <Container own={own ? true : false}>
      <Spanfrom>{msg.from}</Spanfrom>
      <Ptext>{msg.text}</Ptext>
      <DFbox>
        <Delete onClick={handleDel}>X</Delete>
        <Fix onClick={handleOpenEdit}>Edit</Fix>
      </DFbox>
      {openEdit && (
        <EditBox>
          <EditInput onChange={(e) => setEditText(e.target.value)} />
          <EditButton onClick={handleNetEdit}>Edit</EditButton>
        </EditBox>
      )}
    </Container>
  );
};

export default Message;
