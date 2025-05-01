import { createSlice } from "@reduxjs/toolkit";

const initState = {
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.authenticatedUser
            state.token = action.payload.token
        },
        logout: (state) => {
            state.user = null
            state.token = null
        },
        updateToken: (state, action) => {
            state.token = action.payload
        },
        updateUsername: (state, action) => {
            state.user.username = action.payload
        },
        updateProfileImage: (state, action) => {
            state.user.profileImage = action.payload
        },
        updateUserPhone: (state, action) => {
            state.user.phone = action.payload
        },
        updateUserAbout: (state, action) => {
            state.user.about = action.payload
        }
    }
})

export const userState = (state) => state.auth?.user
export const tokenState = (state) => state.auth?.token

export const { 
    login, 
    logout, 
    updateToken, 
    updateUsername, 
    updateUserPhone, 
    updateUserAbout,
    updateProfileImage
} = authSlice.actions

export default authSlice.reducer