// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'

// const initState = {
//     recommended_items: [],
//     error: null
// }

// export const fetchRecommendations = createAsyncThunk('recommendations/fetchRecommendations', async (id, { rejectWithValue }) => {
//     try {
//     } catch(err) {
//         rejectWithValue(err?.response?.data?.message || err?.message)
//     }
// })

// const recommendationSlice = createSlice({
//     name: 'recommendations',
//     initialState: initState,
//     extraReducers: (builder) => {
//         builder
//         .addCase(fetchRecommendations.pending, (state) => {
//             state.recommended_items = []
//             state.error = null
//         })
//         .addCase(fetchRecommendations.fulfilled, (state, action) => {
//             state.recommended_items = action.payload
//         })
//         .addCase(fetchRecommendations.rejected, (state, action) => {
//             state.recommended_items = []
//             state.error = action.payload
//         })
//     }
// })

// export const recommendedItems = (state) => state.recommendations.recommended_items

// export default recommendationSlice.reducer