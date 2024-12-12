import { useContext, useEffect, useState } from 'react'
import { themesContext, userDetailsContext } from '../Contexts/userDataContext'
import { Link, useLocation } from 'react-router-dom'
import '../Styles/Panel.css'
import {
    ShoppingBag, 
    SettingsRounded, 
    HomeRounded, 
    FavoriteRounded, 
    ShopRounded
} from '@mui/icons-material'
import { Button } from '@mui/material'
import { listItems } from '../Redux/Slices/WishlistSlice'
import { favoriteItems } from '../Redux/Slices/FavoritesSlice'
import { useSelector } from 'react-redux'

export default function Panel () {
    const location = useLocation()
    const path = location.pathname
    const wishlistItems = useSelector(listItems)
    const favorites = useSelector(favoriteItems)
    const {theme, themeStyles} = useContext(themesContext)


    const {isVisible, setIsVisible} = useContext(userDetailsContext)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if(currentScrollY > lastScrollY) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll) 
    }, [lastScrollY, setIsVisible])

    useEffect(() => {
        const handleMouseMove = (event) => {
            const mousePosition = event.clientY
            if(mousePosition >= (window.innerHeight - 80)) {
                setIsVisible(true)
            }
        }
        
        window.addEventListener('mousemove', handleMouseMove)

        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [setIsVisible])

    return (
        <>
            <div
                style={{
                    ...theme === 'dark' && {backgroundColor: themeStyles.style.divColor}, 
                    ...!isVisible && {transform: 'translateY(120%)'}
                }} 
                className='mainWrapper'
            >
                <Link 
                    to='/' 
                    className='home'
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <HomeRounded 
                            fontSize='large' 
                            htmlColor='white'  
                            style={{...theme == 'light' && window.innerWidth <= 768 && {color: '#3C3C3C'}}}
                        />
                    </Button>
                </Link>
                <Link 
                    to='/shop' 
                    className='shop'
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <ShopRounded 
                            style={{...theme == 'light' && window.innerWidth <= 768 && {color: '#3C3C3C'}}} 
                            fontSize='large' 
                            htmlColor='white'
                        />
                        </Button>
                </Link>
                <Link 
                    to='/cart' 
                    className='wishlist-panel'
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <ShoppingBag 
                            style={{...theme == 'light' && window.innerWidth <= 768 && {color: '#3C3C3C'}}} 
                            htmlColor='white' 
                            fontSize='large' 
                        />                
                        <div className="numOfItems">{wishlistItems.length}</div>
                    </Button>
                </Link>
                <Link 
                    to='/favorites' 
                    className='favorites'
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <FavoriteRounded 
                            fontSize='large' 
                            htmlColor='white'
                            style={{...theme == 'light' && window.innerWidth <= 768 && {color: '#3C3C3C'}}}
                        />
                        <div className="numOfItems">{favorites.length}</div>
                    </Button>
                </Link>
                <Link 
                    to='/settings' 
                    className='settings'
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <SettingsRounded 
                            fontSize='large' 
                            htmlColor='white'
                            style={{...theme == 'light' && window.innerWidth <= 768 && {color: '#3C3C3C'}}}
                        />
                    </Button>
                </Link>
                <div
                    className="chosenRoute"
                    style={{
                        ...path === '/' && {left: 20},
                        ...path === '/home' && {left: 20},
                        ...path === '/shop' && {left: '25.6%'},
                        ...path === '/cart' && {left: '45.5%'},
                        ...path === '/favorites' && {left: '65%'},
                        ...path === '/settings' && {left: '85%'},

                    }}
                ></div>
            </div>
            { (wishlistItems.length > 0 || favorites.length > 0) &&
                <div 
                    style={{
                        ...!isVisible && {transform: 'translateY(500%)'}
                    }}                    
                    className="panelNotificationCount"
                ></div>
            }
        </>
    )
}