/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const options = {
        title: 'Your session has expired.',
        message: 'Please login again to continue using the site.',
        buttons: [
          {
            label: 'Log in',
          },
        ],
        closeOnEscape: false,
        closeOnClickOutside: false,
      };

    const navigate = useNavigate();

  const redirecttopath = (path) => {
    navigate(path);
  };
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
        userData: null,
    });

    const setToken = (token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setAuth({ token, refreshToken });
    };

    const getToken = () => {
        return auth.token;
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/refresh`, { refreshToken: auth.refreshToken });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setAuth({ ...auth, token });
        } catch (error) {
            console.error('Token refresh failed', error);
            logout();
            confirmAlert(options);
            redirecttopath('/login');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('categories');
        setAuth({ token: null, refreshToken: null , userData: null , categories: null});
    };



    const setUserData = (data) => {
        setAuth((prevAuth) => ({ ...prevAuth, userData: data }));
    };
    return (
        <AuthContext.Provider value={{ auth, setToken, getToken, refreshToken, logout, setUserData }}>
            {children}
        </AuthContext.Provider>
    );

}
export { AuthContext, AuthProvider }