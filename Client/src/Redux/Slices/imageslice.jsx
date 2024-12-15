import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfileImage = createAsyncThunk('profileImage/fetchProfileImage', async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/getProfilePicture/${id}`)
    return response.data
})

const initState = {
    image: null,
    loading: false,
    error: null
}

const imageSlice = createSlice({
    name: 'profileImage',
    initialState: initState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchProfileImage.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchProfileImage.fulfilled, (state, action) => {
            state.loading = false
            state.image = action.payload
        })
        .addCase(fetchProfileImage.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const selectUserProfileImage = (state) => state.profileImage.image
export const selectImageLoading = (state) => state.profileImage.loading
export const selectImageError = (state) => state.profileImage.error

export default imageSlice.reducer