import  { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (pageNumber) => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/products?page=${pageNumber}`)
    return response.data
})
export const fetchNewArrivals = createAsyncThunk('products/fetchNewArrivals', async () => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/newArrivals`)
    return response.data.newArrivals
})
export const fetchComments = createAsyncThunk('products/fetchComments', async (productId) => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/getComments/${productId}`)
    return response.data.comments

})
export const fetchSearchedProducts = createAsyncThunk('products/fetchSearchedProducts', async (name) => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/search?name=${name}`)
    return response.data

})
export const fetchFilteredProduct = createAsyncThunk('products/fetchFilteredProduct', async (filterKey) => {
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/filter?filterKey=${filterKey}`)
    return response.data.filteredResults

})

const initState = {
    items: [],
    totalNumPages: null,
    isSearch: false,
    isFiltered: false,
    searchedName: null,
    newArrivalsItems: [],
    productsComments: [],
    status: 'idle',
    error: null
}

const productsSlice = createSlice({
    name: 'products',
    initialState: initState,
    reducers: {
        removeCommentsAfterUnmount: (state) => {
            state.productsComments.splice(0, state.productsComments.length)
        }
    },
    extraReducers: (builder) => {
        builder
        //fulfilled
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.items = action.payload.products
            state.totalNumPages = action.payload.totalPages
            state.isSearch = false
            state.isFiltered = false
        })
        .addCase(fetchNewArrivals.fulfilled, (state, action) => {
            state.newArrivalsItems = action.payload
        })
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.productsComments = action.payload
        })   
        .addCase(fetchSearchedProducts.fulfilled, (state, action) => {
            state.items = action.payload.searchResults
            state.searchedName = action.payload.name
            state.isSearch = true
        })   
        .addCase(fetchFilteredProduct.fulfilled, (state, action) => {
            state.items = action.payload
            state.isFiltered = true
        })   
        //any pending
        .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
            state.status = 'succeeded'
            console.log('from success:: ', state.status)
        })
        .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
            state.status = 'loading'
            state.isSearch = false
            state.error = null
            console.log('from pending:: ', state.status)
        })
        //any rejected
        .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            console.log('from failed:: ',state.status)
        } )
                
    }
})


export const selectProducts = (state)  => state.products.items
export const totalNumberOfProductsPages = (state)  => state.products.totalNumPages
export const selectNewArrivals = (state)  => state.products.newArrivalsItems
export const productComments = (state)  => state.products.productsComments
export const selectProductsStatus = (state)  => state.products.status
export const selectProductsError = (state)  => state.products.error
export const searchedName = (state)  => state.products.searchedName
export const isSearch = (state)  => state.products.isSearch
export const isFiltered = (state)  => state.products.isFiltered

// Note: state.products.items :::: (state) represents the entire state in the store no the above slice
// :::: (products) represents the slice we want to reference
//::::  (items) represents the array or the state in  the slice(products slice)

//so if want to import the products fetched, I can say, 
// go into the entire state object of the app, 
// navigate to part/slice of the state called products 
// and export the object over there (in this case an array called items)
export const { removeCommentsAfterUnmount } = productsSlice.actions
export default productsSlice.reducer 
