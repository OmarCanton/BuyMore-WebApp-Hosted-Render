import { createSlice } from "@reduxjs/toolkit";

const initState = {
    sessionId: null
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState: initState,
    reducers: {
        updateSessionId: (state, action) => {
            console.log('Payload: ', action.payload)
            state.sessionId = action.payload
            console.log(state.sessionId)
        },
    }
})


export const sessionId = (state) => state.payment.sessionId
export const { updateSessionId } = paymentSlice.actions

export default paymentSlice.reducer