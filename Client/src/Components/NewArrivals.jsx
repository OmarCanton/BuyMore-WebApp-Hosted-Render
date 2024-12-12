import { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchNewArrivals, selectNewArrivals } from '../Redux/Slices/productsSlice'
import {  selectProductsStatus } from '../Redux/Slices/productsSlice'
import '../Styles/newArrivals.css'
import { themesContext } from '../Contexts/userDataContext'
import LoadingEffect from '../Effects/LoadingEffect'

export default function NewArrivals (){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const newArrivals = useSelector(selectNewArrivals)
    const status = useSelector(selectProductsStatus)
    const { theme, themeStyles } = useContext(themesContext)

    useEffect(() => {
        dispatch(fetchNewArrivals())    
    }, [dispatch])

    
    const goToNewArrivals = () => {
        navigate('/newArrivals', { state: { newArrivals } })
    }



    return (
        <>
            { (status === 'loading' || status === 'failed') && 
                <p className="loadingWrapper-newArrivals">
                    <LoadingEffect />
                </p> 
            }

            { newArrivals.length > 0 &&
                <div className="newArrivals" 
                    style={{borderBottom: theme === 'dark' ? '1px solid rgb(73, 73, 73)' : '1px solid lightgrey'}}
                >
                    <div className="newArrivalsImages">
                        <div>
                            <img src={newArrivals ? newArrivals.slice(0, 1).map(item =>  { return item.image }): undefined } alt={newArrivals ? newArrivals.slice(0, 1).map(item =>  { return item.name }): undefined} />
                            <img src={newArrivals ? newArrivals.slice(1, 2).map(item =>  { return item.image }): undefined } alt={newArrivals ? newArrivals.slice(1, 2).map(item =>  { return item.name }): undefined} />
                        </div>
                        <img className='third-large-image' src={ newArrivals ? newArrivals.slice(2, 3).map(item =>  { return item.image }): undefined } alt={newArrivals ? newArrivals.slice(2, 3).map(item =>  { return item.name }): undefined} />
                    </div>
                    <div className="newArrivalsInfo">
                        <span className='newArrivalsHead'
                            style={{...theme === 'dark' && {
                                background: 'linear-gradient( to right, #C33764, #1D2671)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'brightness(1.2)'                
                            }}}
                        >New Arrivals</span>
                        <span
                            style={{color: themeStyles.style.color}} 
                        >
                            Exciting new products just landed! Explore the latest trends and must-have items that are sure to elevate your style and experience. Whether you&apos;re looking for something fresh for your wardrobe or unique pieces to enhance your home, we&apos;ve got you covered. Dive in and find your new favorites today!
                        </span>
                        <button className="visitNewArrivals" onClick={goToNewArrivals}>See Now</button>
                    </div>
                </div>
            }
        </>
    )
}