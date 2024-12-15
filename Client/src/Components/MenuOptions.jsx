import { Button, Dialog, Slide } from '@mui/material'
import { useContext } from 'react'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { ArrowBack, FavoriteRounded, HomeRounded, QuestionAnswer, SettingsRounded, ShoppingBag, ShopRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import '../Styles/MenuOptions.css'
import { listItems } from '../Redux/Slices/WishlistSlice'
import { favoriteItems } from '../Redux/Slices/FavoritesSlice'
import { useSelector } from 'react-redux'


export default function MenuOptions() {
    const {openMenu, setOpenMenu} = useContext(userDetailsContext)
    const {theme} = useContext(themesContext)
    const wishlistItems = useSelector(listItems)
    const favorites = useSelector(favoriteItems)

    return (
        <Dialog 
            open={openMenu}
            onClose={(event, reason) => {
                if(reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    setOpenMenu(false)
                }
            }}
            PaperProps={{style: {
                ...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'rgb(224, 224, 224'},
                padding: 0,
                margin: 0,
                minHeight: '100vh',
                position: 'absolute',
                left: '0vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}}
            TransitionComponent={Slide}
            TransitionProps={{direction: 'right'}}
        >
            <div className="menu-wrapper">
                <span 
                    className='arrowBack'
                    onClick={() => setOpenMenu(false)}
                >
                    <ArrowBack 
                        fontSize='large'
                        htmlColor='black'
                        style={{...theme === 'dark' && {color: 'white'}}}
                    />
                </span>
                <Link 
                    to='/'
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <HomeRounded 
                            fontSize='large'
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}} 
                        />
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Home</p>
                    </Button>
                </Link>
                <Link 
                    to='/shop' 
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <ShopRounded  
                            fontSize='large' 
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}}
                        />
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Shop</p>
                    </Button>
                </Link>
                <Link 
                    to='/cart' 
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <ShoppingBag 
                            fontSize='large' 
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}}
                        />     
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Wishlist</p>           
                    </Button>
                    <div className="numOfItems">{wishlistItems.length}</div>
                </Link>
                <Link 
                    to='/favorites' 
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <FavoriteRounded 
                            fontSize='large' 
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}}
                        />
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Favorites</p>
                    </Button>
                    <div className="numOfItems">{favorites.length}</div>
                </Link>
                <Link 
                    to='/settings' 
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <SettingsRounded 
                            fontSize='large' 
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}}
                        />
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Settings</p>
                    </Button>
                </Link>
                <Link 
                    to='mailto: buymoreapp24@gmail.com' 
                    onClick={() => setOpenMenu(false)}
                >
                    <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                        <QuestionAnswer 
                            fontSize='large'
                            htmlColor='black'
                            style={{...theme === 'dark' && {color: 'white'}}}
                        />
                        <p style={{...theme === 'dark' && {color: 'white'}}}>Having a problem?</p>
                    </Button>
                </Link>
            </div>
            <small 
                className='comp'
                style={{...theme === 'light' && {color: '#3C3C3C'}}}
            >
                @CantonsTech 2024, All Rights Reserved.
            </small>
        </Dialog>
    )
}