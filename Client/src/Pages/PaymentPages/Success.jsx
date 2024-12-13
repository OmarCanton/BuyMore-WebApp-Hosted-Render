import { CheckCircle } from '@mui/icons-material'
import '../../Styles/Payment.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { themesContext } from '../../Contexts/userDataContext'

export default function SuccessPage () {
    const navigate = useNavigate()
    const {theme} = useContext(themesContext)

    return (
        <div 
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
            className="success-wrapper"
        >
            <div 
                className="success-info-wrappper"
                style={{...theme === 'dark' && {backgroundColor: '#3C3C3C'}}}
            >
                <CheckCircle htmlColor='green' className='mark' />
                <p style={{...theme === 'dark' && {color: 'white'}}}>Payment was successful, Thank You!</p>
                <button className='btn-payment' onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        </div>
    )
}