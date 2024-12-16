import { useContext, useEffect } from "react"
import { userDetailsContext, themesContext } from "../Contexts/userDataContext"
import { useNavigate, Link } from "react-router-dom"
import Panel from "../Components/Panel"
import '../Styles/NewArr.css'
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../Redux/Slices/WishlistSlice"
import { favoriteItems, getFavoritesFromLocalStorage, removeAll } from "../Redux/Slices/FavoritesSlice"
import { Button } from "@mui/material"
import { ArrowBackIosNewRounded } from "@mui/icons-material"
import { motion } from 'framer-motion'
import Lottie from "lottie-react"
import EmptyCart_Fav from '../Effects/EmptyCart_Fav.json'
import LoginAnime from '../Effects/LoginAnime.json'

export default function NewArrivalsPage () {
    const { isLoggedIn } = useContext(userDetailsContext)
    const dispatch = useDispatch()
    const favorites = useSelector(favoriteItems)
    const navigate = useNavigate()
    const {theme, themeStyles} = useContext(themesContext)

    useEffect(() => {
        dispatch(getFavoritesFromLocalStorage())
    }, [dispatch])

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

    const msg = () => {
        if(isLoggedIn) {
            return (
                <motion.span 
                    initial={{y: '10vh', opacity: 0}} 
                    animate={{y: 0, opacity: 1}}
                    exit={{y: '10vh', opacity: 0, transition: {
                        delay: 0.2
                    }}}
                    transition={{delay: 0.2, duration: 0.15, ease: 'anticipate'}}
                    className="noItem" 
                    style={{color: themeStyles.style.color}}
                >
                    <Lottie className="anime" loop={true} animationData={EmptyCart_Fav} />
                </motion.span>
            )
        } else {
            return (
                <motion.div 
                    className="noItem-Login-Container"
                    initial={{y: '10vh', opacity: 0}} 
                    animate={{y: 0, opacity: 1}}
                    exit={{y: '10vh', opacity: 0, transition: {
                        delay: 0.2
                    }}}
                    transition={{delay: 0.2, duration: 0.15, ease: 'anticipate'}}
                >
                    <span className="noItem">
                        <Lottie className="anime" loop={true} animationData={LoginAnime} />
                    </span>
                    <Link to='/login'>
                        <button>Login</button>
                    </Link>
                </motion.div>
            )
        }
    }


    return (
        <div className="favs-mainWrapper" 
            style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <motion.div 
                className='header-favs'
                initial={{y: '-10vh', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: '-10vh', opacity: 0}}
                transition={{duration: 0.2}}
            >
                <Button className="back" style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span className="title" 
                    style={{color: themeStyles.style.color}}
                >Favorites</span>
                {favorites.length > 0 && 
                    <Button className="clearAll" onClick={() => dispatch(removeAll())}>Clear</Button>
                }
            </motion.div>
            <div className="productsWrapper-favs" 
                style={{ 
                    color: themeStyles.style.color, 
                    backgroundColor: themeStyles.style.backgroundColor,
                    ...favorites.length < 1 && {height: '100vh'}
                }}
            >
                {favorites && favorites.length === 0 ?
                    msg()
                    : favorites.map((product) => (
                        <motion.div 
                            initial={{y: '10%', opacity: 0}}
                            animate={{y:0, opacity: 1}}
                            exit={{y: '10%', opacity: 0, transition: {
                                delay: 0.2
                            }}}
                            transition={{delay: 0.15, duration: 0.3, ease: 'anticipate'}}
                            style={{backgroundColor: themeStyles.style.divColor}} 
                            className='wrapper-favs' key={product._id} 
                            onClick={ () => checkProduct(product)}
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
                                <button onClick={() => addToWishlist(product)}>Add To Wishlist</button>
                            </div>
                        </motion.div>
                    ))
                }
                <Panel />
            </div>
        </div>
    )
}