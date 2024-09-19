import axios from 'axios';
import config from '../config';

const {baseURL} = config;

console.log(baseURL);
const axiosConfig = {
  baseURL,
  timeout: 360000,
};

const axiosInstance = axios.create(axiosConfig);
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface ILoginResponse {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  error: number;
}


const api = {
  loginToken: async (): Promise<ILoginResponse | undefined> => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await axiosInstance.post('/loginToken', {token});
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return res.data;
      } catch (error: any) {
        switch (error.error.code) {
          case 2:
            axiosInstance.defaults.headers.common['Authorization'] = '';
            localStorage.removeItem('access_token');
            throw new Error('token expired');
        }
      }
    } else {
      throw new Error('token expired');
    }
  },
  loginPassword: async (userName: string, password: string): Promise<ILoginResponse | undefined> => {
    try {
      const res = await axiosInstance.post('/loginPassword', {userName, password});
      if (res && res.data) {
        const token = res.data.token;
        if (res.data.token) {
          localStorage.setItem('access_token', token);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return res.data;
      }
    } catch (err) {
      localStorage.removeItem('access_token');
      throw err;
    }
  },
  logout: () => {
    axiosInstance.defaults.headers.common['Authorization'] = '';
    localStorage.removeItem('access_token');
  },
};

export default api;
