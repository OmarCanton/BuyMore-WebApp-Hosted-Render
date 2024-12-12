import { Button, Dialog, Slide } from '@mui/material'
import { useContext } from 'react'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { FavoriteRounded, HomeRounded, SettingsRounded, ShoppingBag, ShopRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export default function MenuOptions() {
    const {openMenu, setOpenMenu} = useContext(userDetailsContext)
    const {theme} = useContext(themesContext)
    return (
        <Dialog 
            open={openMenu}
            onClose={(event, reason) => {
                if(reason === 'backdropClick' || reason === 'escapeKeyDown') {
                    setOpenMenu(false)
                }
            }}
            disableScrollLock
            PaperProps={{style: {
                ...theme === 'dark' && {backgroundColor: '#3C3C3C'},
                padding: 0,
                margin: 0,
                height: '100vh',
                position: 'absolute',
                left: '0vh',


            }}}
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
                    />
                </Button>
            </Link>
            <Link 
                to='/shop' 
                className='shop'
            >
                <Button className='but' fullWidth sx={{borderRadius: '50px'}}>
                    <ShopRounded  
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
                    />
                </Button>
            </Link>
            </div>
        </Dialog>
    )
}