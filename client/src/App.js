import { useContext, useEffect } from 'react';
import './App.css';
import Auth from './pages/Auth/Auth'
import { UserContext } from './context/userContext';  
import { Route, Routes, useNavigate } from 'react-router-dom';
import TemplateUser from './pages/Template/TemplateUser';
import TemplateAdmin from './pages/Template/TemplateAdmin';
import HomePage from './pages/User/HomePage';
import MyListFilm from './pages/User/MyListFilm';
import Profile from './pages/User/Profile';
import DetailFilm from './pages/User/DetailFilm';
import Transaction from './pages/Admin/Transaction';
import AddFilm from './pages/Admin/AddFilm';
import ComplainUser from './pages/User/ComplainUser'
import ComplainAdmin from './pages/Admin/ComplainAdmin'

import { API, setAuthToken } from './config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}


function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  // console.log(state);
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/');
    } else {
      if (state.user.status === 'Admin') {
        navigate('/admin');
      } else if (state.user.status === 'Customer') {
        navigate('/user');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);
  return (
    <div>
      <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/user" element={<TemplateUser />}>
      <Route index element={<HomePage />}></Route>
      <Route path='/user/my-list-film' element={<MyListFilm />}></Route>
      <Route path='/user/profile' element={<Profile />}></Route>
      <Route path='/user/detail-film/:id' element={<DetailFilm />}></Route>
      <Route path='/user/complain-user' element={<ComplainUser />}></Route>
      </Route>
      <Route path="/admin" element={<TemplateAdmin />}>
      <Route index element={<Transaction />}></Route>
      <Route path='/admin/add-film' element={<AddFilm />}></Route>
      <Route path='/admin/compain-admin' element={<ComplainAdmin />}></Route>
      </Route>
      </Routes>
    </div>
  );
}

export default App;
