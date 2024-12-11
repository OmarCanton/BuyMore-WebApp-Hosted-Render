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
                    backImage={'https://images.pexels.com/photos/5825347/pexels-photo-5825347.jpeg?auto=compress&cs=tinysrgb&w=600'}
                />
                <ShopByCatsCard 
                    name={'Electronics'} 
                    backImage={'https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                />
                <ShopByCatsCard 
                    name={'Smartphones'} 
                    backImage={'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                />
                <ShopByCatsCard 
                    name={'Shoes'} 
                    backImage={'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'}
                />
                <ShopByCatsCard 
                    name={'Outerwear'} 
                    backImage={'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600'}
                />
                <ShopByCatsCard 
                    name={'Laptops'} 
                    backImage={'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600'}
                />
            </div>
        </div>
    )
}