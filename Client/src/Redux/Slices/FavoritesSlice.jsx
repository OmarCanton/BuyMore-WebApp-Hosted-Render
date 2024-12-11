import { createSlice } from "@reduxjs/toolkit";

const initState = {
    favs: JSON.parse(localStorage.getItem('favorites')) || [],
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: initState,
    reducers: {
        addToFavorites: (state, action) => {
            const fav = action.payload
            state.favs.push(fav)
            localStorage.setItem('favorites', JSON.stringify(state.favs))
        },
        removeFromFavorites: (state, action) => {
            const item = action.payload
            const findItem = state.favs.find(fav => fav._id === item._id)
            if(findItem) {
                state.favs = state.favs.filter(fav => fav._id !== item._id)
                localStorage.setItem('favorites', JSON.stringify(state.favs))
            }
        },
        removeAll: (state) => {
            state.favs.splice(0, state.favs.length)
            localStorage.setItem('favorites', JSON.stringify(state.favs))
        },
        getFavoritesFromLocalStorage: (state) => {
            const favItemsFromLocalStorage = JSON.parse(localStorage.getItem('favorites'))
            if(favItemsFromLocalStorage) {
                state.favs = favItemsFromLocalStorage
            } 
        }
    }
})


export const favoriteItems = (state) => state.favorites.favs

export const { addToFavorites, removeFromFavorites, getFavoritesFromLocalStorage, removeAll } = favoritesSlice.actions
export default favoritesSlice.reducer