import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('user');
const initialState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    isAuthenticated: !!userFromStorage
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        },
    },
});
export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;