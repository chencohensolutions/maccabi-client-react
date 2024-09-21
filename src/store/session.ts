import { createAction, createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import api, { IUserAssoc } from '../services/api';


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
  userId: string | null;
  userName: string | null;
  users: IUserAssoc | null;
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
    userId: null,
    userName: null,
    users: null,
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
        state.userName = action.payload?.userName || null;
        state.userId = action.payload?.id || null;
        state.users = action.payload?.users || null;
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
        state.userId = action.payload?.id || null;
        state.userName = action.payload?.userName || null;
        state.users = action.payload?.users || null;
      })
      .addCase(loginPassword.pending, state => {
        state.loginState = ELoginState.pending;
      })
      .addCase(loginPassword.rejected, state => {
        state.loginState = ELoginState.error;
        state.isLoggedin = false;
        state.userId = null;
      })
      .addCase(logout, state => {
        state.loginState = ELoginState.idle;
        state.tokenExpired = true;
        state.isLoggedin = false;
        state.userId = null;
        state.userName = null;
      });
  },
);

export default userReducer;
