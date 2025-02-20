/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './auth-api';
import { userManagementApi } from './user-management-api';
import { blogsApi } from './blogs-api';
import { userConfirmApi } from './user/confirm-api';
import { userProfileApi } from './user-profile-api';
import { forgetPasswordApi } from './user/password/forgot-password-api';
import { resetApi } from './user/password/reset-api';
import { userApi } from './user-api';
import { messagesApi } from './messages-Api';
import { testimonialApi } from './testimonial-api';


export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer here
    [authApi.reducerPath]: authApi.reducer,
    [userManagementApi.reducerPath]: userManagementApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [userConfirmApi.reducerPath]: userConfirmApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [forgetPasswordApi.reducerPath]: forgetPasswordApi.reducer,
    [resetApi.reducerPath]: resetApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [testimonialApi.reducerPath]: testimonialApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware).concat(userManagementApi.middleware).concat(blogsApi.middleware).concat(userConfirmApi.middleware).concat(userProfileApi.middleware).concat(userManagementApi.middleware).concat(forgetPasswordApi.middleware).concat(resetApi.middleware).concat(messagesApi.middleware).concat(testimonialApi.middleware),
});

// Optional: Set up listeners for automatic cache management
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
