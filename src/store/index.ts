import {TypedUseSelectorHook, useDispatch as _useDispatch, useSelector as _useSelector} from 'react-redux';

import session from './session';
import {configureStore} from '@reduxjs/toolkit';

export * from './session';

export const reduxStore = configureStore({
  reducer: session,
});

export const useDispatch = () => _useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;
