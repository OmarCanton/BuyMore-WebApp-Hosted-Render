import { Button, Dialog, Slide } from '@mui/material'
import { useContext } from 'react'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { FavoriteRounded, HomeRounded, SettingsRounded, ShoppingBag, ShopRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export default function MenuOptions() {
    const {openMenu, setOpenMenu} = useContext(userDetailsContext)
    const {theme} = useContext(themesContext)
    return (
        <div className="menuWrapper">
            <Dialog 
                open={openMenu}
                onClose={(event, reason) => {
                    if(reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        setOpenMenu(false)
                    }
                }}
                disableScrollLock
                // PaperProps={}
                TransitionComponent={Slide}
                TransitionProps={{direction: 'right'}}
            >
                <div className="menus">
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
                        {/* <div className="numOfItems">{wishlistItems.length}</div> */}
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
                        {/* <div className="numOfItems">{favorites.length}</div> */}
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
                </div>
            </Dialog>
        </div>
    )
}