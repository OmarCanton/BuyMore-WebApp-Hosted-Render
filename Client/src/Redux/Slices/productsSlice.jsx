import  { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (pageNumber) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/products?page=${pageNumber}`)
    return response.data
})
export const fetchNewArrivals = createAsyncThunk('products/fetchNewArrivals', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/newArrivals`)
    return response.data.newArrivals
})
export const fetchAppleFeaturedProducts = createAsyncThunk('products/fetchAppleFeaturedProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/appleFeaturedProducts`)
    return response.data.featuredProducts
})
export const fetchNikeFeaturedProducts = createAsyncThunk('products/fetchNikeFeaturedProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/nikeFeaturedProducts`)
    return response.data.featuredProducts
})
export const fetchSamsungFeaturedProducts = createAsyncThunk('products/fetchSamsungFeaturedProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/samsungFeaturedProducts`)
    return response.data.featuredProducts
})
export const fetchLouisVuittonFeaturedProducts = createAsyncThunk('products/fetchLouisVuittonFeaturedProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/luisVuittonFeaturedProducts`)
    return response.data.featuredProducts
})
export const fetchComments = createAsyncThunk('products/fetchComments', async (productId) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/getComments/${productId}`)
    return response.data.comments

})
export const fetchSearchedProducts = createAsyncThunk('products/fetchSearchedProducts', async (name) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/search?name=${name}`)
    return response.data

})
export const fetchFilteredProduct = createAsyncThunk('products/fetchFilteredProduct', async (filterKey) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
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
    appleFeaturedProducts: [],
    nikeFeaturedProducts: [],
    samsungFeaturedProducts: [],
    louisVuittonFeaturedProducts: [],
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
            state.status = 'succeeded'
            state.items = action.payload.products
            state.totalNumPages = action.payload.totalPages
            state.isSearch = false
            state.isFiltered = false
        })
        .addCase(fetchNewArrivals.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.newArrivalsItems = action.payload
        })
        .addCase(fetchAppleFeaturedProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.appleFeaturedProducts = action.payload
        })
        .addCase(fetchNikeFeaturedProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.nikeFeaturedProducts = action.payload
        })
        .addCase(fetchSamsungFeaturedProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.samsungFeaturedProducts = action.payload
        })
        .addCase(fetchLouisVuittonFeaturedProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.louisVuittonFeaturedProducts = action.payload
        })
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.productsComments = action.payload
        })   
        .addCase(fetchSearchedProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload.searchResults
            state.searchedName = action.payload.name
            state.isSearch = true
        })   
        .addCase(fetchFilteredProduct.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload
            state.isFiltered = true
        })   
        //any pending
        .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
            state.status = 'loading'
            state.isSearch = false
            state.error = null
        })
        //any rejected
        .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        } )
                
    }
})


export const selectProducts = (state)  => state.products.items
export const totalNumberOfProductsPages = (state)  => state.products.totalNumPages
export const selectAppleFeaturedProducts = (state)  => state.products.appleFeaturedProducts
export const selectNikeFeaturedProducts = (state)  => state.products.nikeFeaturedProducts
export const selectSamsungFeaturedProducts = (state)  => state.products.samsungFeaturedProducts
export const selectLouisVuittonFeaturedProducts = (state)  => state.products.louisVuittonFeaturedProducts
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
