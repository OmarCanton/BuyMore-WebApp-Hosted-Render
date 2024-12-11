import { useState, useEffect, useContext, useRef } from 'react'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { useLocation, useNavigate } from 'react-router-dom'
import '../Styles/Product.css'
import { Button, CircularProgress } from '@mui/material'
import { 
    AddCommentRounded, 
    ArrowBackIosRounded, 
    AccountCircleRounded, 
    StarRounded,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../Redux/Slices/WishlistSlice'
import { 
    fetchComments, 
    productComments,
    removeCommentsAfterUnmount, 
    selectProductsStatus 
} from '../Redux/Slices/productsSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Panel from '../Components/Panel'

export default function ProductCheck () {
    const [comment, setComment] = useState('')
    const [commentSubmitted, setCommentSubmitted] = useState(false)
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(null)
    const commentRef = useRef(null)
    const navigate = useNavigate()
    const { isLoggedIn, userId, user_username } = useContext(userDetailsContext)
    const dispatch = useDispatch()
    const comments = useSelector(productComments)
    const status = useSelector(selectProductsStatus)
    const {theme, themeStyles} = useContext(themesContext)
    const location = useLocation()
    const {product} = location.state || {}

    const productId = product._id

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
    
    const commentBody = { productId, userId, user_username, comment } 
    const addComment = async (e) => {
        e.preventDefault()
        commentRef.current.value = ''
        if(isLoggedIn) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/addProductComment`, commentBody, {withCredentials: true})
                if(response.data.msg) {
                    toast.success(response.data.msg, {
                        style: {
                            backgroundColor: 'black',
                            color: 'white',
                        }
                    })
                    setCommentSubmitted(prevState => !prevState)
                } else {
                    toast.error(`SOME ERR ${response.data.msg}`, {
                        style: {
                            backgroundColor: 'black',
                            color: 'white',
                        }
                    })
                }
            } catch (err) {
                toast.error(err, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    }
                })
            }
        } else {
            toast.error(`Please log into your account to add a comment`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                }
            })
        }
    }

    useEffect(() => {
        dispatch(removeCommentsAfterUnmount()) //clears the comments array not to show previous product's own when component mounts before fetching the comments
        dispatch(fetchComments(productId)) //fetch the comments
    }, [dispatch, productId, commentSubmitted])

    const ratingBody = {productId, userId, user_username, rating}
    const addRating = async () => {
        if( isLoggedIn) {
            try{
                const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/addRating`, ratingBody, {withCredentials: true})
                toast.success(response.data.msg, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    }
                })
                setCommentSubmitted(prevState => !prevState)
            } catch(err) {
                toast.error(err, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    }
                })
            }
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
        <div className="checkWrapper" 
            style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <div className='header'>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)} >
                    <ArrowBackIosRounded 
                        style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor, cursor: 'pointer'}}
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span>Product Details</span>
            </div>
            <div className='productSectionWrapper'>
                <div 
                    style={{...theme === 'dark' && {gap: 10}}}
                    className="productSection" 
                    key={product._id}>
                    <div
                        style={{...theme === 'dark' && {backgroundColor: '#3C3C3C', border: 'none'}}}
                        className="image"
                    >
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div
                        style={{...theme === 'dark' && {backgroundColor: '#3C3C3C', border: 'none'}}} 
                        className="description">
                        <div className="catBrand">
                            <div className="brand">{product.brand}</div>
                            <div className="category">{product.category}</div>
                        </div>
                        <span 
                            style={{...theme === 'dark' && {color: 'white'}}} 
                            className="name"
                        >{product.name}</span>
                        <h3 className="desc" 
                            style={{...theme === 'dark' && {color: 'darkgrey'}}}
                        >{product.description}</h3>
                        <div className="prices" 
                            style={{...theme === 'dark' && {color: 'yellowgreen'}}}
                        >
                            <h2 className="actualPrice">Price: ${(product.actualPrice).toFixed(2)}</h2>
                        </div>
                        <div className="cart" onClick={() => addToWishlist(product)}>
                            <button className="addTocart">Add To Wishlist</button>
                        </div>
                    </div>
                    <div 
                        style={{...theme === 'dark' && {backgroundColor: '#3C3C3C', border: 'none'}}} 
                        className="comment" >
                        <form onSubmit={addComment}>
                            <h3 style={{
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}>
                                <p>What do you think about the product?</p> 
                                <AddCommentRounded />
                            </h3>
                            <textarea 
                                ref={commentRef} 
                                onChange={(e) => setComment(e.target.value)} 
                                name="comments" 
                                id="comments" 
                                style={{backgroundColor: theme === 'dark' && 'lightgrey'}}
                                placeholder={comments.length === 0 ? `Be first to comment on ${product.name}...` : 'Write Your Comments Here...'}>
                            </textarea>
                            <button disabled={comment === '' ? true : false}>Submit</button>
                        </form> 
                    </div>
                    <div
                        style={{...theme === 'dark' && {backgroundColor: '#3C3C3C', border: 'none'}}} 
                        className="rating">
                        <h3>Rate Product</h3>
                        <div className="ratingWrapper">
                            <div className='starsWrapper'>
                                {Array.from({length: 5}).map((_, index) => {
                                    const currentRating = index + 1
                                    return (
                                        <StarRounded 
                                            key={index}
                                            fontSize='large' 
                                            htmlColor={currentRating <= (hover || rating) ? 'rgb(235, 199, 0)' : 'grey' }
                                            onClick={() => setRating(currentRating)} 
                                            onMouseOver={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    )
                                })}
                            </div>
                            {rating > 0 &&
                                <p 
                                    className="score" 
                                    style={rating <= 1 ? {color: 'red'} : {color: 'green'}}
                                >
                                    You&apos;ve rated {rating} {rating <= 1 ? 'star': 'stars'}
                                </p>
                            }
                            <button disabled={rating === 0 ? 'true' : false} onClick={addRating}>Submit</button>
                        </div>
                    </div>
                </div>
                {status === 'loading' && 
                    <div className='activityIndicator'>
                        <CircularProgress />
                    </div>
                }
                {comments.length > 0 &&
                    <div 
                        style={{...theme === 'dark' && { backgroundColor: '#3C3C3C', border: 'none'}}}
                        className="viewComments"
                    >
                        <h3>Comments on {product.name}</h3>
                        {comments && comments.map(user_comment => (
                            <div 
                                style={{...theme === 'dark' && {backgroundColor: '#535353'}}}
                                className='userCommentWrapper' 
                                key={user_comment.userId}>
                                <div className="user">
                                    <AccountCircleRounded 
                                        style={{color: themeStyles.style.color}} 
                                    />
                                    <h4 
                                        style={{color: themeStyles.style.color}} 
                                    >{user_comment.username}</h4>
                                </div>
                                <div 
                                    style={{...theme === 'dark' && {color: 'lightgrey'}}}
                                    className="userComment"
                                >
                                    <p className="ratings"> 
                                        {Array.from({length: user_comment.rating}).map((_, index) => {
                                            return (
                                                <StarRounded 
                                                    key={index} 
                                                    className='starWrapper'
                                                    htmlColor='rgb(235, 199, 0)'
                                                />
                                            )
                                        })}
                                    </p>
                                    <ul>
                                        {
                                            user_comment.comment.map((userComment, index) => (
                                                <li key={index}>{userComment}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <Panel />
        </div>
    )
}
