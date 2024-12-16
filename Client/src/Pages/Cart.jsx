import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Panel from "../Components/Panel";
import '../Styles/Cart.css'
import { Button, CircularProgress } from "@mui/material";
import { ArrowBackIosNewRounded, Delete, DeleteForever } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { 
    getWishlistFromLocalStorage, 
    updateQuantity, 
    listItems, 
    totalQuantity, 
    totalPrice, 
    removeFromCart, 
    removeAll
} from "../Redux/Slices/WishlistSlice";
import { userDetailsContext, themesContext } from "../Contexts/userDataContext";
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import EmptyCart_Fav from '../Effects/EmptyCart_Fav.json'
import LoginAnime from '../Effects/LoginAnime.json'

export default function Cart () {
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [canRedirectToCheckout, setCanRedirectToCheckout] = useState(true)
    const dispatch = useDispatch()
    const items = useSelector(listItems)
    const totalCartQuantity = useSelector(totalQuantity)
    const totalCartPrice = useSelector(totalPrice)
    const navigate = useNavigate()
    const {user_username, isLoggedIn, userId} = useContext(userDetailsContext)
    const {theme, themeStyles} = useContext(themesContext)

    useEffect(() => {
        dispatch(getWishlistFromLocalStorage())
    }, [dispatch])


    const removeItem = (id) => {
        if(isLoggedIn) {
            dispatch(removeFromCart(id))
        } else {
            toast.error(`Cannot manipulate wishlist, please login`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        }
    }
    const clearAll = () => {
        if(isLoggedIn) {
            dispatch(removeAll())
        } else {
            toast.error(`Cannot manipulate wishlist, please login`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
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
                    initial={{y: '10vh', opacity: 0}} 
                    animate={{y: 0, opacity: 1}}
                    exit={{y: '10vh', opacity: 0, transition: {
                        delay: 0.2
                    }}}
                    transition={{delay: 0.2, duration: 0.15, ease: 'anticipate'}}
                    className="noItem-Login-Container" 
                    style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
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

    
    //Payment
    const handlePayment = async () => {
        setLoadingPayment(true)
        if(isLoggedIn) {
            if(canRedirectToCheckout) {
                const StripePromise = loadStripe(import.meta.env.VITE_LOADSTRIPE_KEY)
                try {
                    const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/checkout`, {items, userId}, {withCredentials: true})
                    const { id: sessionId } = response.data
                    const stripe = await StripePromise
                    stripe.redirectToCheckout({sessionId}) 
                } catch(err) {
                    toast.error(err, {
                        style: {
                            backgroundColor: 'black',
                            color: 'white'
                        }
                    })
                }
            }

            //HALT THE PROCESS AFTER 15 SECONDS OF NO RESPONSE (MEANING NETWOR ERROR OR OTHER ERROR)
            setTimeout(() => {
                setLoadingPayment(false)
                setCanRedirectToCheckout(false)
                toast.error('Sorry, payments cannot be processed at this time', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
            }, 15000)
        } else {
            setLoadingPayment(false)
            setCanRedirectToCheckout(false)
            toast.error(`Please login to make payment`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        }
    }


    return(
        <div className="wrapper-cart" 
            style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <motion.div 
                initial={{y: '-10vh', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: '-10vh', opacity: 0}}
                transition={{duration: 0.2}}
                className='header'
            >
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded
                        className="back-cart" 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}}
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span 
                    className="wishlist-header"
                    style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
                >
                    {user_username ? `${user_username}'s wishlist`: 'Wishlist'}
                </span>
                {items.length > 0 && 
                    <>
                        <DeleteForever className="deleteAll" onClick={clearAll}/>
                        <Button className="clearAll" onClick={clearAll}>Clear</Button>
                    </>
                }
            </motion.div>
            <div className="items-overall-wrapper" 
                style={{
                    color: themeStyles.style.color, 
                    backgroundColor: themeStyles.style.backgroundColor, 
                    ...items.length < 1 && {height: '100vh'}
                }}
            >
                {items && items.length === 0 ? 
                    msg() 
                    : items.map(item => (
                        <motion.div 
                            initial={{y: '10%', opacity: 0}}
                            animate={{y:0, opacity: 1}}
                            exit={{y: '10%', opacity: 0, transition: {
                                delay: 0.2
                            }}}
                            transition={{delay: 0.2, duration: 0.15, ease: 'anticipate'}}
                            key={item._id} 
                            className="item-wrapper" 
                            style={{backgroundColor: themeStyles.style.divColor}}
                        >
                            <img src={item.image} alt={item.name} />
                            <div className="details">
                                <h2 className="itemName" 
                                    style={{...theme === 'dark' && {color: 'white'}}}
                                >{item.name}</h2>
                                <p 
                                    style={{...theme === 'dark' && { color: 'lightgrey'}}}
                                >Qty: {item.quantity}</p>
                                <p 
                                    style={{...theme === 'dark' && { color: 'lightgrey'}}}
                                >Price: ${item.totalItemPrice}</p>
                                <div className="incDec" 
                                    style={{...theme === 'dark' && {border: 'none'}}}
                                >
                                    <input 
                                        min={0} 
                                        type="number" 
                                        name="quantity" 
                                        id="quantity"
                                        placeholder="Enter Quantity preffered"
                                        style={{...theme === 'dark' && {backgroundColor: 'lightgrey'}}}
                                        onChange={(e) => dispatch(updateQuantity({id: item._id, quantity: e.target.value}))}
                                    />
                                </div>
                            </div>
                            <div className="trashCan">
                                <Delete 
                                    onClick={() => removeItem(item._id)} 
                                    className="trashIcon" htmlColor="rgb(218, 58, 58)" 
                                />
                            </div>
                        </motion.div>
                    ))
                }
            </div>
            {items.length > 0 && 
                <motion.div 
                    initial={{y: '10%', opacity: 0}}
                    animate={{y:0, opacity: 1}}
                    exit={{y: '10%', opacity: 0, transition: {
                        delay: 0.2
                    }}}
                    transition={{delay: 0.5, duration: 0.15, ease: 'anticipate'}}
                    className="wishlistDetails"
                >
                    <h3>Number of Items Selected: {items.length}</h3>
                    <h3>Total Quantity of Selected Items: {totalCartQuantity}</h3>
                    <h2 
                        style={{...theme === 'dark' ? {color: 'yellowgreen'} : {color: '#1D2671'}}}
                    >Total Price: ${totalCartPrice.toFixed(2)}</h2>
                    <button className="toCheckout" onClick={handlePayment}>
                        {loadingPayment && <CircularProgress style={{width: 25, height: 25, color: 'white'}} />} Proceed to checkout
                    </button>
                </motion.div>
            }
            <Panel />
        </div>
    )
}