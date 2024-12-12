import Panel from '../Components/Panel'
import '../Styles/Home.css'
import Header from '../Components/Header'
import FeaturedProducts from '../Components/FeaturedProducts'
import Hero from '../Components/Hero'
import NewArrivals from '../Components/NewArrivals'
import ShopByCategories from '../Components/ShopByCategories'
import { themesContext } from '../Contexts/userDataContext'
import { useContext } from 'react'
import ThemeChangeAnime from '../Components/ThemeChangeAnime'
import MenuOptions from '../Components/MenuOptions'

export default function Home () {
    const { theme, showThemeOverlay } = useContext(themesContext)
    return (
        <div className='mainWrapper-home' 
            style={{...theme == 'dark' && {backgroundColor: 'rgb(22, 22, 22'}}}
        >
            <Header appName='buyMore&reg;' />
            <MenuOptions />
            <Hero />
            <NewArrivals />
            <ShopByCategories />
            <span 
                className='featuredHeader' 
                style={{...theme == 'light' && window.innerWidth <= 425 && {color: '#1D2671'}}}
            >Featured Products</span>
            <FeaturedProducts />
            <Panel />
            {showThemeOverlay && <ThemeChangeAnime /> }
        </div>
    )
}