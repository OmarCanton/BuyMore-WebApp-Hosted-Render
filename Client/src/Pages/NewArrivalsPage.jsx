import { useContext } from "react"
import { userDetailsContext, themesContext } from "../Contexts/userDataContext"
import { useNavigate } from "react-router-dom"
import Panel from "../Components/Panel"
import { useLocation } from "react-router-dom"
import '../Styles/NewArr.css'
import { ArrowBackIosNewRounded, FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material'
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../Redux/Slices/WishlistSlice"
import { addToFavorites, favoriteItems, removeFromFavorites } from "../Redux/Slices/FavoritesSlice"
import { Button } from "@mui/material"


export default function NewArrivalsPage () {
    const { isLoggedIn } = useContext(userDetailsContext)
    const { theme, themeStyles } = useContext(themesContext)
    const location = useLocation()
    const dispatch = useDispatch()
    const { newArrivals } = location.state || {}
    const navigate = useNavigate()
    const favorites = useSelector(favoriteItems)
    
    //favorite feature
    const isFav = (item) => { 
        const isfav = favorites.some(favorite => favorite._id === item._id)
        //if item is found return isfav as true else false (i.e is the use of some() method)
        if(isfav) {
            return(
                <FavoriteRounded htmlColor="red" className='fav' style={{cursor: 'pointer'}} /> 
            )
        }else {
            return (
                <FavoriteBorderRounded className='fav' style={{cursor: 'pointer'}} />
            )
        }
    }
    const addItemToFavorites = (item) => {
        if(isLoggedIn) {
            const isFavorite = favorites.some(favorite => favorite._id === item._id)
            if(isFavorite) {
                dispatch(removeFromFavorites(item))
            } else {
                dispatch(addToFavorites(item))
            }
        } else {
            toast.error(`Please log into your account to add items to your Favorites`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                }
            })
        }
    }
    //end



    const buttonHandler = (event) => {
        event.stopPropagation()
    }

    const checkProduct = (product) => {
        navigate(`/product/${product._id}`, { state: { product: product } })
    }

    const addToWishlist = (product) => {
        if(isLoggedIn) {
            dispatch(addToCart(product))
            toast.success(`${product.name} added to wishlist`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                }
            })
        } else {
            toast.error(`Please log into your account to add items to your wishlist`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                }
            })
        }
    }


    return (
        <div
            className="newArr-mainWrapper"
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}} 
                
        >
            <div 
                style={{...theme === 'dark' && {backgroundColor: themeStyles.backgroundColor}}} 
                className='header-newArr'>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span 
                    className="title" 
                    style={{color: themeStyles.style.color}}
                >New Arrivals</span>
            </div>
            <div 
                style={{
                    color: themeStyles.style.color, 
                    backgroundColor: themeStyles.style.backgroundColor, 
                }} 
                className="productsWrapper-newArr"
            >
            {newArrivals && newArrivals.map((product) => (
                <div 
                    style={{backgroundColor: themeStyles.style.divColor}}
                    className='wrapper-newArr' 
                    key={product._id} 
                    onClick={ () => checkProduct(product)}
                >
                    <img 
                        style={{backgroundColor: themeStyles.style.color, border: 'none'}}
                        src={product.image} 
                        alt={product.name} 
                        className='productImage'
                    />
                    <p 
                        style={{color: themeStyles.style.color}}
                        className='productName'
                    >{product.name}</p>
                    <div className='prices' style={{...theme === 'dark' && {color: 'lightgrey'}}}>
                        <p className="actualPrice">${product.actualPrice}</p>
                        <p className="prevPrice"><s>${product.prevPrice}</s></p>
                    </div>
                    <div className="categoryBrand">
                        <p className="category">{product.category}</p>
                        <p className="brand">{product.brand}</p>
                    </div>
                    <div className='addToCartFav' onClick={buttonHandler}>
                        <button onClick={() => addToWishlist(product)}>Add To Wishlist</button>
                        <span onClick={() => addItemToFavorites(product)}>
                            { isFav(product) }
                        </span>
                    </div>
                </div>
                ))}
                <Panel />
            </div>
        </div>
    )
}