import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Room from './page/Room';
import Login from './page/Login';
import Signin from './page/Signin';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { useEffect } from 'react';
import { axiosReq } from './requrestMethod';

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const alertSleep = async () => {
      const res = await axiosReq.get('/test');
      console.log(res.data);
    };
    alertSleep();
  }, []);

  return (
    <Routes>
      <Route path={'/'}>
        <Route index element={<Login />} />
        <Route path='signin' element={<Signin />} />
        <Route
          path='room'
          element={user != null ? <Room /> : <Navigate to={'/'} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
