import Panel from '../Components/Panel'
import '../Styles/Home.css'
import Header from '../Components/Header'
import FeaturedProducts from '../Components/FeaturedProducts'
import Hero from '../Components/Hero'
import NewArrivals from '../Components/NewArrivals'
import ShopByCategories from '../Components/ShopByCategories'
import { themesContext } from '../Contexts/userDataContext'
import { useContext, useEffect } from 'react'
import ThemeChangeAnime from '../Components/ThemeChangeAnime'

export default function Home () {
    useEffect(() => {
        alert(window.innerWidth)
    }, [])
    const { theme, showThemeOverlay } = useContext(themesContext)
    return (
        <div className='mainWrapper-home' 
            style={{...theme == 'dark' && {backgroundColor: 'rgb(22, 22, 22'}}}
        >
            <Header appName='buyMore&reg;' />
            <Hero />
            <NewArrivals />
            <ShopByCategories />
            <span 
                className='featuredHeader' 
                style={{...theme === 'dark' && {
                    background: 'linear-gradient( to right, #C33764, #1D2671)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'brightness(1.5)'                
                }}}
            >Featured Products</span>
            <FeaturedProducts />
            <Panel />
            {showThemeOverlay && <ThemeChangeAnime /> }
        </div>
    )
}