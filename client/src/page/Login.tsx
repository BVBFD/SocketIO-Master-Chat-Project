import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../redux/store';
import { loginFailure, loginStart, loginSuccess } from '../redux/userRedux';
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
      rgba(1, 1, 1, 0.6),
      rgba(255, 255, 255, 0.2)
    ),
    url('../langInitImg.jpg');
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
    rgba(255, 255, 255, 0.8),
    rgba(1, 1, 1, 0.99)
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
  text-align: center;
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

const ButtonBox = styled.div`
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  ${mobile({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    left: '-0.1rem',
    marginTop: '4rem',
  })}
`;

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({});
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axiosReq.post('/login', loginInfo);
      dispatch(loginSuccess(res.data.sendUser));
      navigate('/room');
    } catch (error) {
      dispatch(loginFailure());
      navigate('/');
    }
  };

  return (
    <Container>
      <Wrapper>
        <Box>
          <Label>Email</Label>
          <Input
            onChange={(e) =>
              setLoginInfo({
                ...loginInfo,
                [e.target.name]: e.target.value,
              })
            }
            type='email'
            name='email'
          />
        </Box>

        <Box>
          <Label>Password</Label>
          <Input
            onChange={(e) =>
              setLoginInfo({
                ...loginInfo,
                [e.target.name]: e.target.value,
              })
            }
            type='password'
            name='password'
          />
        </Box>

        <ButtonBox>
          <Button disabled={state.user.isFetching} onClick={handleLogin}>
            {state.user.isFetching ? <CircularProgress /> : 'Log-In'}
          </Button>
          <Button
            disabled={state.user.isFetching}
            onClick={() => navigate('/signin')}
          >
            Sign-Up
          </Button>
        </ButtonBox>
      </Wrapper>
    </Container>
  );
};

export default Login;
