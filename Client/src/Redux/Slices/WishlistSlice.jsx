import { createSlice } from "@reduxjs/toolkit";

const initState = {
    items: JSON.parse(localStorage.getItem('wishlist')) || [],
    totalQuantity: 0,
    totalPrice: 0
}

const addToCartSlice = createSlice({
    name: 'wishlist',
    initialState: initState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload
            // console.log(newItem? JSON.parse(JSON.stringify(newItem)) : 'no new item')
            const existingItem = state.items.find(item => item._id === newItem._id)
            // console.log(existingItem? JSON.parse(JSON.stringify(existingItem)) : 'no existing item')

            if(existingItem) {
                existingItem.quantity += 1
                existingItem.totalItemPrice += newItem.actualPrice     
            } else {
                state.items.push({
                    ...newItem, 
                    quantity: 1, 
                    totalItemPrice: newItem.actualPrice
                })
            }
            state.totalQuantity += 1
            state.totalPrice += newItem.actualPrice
            localStorage.setItem('wishlist', JSON.stringify(state.items))
            localStorage.setItem('wishlistTotalQuantity', JSON.stringify(state.totalQuantity))
            localStorage.setItem('wishlistTotalPrice', JSON.stringify(state.totalPrice))
            // console.log(state.items.length? JSON.parse(JSON.stringify(state.items)) : 'empty cart')
        },
        removeFromCart: (state, action) => {
            const id = action.payload
            const itemToRemove = state.items.find(item => item._id === id)
            if (itemToRemove) {
                state.totalQuantity -= itemToRemove.quantity
                state.totalPrice -= itemToRemove.totalItemPrice
                //Delete item out by filtering
                state.items = state.items.filter(item => item._id !== id)
                // console.log(state.items.length? JSON.parse(JSON.stringify(state.items)) : 'empty cart')
                localStorage.setItem('wishlist', JSON.stringify(state.items))
                localStorage.setItem('wishlistTotalQuantity', JSON.stringify(state.totalQuantity))
                localStorage.setItem('wishlistTotalPrice', JSON.stringify(state.totalPrice))
            } 
        },
        updateQuantity: (state, action) => {
            //get the id and the quantity you want to set for the item by destructuring
            const {id, quantity} = action.payload
            //find the item by comparing the id from the selected item and the items in the redux store
            const cartItem = state.items.find(item => item._id === id)
            //check if the item exists and the quantity you want to set is greater than zero 
            //Note: Quantity should be greater than zero because if its zero, nothing will be added
            if(cartItem && quantity > 0) {
                //The total quantity in the store now is the addition of the current store total quantity
                //and the difference bewtween the newly set quantity and the already set quantity of the item
                //assuming the total qunatity of items is 10, and item1 is 2 and you want to set item to 6
                //that means item1 will increase from 2 to 6 with a difference of 4 and that 4 must be added to the total quantity
                state.totalQuantity += (quantity - cartItem.quantity)
                //same logic for the price
                state.totalPrice += (quantity - cartItem.quantity) * cartItem.actualPrice

                //now the quantity of the item is set as the quantity chosen
                cartItem.quantity = quantity
                //same for price too
                cartItem.totalItemPrice = quantity * cartItem.actualPrice
                localStorage.setItem('wishlist', JSON.stringify(state.items))
                localStorage.setItem('wishlistTotalQuantity', JSON.stringify(state.totalQuantity))
                localStorage.setItem('wishlistTotalPrice', JSON.stringify(state.totalPrice))
            }
        },
        removeAll: (state) => {
            state.items.splice(0, state.items.length)
            state.totalQuantity = 0
            state.totalPrice = 0
            localStorage.removeItem('wishlist')
            localStorage.removeItem('wishlistTotalQuantity')
            localStorage.removeItem('wishlistTotalPrice')
        },
        getWishlistFromLocalStorage: (state) => {
            const getItemsFromLocalStorage = JSON.parse(localStorage.getItem('wishlist'))
            const getItemsQuantityFromLocalStorage = JSON.parse(localStorage.getItem('wishlistTotalQuantity'))
            const getItemsTotalPriceFromLocalStorage = JSON.parse(localStorage.getItem('wishlistTotalPrice'))
            if(getItemsFromLocalStorage && getItemsQuantityFromLocalStorage && getItemsTotalPriceFromLocalStorage) {
                state.items = getItemsFromLocalStorage
                state.totalQuantity = getItemsQuantityFromLocalStorage
                state.totalPrice = getItemsTotalPriceFromLocalStorage
            }

        }
    } 
})

export const listItems = (state) => state.wishlist.items
export const totalQuantity = (state) => state.wishlist.totalQuantity
export const totalPrice = (state) => state.wishlist.totalPrice
export const { 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    removeAll, 
    getWishlistFromLocalStorage 
} = addToCartSlice.actions
export default addToCartSlice.reducer