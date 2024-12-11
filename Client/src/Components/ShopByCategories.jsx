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
                />
                <ShopByCatsCard 
                    name={'Electronics'} 
                />
                <ShopByCatsCard 
                    name={'Smartphones'} 
                />
                <ShopByCatsCard 
                    name={'Shoes'} 
                />
                <ShopByCatsCard 
                    name={'Outerwear'} 
                />
                <ShopByCatsCard 
                    name={'Laptops'} 
                />
            </div>
        </div>
    )
}