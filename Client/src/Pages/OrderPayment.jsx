import { useContext } from 'react'
import { Button } from '@mui/material'
import { ArrowBackIosNewRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { themesContext } from '../Contexts/userDataContext'
import '../Styles/OrderAndPaymentHistory.css'

export default function OrderPayment () {
    const navigate = useNavigate()
    const { theme, themeStyles } = useContext(themesContext)
    
    return (
        <div 
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
            className="orderPayment-wrapper"
        >
            <div className="orderPay-backTitle" style={{color: themeStyles.style.color}}>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span>Order And Payment History</span>
            </div>
            <div 
                style={{...theme === 'dark' && {color: 'white'}}}
                className="orderPayment-main"
            >
                <span>No history available</span>
                <h3>This section is under development!</h3>
            </div>
        </div>
    )
}