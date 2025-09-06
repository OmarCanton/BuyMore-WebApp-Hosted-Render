import { Cancel } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { themesContext } from '../../Contexts/userDataContext'
import '../../Styles/Payment.css'
import axios from 'axios'

export default function CancelPage () {
    const navigate = useNavigate()
    const { theme } = useContext(themesContext)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get('tag');


    useEffect(() => {
        const updateStatus = async () => {
            try {
                await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/paymentfailed?tag=${tag}`)
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
                style={{...theme === 'dark' && {backgroundColor: '#3C3C3C'}}}
                className="success-info-wrappper"
            >
                <Cancel className='mark' htmlColor='red'/>
                <p 
                    style={{...theme === 'dark' ? {color: 'white'} : {color: 'red'}}}
                >Payment was unsuccessful!</p>
                <button className='btn-payment' onClick={() => navigate('/')}>Go Back Home</button>
            </div>
        </div>
    )
}