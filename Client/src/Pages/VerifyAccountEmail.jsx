import { useEffect, useState, useContext } from 'react' 
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import '../Styles/Payment.css'
import { CancelOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { themesContext } from '../Contexts/userDataContext';

export default function VerifyAccountEmail() {
    const { token } = useParams()
    const [success, setSuccess] = useState()
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    const {theme, themeStyles} = useContext(themesContext) 

    useEffect(() => {
        const completeEmailVerification = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/verifyEmail/${token}`)
                if(response?.status === 200) {
                    setSuccess(true)
                }
                setMessage(response.data?.message)
            } catch (err) {
                console.error(err)
                setSuccess(false)
                setMessage(err?.response.data?.message)
            }
        }
        completeEmailVerification()
    }, [token])

    
    return(
        <div className="success-wrapper" style={{backgroundColor: themeStyles.style.backgroundColor, color: themeStyles.style.color}}>
            <div 
                style={{backgroundColor: themeStyles.style.divColor}}
                className="success-info-wrappper"
            >
                {success? 
                    <CheckCircleOutlined htmlColor='green' className='mark'/>
                    :
                    <CancelOutlined htmlColor='red' className='mark' />
                }
                <p style={{...theme === 'dark' ? {color: themeStyles.style.color} : {color: 'black'}}}>{message}</p>
                {success?
                    <button onClick={() => navigate('/login')}>Login</button>
                    :
                    <button onClick={() => navigate('/')}>Home</button>
                }
            </div>
        </div>
    )
}