import { createAction, createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';


export enum ELoginState {
  idle = 0,
  pending,
  success,
  error,
}

interface IUserState {
  loginState: ELoginState;
  isLoggedin: boolean;
  tokenExpired: boolean;
}

export const logout = createAction('session/logout', () => {
  return {
    payload: api.logout(),
  };
});

export const loginPassword = createAsyncThunk(
  'session/loginPassword',
  async ({ userName, password }: { password: string; userName: string }) => {
    const response = await api.loginPassword(userName, password);

    return response;
  },
);

export const loginToken = createAsyncThunk('session/loginToken', async () => {
  const response = await api.loginToken();
  return response;
});

const userReducer = createReducer(
  {
    loginState: ELoginState.idle,
    tokenExpired: false,
    isLoggedin: false,
  } as IUserState,
  builder => {
    builder
      .addCase(loginToken.pending, state => {
        state.loginState = ELoginState.pending;
        state.isLoggedin = false;
      })
      .addCase(loginToken.fulfilled, (state, action) => {
        state.loginState = ELoginState.success;
        state.tokenExpired = false;
        state.isLoggedin = true;
      })
      .addCase(loginToken.rejected, state => {
        state.loginState = ELoginState.idle;
        state.tokenExpired = true;
        state.isLoggedin = false;
      })
      .addCase(loginPassword.fulfilled, (state, action) => {
        state.loginState = ELoginState.success;
        state.tokenExpired = false;
        state.isLoggedin = true;
      })
      .addCase(loginPassword.pending, state => {
        state.loginState = ELoginState.pending;
      })
      .addCase(loginPassword.rejected, state => {
        state.loginState = ELoginState.error;
        state.isLoggedin = false;
      })
      .addCase(logout, state => {
        state.loginState = ELoginState.idle;
        state.tokenExpired = true;
        state.isLoggedin = false;
      });
  },
);

export default userReducer;
