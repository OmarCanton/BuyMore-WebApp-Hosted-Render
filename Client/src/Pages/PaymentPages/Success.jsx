import { CheckCircle } from '@mui/icons-material'
import '../../Styles/Payment.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { themesContext } from '../../Contexts/userDataContext'
import axios from 'axios'

export default function SuccessPage () {
    const navigate = useNavigate()
    const {theme} = useContext(themesContext)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get('tag');


    useEffect(() => {
        const updateStatus = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/paymentSucceeded?tag=${tag}`)
            } catch(err) {
                console.error(err)
            }
        }
        updateStatus()
    })

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