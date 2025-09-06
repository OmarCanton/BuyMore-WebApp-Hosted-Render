import  { configureStore, combineReducers } from '@reduxjs/toolkit'
import productsReducer from '../Slices/productsSlice'
import wishlistReducer from '../Slices/WishlistSlice'
import favoritesReducer from '../Slices/FavoritesSlice'
import authReducer from '../Slices/authSlice'
import paymentReducer from '../Slices/paymentSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import recommendationsReducer from '../Slices/recommendations'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'] //add slices to persist here
}
const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    favorites: favoritesReducer,
    payment: paymentReducer
    // recommendations: recommendationsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store)