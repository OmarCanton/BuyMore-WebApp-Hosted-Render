import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Header.css'
import PropTypes from 'prop-types'
import { userDetailsContext } from '../Contexts/userDataContext'
import { Button, CircularProgress } from '@mui/material'
import { AccountCircle, ShoppingBag, QuestionAnswer, Menu } from '@mui/icons-material'
import {  useSelector } from 'react-redux'
import { listItems } from '../Redux/Slices/WishlistSlice'
import { LightMode, DarkMode } from '@mui/icons-material'
import { themesContext } from '../Contexts/userDataContext'
import { userState, tokenState } from '../Redux/Slices/authSlice'

export default function Header ({appName}) {
    const { theme, changeTheme, setShowThemeOverlay } = useContext(themesContext)    
    const user = useSelector(userState)
    const token = useSelector(tokenState)
    
    const [headbgColor, setHeadbgColor] = useState({ 
        backgroundColor: 'transparent',
        backgroundImage: '',
        boxShadow: '',
    })
    const wishlistItems = useSelector(listItems)

    const {
        loading,
        setOpenMenu 
    } = useContext(userDetailsContext)

    useEffect(() => {
        const handler = () => {
            if(window.innerWidth <= 650) {
                if(window.scrollY === 0) {
                    setHeadbgColor((prevState) => (
                        {
                            ...prevState, color: 'black', 
                            boxShadow: 'none',
                            backgroundColor: ''
                        }
                    ))
                } else {
                    setHeadbgColor((prevState) => (
                        {
                            ...prevState,
                            boxShadow: '0 5px 5px -5px black',
                            ...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'whitesmoke'}
                        }
                    ))
                }
            } else {
                if(window.scrollY > window.innerHeight ) {
                    setHeadbgColor((prevState) => (
                        { 
                            ...prevState, 
                            backgroundImage: 'linear-gradient( to right, #C33764 , #1D2671)' 
                        }
                    ))
                } else {
                    setHeadbgColor(() => (
                        {
                            backgroundColor: 'transparent',
                            backgroundImage: '',
                            boxShadow: '',
                        }
                    ))
                }
            }
        }
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [theme])

    const enableThemeOverlay = () => {
        setShowThemeOverlay(true)
        setTimeout(() => {
            setShowThemeOverlay(false)
        }, 2000)
    }

    return (
        <div className="wrapper-header" style={headbgColor}>
            <p 
                className='pageName' 
                style={{...theme == 'light' && window.innerWidth <= 650 && {color: '#1D2671'}}}
            >
                <span className="menuBar" onClick={() => setOpenMenu(true)}>
                    <Menu fontSize='large' style={{...theme === 'dark' && {color: 'white'}}}/>
                </span>
                {appName}
            </p>
            <div className="right">
                {token &&
                    <>
                        <div className='contact'>
                            <Link to='mailto: buymoreapp24@gmail.com' className='contAbt-btn' >
                                <button style={{ fontWeight: 'bold'}}>Talk To Us</button>
                            </Link>
                        </div>
                        <div className='contact-icon-forMobile'>
                            <Link to='mailto: buymoreapp24@gmail.com' className='contact-btn-mobile' >
                                <QuestionAnswer htmlColor='white' style={{...theme == 'light' && window.innerWidth <= 650 && {color: '#3C3C3C'}}}/>
                            </Link>
                        </div>
                    </>
                }
                <div 
                    className="theme" 
                    onClick={() => {
                        enableThemeOverlay()
                        setTimeout(() => {
                            theme === 'dark' ? changeTheme('light') : changeTheme('dark')
                        }, 1000)
                    }}
                >
                    {theme === 'light' ? 
                        <LightMode 
                            htmlColor='white'
                            style={{...theme == 'light' && window.innerWidth <= 650 && {color: '#3C3C3C'}}}
                        /> 
                        : 
                        <DarkMode htmlColor='white'/>
                    }
                </div>
                <div className="wishlist">
                    <Link to='/cart'>
                        <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                            <ShoppingBag 
                                style={{...theme == 'light' && window.innerWidth <= 650 && {color: '#3C3C3C'}}} 
                                htmlColor='white' 
                                fontSize='large'
                            />
                        </Button>
                    </Link>
                    <div className="numOfItems">{wishlistItems.length}</div>
                </div>
                <div className='accounts'>
                    <>
                        {loading && <CircularProgress style={{width: 25, height: 25}} />}
                        { token ?
                            <Link to='/settings/account' className='profileLink'>
                                <div className="userProfile">
                                    { loading === true ? 
                                        <AccountCircle fontSize='large' /> 
                                        : 
                                        <>
                                            { user.profileImage ?
                                                <img src={user.profileImage} alt={user.username} /> 
                                                :
                                                <AccountCircle fontSize='large' htmlColor='lightgrey' />         
                                            }
                                        </>
                                    }<p className='username' style={{color: 'white'}}>{user.username}</p>
                                </div>
                            </Link>
                            :
                            <Link to='/login' className='login' >
                                <Link className='loginForMobile' to='/login'>Login</Link>
                                <div className='loginText'>Login </div>
                                <AccountCircle className='accountSvg' fontSize='large' htmlColor='darkgrey' style={{cursor: "pointer"}} />
                            </Link>
                        }   
                    </>
                </div>
            </div>
        </div>
    )
}

Header.propTypes = {
    appName: PropTypes.string
}