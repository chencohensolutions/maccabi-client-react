import axios from 'axios';
import config from '../config';

const { baseURL } = config;

console.log(baseURL);
const axiosConfig = {
  baseURL,
  timeout: 360000,
};

const axiosInstance = axios.create(axiosConfig);
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

// enum UserRole {
//   CLIENT = 'client',
//   ADMIN = 'admin',
// }

export interface IUser {
  id: string;
  userName: string;
  password: string;
}

export interface ILoginResponse {
  id: string;
  userName: string;
  users: IUserAssoc;
  error: number;
}

export interface IUserAssoc {
  [id: string]: string;
}

const api = {
  loginToken: async (): Promise<ILoginResponse | undefined> => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const res = await axiosInstance.post('/loginToken', { token });
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return res.data;
      } catch (error: any) {
        switch (error.error.code) {
          case 2:
            axiosInstance.defaults.headers.common['Authorization'] = '';
            sessionStorage.removeItem('access_token');
            throw new Error('token expired');
        }
      }
    } else {
      throw new Error('token expired');
    }
  },
  loginPassword: async (userName: string, password: string): Promise<ILoginResponse | undefined> => {
    try {
      const res = await axiosInstance.post('/loginPassword', { userName, password });
      if (res && res.data) {
        const token = res.data.token;
        if (res.data.token) {
          sessionStorage.setItem('access_token', token);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return res.data;
      }
    } catch (err) {
      sessionStorage.removeItem('access_token');
      throw err;
    }
  },
  logout: () => {
    axiosInstance.defaults.headers.common['Authorization'] = '';
    sessionStorage.removeItem('access_token');
  },
  getUsers: async () => {
    const res = await axiosInstance.get('/users');
    return res.data;
  },
  deleteUser: async (userId: string) => {
    const res = await axiosInstance.delete('/users/' + userId);
    return res.data;
  },
  createUser: async (userName: string, password: string) => {
    const res = await axiosInstance.post('/users', { userName, password });
    return res.data;
  },
  updateUser: async (userName: string, newUserName: string) => {
    const res = await axiosInstance.patch('/users', { userName, newUserName });
    return res.data;
  }
};

export default api;
