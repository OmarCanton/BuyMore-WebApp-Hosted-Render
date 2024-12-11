import { useContext } from 'react'
import '../Styles/Effect.css'
import { themesContext } from '../Contexts/userDataContext'

export default function LoadingEffect () {
    const {themeStyles} = useContext(themesContext)

    return (
        <div className="effect-wrapper" style={{color: themeStyles.style.color}}>
            buyMore
        </div>
    )
}