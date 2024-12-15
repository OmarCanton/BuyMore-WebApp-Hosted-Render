import { useEffect, useContext } from "react"
import { userDetailsContext } from "../Contexts/userDataContext"
import { useDispatch, useSelector } from "react-redux"
import { 
    fetchAppleFeaturedProducts, 
    fetchNikeFeaturedProducts, 
    fetchSamsungFeaturedProducts,
    fetchLouisVuittonFeaturedProducts,
    selectAppleFeaturedProducts,
    selectNikeFeaturedProducts,
    selectSamsungFeaturedProducts,
    selectLouisVuittonFeaturedProducts,
    selectProductsStatus 
} from "../Redux/Slices/productsSlice"
import '../Styles/FeaturedProducts.css'
import { useNavigate } from "react-router-dom"
import { FavoriteBorderRounded, Apple, FavoriteRounded, AddShoppingCart, Verified } from '@mui/icons-material'
import LoadingEffect from '../Effects/LoadingEffect'
import { addToCart } from "../Redux/Slices/WishlistSlice"
import { addToFavorites, favoriteItems, removeFromFavorites } from "../Redux/Slices/FavoritesSlice"
import { toast } from 'react-hot-toast'
import { themesContext } from "../Contexts/userDataContext"

export default function FeaturedProducts () {
    const dispatch = useDispatch()
    const appleFeaturedProducts = useSelector(selectAppleFeaturedProducts)
    const nikeFeaturedProducts = useSelector(selectNikeFeaturedProducts)
    const samsungFeaturedProducts = useSelector(selectSamsungFeaturedProducts)
    const louisVuittonFeaturedProducts = useSelector(selectLouisVuittonFeaturedProducts)
    const status = useSelector(selectProductsStatus)
    const favorites = useSelector(favoriteItems)
    const navigate = useNavigate()
    const { isLoggedIn } = useContext(userDetailsContext)
    const { theme, themeStyles } = useContext(themesContext)

    
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

    useEffect(() => {
        dispatch(fetchAppleFeaturedProducts()) 
        dispatch(fetchNikeFeaturedProducts()) 
        dispatch(fetchSamsungFeaturedProducts()) 
        dispatch(fetchLouisVuittonFeaturedProducts()) 
        //dispatch the fetchProduct function which has its action and payload 
        // its action is the first argument of the createAsyncThunk and the payload is the response returned from the axios fetch
    }, [dispatch])

    const checkProduct = (product) => {
        navigate(`/product/${product._id}`, { state: { product } })
    }
    
    const buttonHandler = (event) => {
        event.stopPropagation()
    }
    const addItemTocart = (item) => {
        if(isLoggedIn) {
            dispatch(addToCart(item))
            toast.success(`${item.name} added to wishlist`, {
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
        <>
        
            { (status === 'loading' || status === 'failed') && 
                <p className="loadingWrapper">
                    <LoadingEffect />
                </p> 
            }
            { (status === 'succeeded') && (

                <div className="featuredProductsWrapper" 
                    style={{backgroundColor: themeStyles.style.backgroundColor}}
                >
                    <div className="apple">
                        <h2 
                            style={{color: themeStyles.style.color}}
                        >FROM APPLE <Apple fontSize="large" /><Verified style={{color: 'lightgrey'}} /></h2>
                        <div className="container">
                            {
                                appleFeaturedProducts.length === 0 ? <div style={{padding: '50px'}}>Oops no product found at this time!</div>
                                :
                                appleFeaturedProducts.map(product => (
                                    <div
                                        className='featuredWrapper' 
                                        key={product._id} 
                                        onClick={ () => checkProduct(product)}
                                        style={{backgroundColor: themeStyles.style.divColor}}
                                    >
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            style={{...theme === 'dark' && {backgroundColor: 'white', border: 'none'}}} 
                                        />
                                        <p className='productName'
                                            style={{color: themeStyles.style.color}}
                                        >{product.name}</p>
                                        <div className='prices' 
                                            style={{...theme === 'dark' && {color: 'lightgrey'}}}
                                        >
                                            <p className="actualPrice">${product.actualPrice}</p>
                                            <p className="prevPrice"><s>${product.prevPrice}</s></p>
                                        </div>
                                        <div className="categoryBrand">
                                            <p className="category">{product.category}</p>
                                            <p className="brand">{product.brand}</p>
                                        </div>
                                        <div className='addToCartFav' onClick={buttonHandler}>
                                            <AddShoppingCart onClick={() => addItemTocart(product)} className="addICart" htmlColor="#C33764"/>
                                            <button onClick={() => addItemTocart(product)} >Add To Wishlist</button>
                                            <span style={{color: themeStyles.style.color}} onClick={() => addItemToFavorites(product)}>
                                                { isFav(product) }
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="nike">
                        <h2 
                            style={{color: themeStyles.style.color}}
                        >FROM NIKE <Verified style={{color: 'lightgrey'}} /></h2>
                        <div className="container">
                        {
                            nikeFeaturedProducts.length === 0 ? <div style={{padding: '50px'}}>Oops no product found at this time!</div>
                            :
                            nikeFeaturedProducts.map(product => (
                                <div 
                                    className='featuredWrapper' 
                                    key={product._id} 
                                    onClick={ () => checkProduct(product)}
                                    style={{backgroundColor: themeStyles.style.divColor}}
                                >
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className='productImage' 
                                        style={{...theme === 'dark' && {backgroundColor: 'white', border: 'none'}}}
                                    />
                                    <p className='productName' 
                                        style={{color: themeStyles.style.color}}
                                    >{product.name}</p>
                                    <div className='prices' 
                                        style={{...theme === 'dark' && {color: 'lightgrey'}}}
                                    >
                                        <p className="actualPrice">${product.actualPrice}</p>
                                        <p className="prevPrice"><s>${product.prevPrice}</s></p>
                                    </div>
                                    <div className="categoryBrand">
                                        <p className="category">{product.category}</p>
                                        <p className="brand">{product.brand}</p>
                                    </div>
                                    <div className='addToCartFav' onClick={buttonHandler}>
                                        <AddShoppingCart onClick={() => addItemTocart(product)} className="addICart" htmlColor="#C33764"/>    
                                        <button onClick={() => addItemTocart(product)} >Add To Wishlist</button>
                                        <span style={{color: themeStyles.style.color}} onClick={() => addItemToFavorites(product)}>
                                        { isFav(product) }
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className="samsung">
                        <h2 
                            style={{color: themeStyles.style.color}}
                        >FROM SAMSUNG <Verified style={{color: 'lightgrey'}} /></h2>
                        <div className="container">
                        {
                            samsungFeaturedProducts.length === 0 ? <div style={{padding: '50px'}}>Oops no product found at this time!</div>
                            :
                            samsungFeaturedProducts.map(product => (
                                <div 
                                    className='featuredWrapper' 
                                    key={product._id} 
                                    onClick={ () => checkProduct(product)}
                                    style={{backgroundColor: themeStyles.style.divColor}}
                                >
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className='productImage' 
                                        style={{...theme === 'dark' && {backgroundColor: 'white', border: 'none'}}}
                                    />
                                    <p className='productName' 
                                        style={{color: themeStyles.style.color}}
                                    >{product.name}</p>
                                    <div className='prices' 
                                        style={{...theme === 'dark' && {color: 'lightgrey'}}}
                                    >
                                        <p className="actualPrice">${product.actualPrice}</p>
                                        <p className="prevPrice"><s>${product.prevPrice}</s></p>
                                    </div>
                                    <div className="categoryBrand">
                                        <p className="category">{product.category}</p>
                                        <p className="brand">{product.brand}</p>
                                    </div>
                                    <div className='addToCartFav' onClick={buttonHandler}>
                                        <AddShoppingCart onClick={() => addItemTocart(product)} className="addICart" htmlColor="#C33764"/>
                                        <button onClick={() => addItemTocart(product)} >Add To Wishlist</button>
                                        <span style={{color: themeStyles.style.color}} onClick={() => addItemToFavorites(product)}>
                                        { isFav(product) }
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className="louisVuitton">
                        <h2 
                            style={{color: themeStyles.style.color}}
                        >FROM LOUIS VUITTON <Verified style={{color: 'lightgrey'}} /></h2>
                        <div className="container">
                            {
                                louisVuittonFeaturedProducts.length === 0 ? <div style={{padding: '50px'}}>Oops no product found at this time!</div>
                                :
                                louisVuittonFeaturedProducts.map(product => (
                                    <div 
                                        className='featuredWrapper' 
                                        key={product._id} 
                                        onClick={() => checkProduct(product)}
                                        style={{backgroundColor: themeStyles.style.divColor}}
                                    >
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className='productImage' 
                                            style={{...theme === 'dark' && {backgroundColor: 'white', border: 'none'}}}
                                        />
                                        <p className='productName' 
                                            style={{color: themeStyles.style.color}}
                                        >{product.name}</p>
                                        <div className='prices' 
                                            style={{...theme === 'dark' && {color: 'lightgrey'}}}
                                        >
                                            <p className="actualPrice">${product.actualPrice}</p>
                                            <p className="prevPrice"><s>${product.prevPrice}</s></p>
                                        </div>
                                        <div className="categoryBrand">
                                            <p className="category">{product.category}</p>
                                            <p className="brand">{product.brand}</p>
                                        </div>
                                        <div className='addToCartFav' onClick={buttonHandler}>
                                            <AddShoppingCart onClick={() => addItemTocart(product)} className="addICart" htmlColor="#C33764"/>
                                            <button onClick={() => addItemTocart(product)} >Add To Wishlist</button>
                                            <span style={{color: themeStyles.style.color}} onClick={() => addItemToFavorites(product)}>
                                            { isFav(product) }
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
            {
                (
                    status === 'succeeded' &&
                    appleFeaturedProducts.length === 0 && 
                    nikeFeaturedProducts.length === 0 &&
                    samsungFeaturedProducts.length === 0
                ) && <div style={{color: theme === 'dark' && 'white', padding: '40px'}}>Oops, no products found at this time!</div>
            }
        </>
    )
}