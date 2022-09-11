import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { axiosReq } from '../requrestMethod';
import { mobile } from '../responsive';
import { CircularProgress } from '@mui/material';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.4),
      rgba(1, 1, 1, 0.3)
    ),
    url('../langSignIn.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${mobile({
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  })}
`;

const Wrapper = styled.div`
  width: 50%;
  padding: 5rem;
  background-color: var(--login-signin-bgColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  box-shadow: 0.4rem 0.4rem 1rem var(--login-signin-wrapperShadow);
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.85),
    rgba(1, 1, 1, 0.95)
  );
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  margin: 1rem 0;

  ${mobile({
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  })}
`;

const Label = styled.label`
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  font-style: italic;
  color: var(--login-signin-color);
`;

const Input = styled.input`
  width: 70%;
  height: 100%;
  font-size: var(--login-signin-fontSize);

  ${mobile({
    width: '10rem',
    marginTop: '0.4rem',
    fontSize: '1.2rem',
    padding: '0.3rem',
  })}
`;

const Button = styled.button`
  width: 8rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 1.4rem;
  font-size: var(--login-signin-fontSize);
  font-style: italic;
  margin: 1rem 1rem;
  box-shadow: 0.1rem 0.1rem 0.2rem var(--login-signin-color);
  background-color: gray;
  border: 1px solid var(--login-signin-color);
  color: var(--login-signin-color);
  cursor: pointer;

  &:active {
    transform: scale(0.95);
    box-shadow: 0.1rem 0.1rem 0.2rem whitesmoke;
  }

  ${mobile({
    width: '8rem',
    padding: '0.2rem',
  })}
`;

const Signin = () => {
  const [email, setEmail] = useState<string>();
  const [pwd, setPwd] = useState<string>();
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSigning(true);
    try {
      const res = await axiosReq.post('/signup', {
        email,
        password: pwd,
      });
      navigate('/');
      window.alert(`${res.data.email} 님 가입완료하였습니다.`);
    } catch (error) {
      setIsSigning(false);
      window.alert(`Something is Wrong!!`);
    }
  };

  useEffect(() => {
    return () => {
      setIsSigning(false);
    };
  }, []);

  return (
    <Container>
      <Wrapper>
        <Box>
          <Label>Email</Label>
          <Input onChange={(e) => setEmail(e.target.value)} type='email' />
        </Box>

        <Box>
          <Label>Password</Label>
          <Input onChange={(e) => setPwd(e.target.value)} type='password' />
        </Box>

        <Button onClick={handleSignUp}>
          {isSigning ? <CircularProgress /> : 'Sign-Up'}
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Signin;
