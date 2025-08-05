import { useContext } from "react"
import { themesContext } from "../Contexts/userDataContext"
import { useNavigate } from "react-router-dom"
import Panel from "../Components/Panel"
import { useLocation } from "react-router-dom"
import '../Styles/NewArr.css'
import { ArrowBackIosNewRounded } from '@mui/icons-material'
import { Button } from "@mui/material"
import ProductContainer from "../Components/ProductContainer"


export default function NewArrivalsPage () {
    const { theme, themeStyles } = useContext(themesContext)
    const location = useLocation()
    const { newArrivals } = location.state || {}
    const navigate = useNavigate()


    return (
        <div
            className="newArr-mainWrapper"
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}} 
                
        >
            <div 
                style={{...theme === 'dark' && {backgroundColor: themeStyles.backgroundColor}}} 
                className='header-newArr'>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span 
                    className="title" 
                    style={{color: themeStyles.style.color}}
                >New Arrivals</span>
            </div>
            <div 
                style={{
                    color: themeStyles.style.color, 
                    backgroundColor: themeStyles.style.backgroundColor, 
                }} 
                className="productsWrapper-newArr"
            >
                {newArrivals && newArrivals.map(product => (
                    <ProductContainer key={product?._id} item={product} />   
                ))}
                <Panel />
            </div>
        </div>
    )
}