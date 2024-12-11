import '../Styles/ShopByCats.css'
import ShopByCatsCard from './ShopByCatsCard'
import { useContext } from 'react'
import { themesContext } from '../Contexts/userDataContext'

export default function ShopByCategories () {
    const {theme} = useContext(themesContext)
    return (
        <div 
            style={{...theme === 'dark' ? 
                {borderBottom: '1px solid #3c3c3c'}
                :
                {borderBottom: '1px solid lightgrey'}
            }}
            className="shopByCats-wrapper"
        >
            <span 
                style={{...theme === 'dark' && {color: 'white'}}}
            >
                Browse Categories
            </span>
            <div className="cats-wrapper">
                <ShopByCatsCard 
                    name={'Home'} 
                    backImage={'https://images.unsplash.com/photo-1535230387253-9cd5be991a86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEhvbWUlMjBhcHBsaWFuY2VzfGVufDB8fDB8fHww'}
                />
                <ShopByCatsCard 
                    name={'Electronics'} 
                    backImage={'https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D'} 
                />
                <ShopByCatsCard 
                    name={'Smartphones'} 
                    backImage={'https://images.unsplash.com/photo-1619834035779-57f2f0e0cea8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNtYXJ0cGhvbmVzfGVufDB8fDB8fHww'}
                />
                <ShopByCatsCard 
                    name={'Shoes'} 
                    backImage={'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNob2VzfGVufDB8fDB8fHww'}
                />
                <ShopByCatsCard 
                    name={'Outerwear'} 
                    backImage={'https://images.unsplash.com/photo-1669479032913-6e9b057677e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3V0ZXJ3ZWFyfGVufDB8fDB8fHww'}
                />
                <ShopByCatsCard 
                    name={'Laptops'} 
                    backImage={'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TGFwdG9wc3xlbnwwfHwwfHx8MA%3D%3D'}
                />
            </div>
        </div>
    )
}