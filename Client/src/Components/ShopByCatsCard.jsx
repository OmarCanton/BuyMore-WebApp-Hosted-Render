import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/ShopByCats.css'
import { themesContext } from '../Contexts/userDataContext'
import PropTypes from 'prop-types'

export default function ShopByCatsCard ({name}) {
    const { theme, themeStyles } = useContext(themesContext)
    const navigate = useNavigate()

    const shopWithCategory = (category) => {
        navigate('/shop', {state: {category}})
    }

    return (
        <div 
            style={{
                ...theme === 'dark' ? {
                    backgroundColor: themeStyles.style.divColor, 
                    color: 'white'
                } 
                : 
                {backgroundColor: 'grey'},
            }}
            onClick={() => shopWithCategory(name)}
        >
            <small>{name}</small>
        </div>
    )
}

ShopByCatsCard.propTypes = {
    name: PropTypes.string,
}