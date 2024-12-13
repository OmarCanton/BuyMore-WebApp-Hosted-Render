import { Cancel } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { themesContext } from '../../Contexts/userDataContext'
import '../../Styles/Payment.css'

export default function CancelPage () {
    const navigate = useNavigate()
    const { theme } = useContext(themesContext)
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