import  { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../Slices/productsSlice'
import imageReducer from '../Slices/imageslice'
import wishlistReducer from '../Slices/WishlistSlice'
import favoritesReducer from '../Slices/FavoritesSlice'

const store = configureStore({
    reducer: {
        products: productsReducer,
        profileImage: imageReducer,
        wishlist: wishlistReducer,
        favorites: favoritesReducer
    }
})
export default store