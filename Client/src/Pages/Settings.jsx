import { useContext, useState } from 'react'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { Link, useNavigate } from 'react-router-dom'
import Panel from '../Components/Panel'
import '../Styles/Settings.css'
import { Button, CircularProgress } from '@mui/material'
import { 
    ManageAccounts, 
    DarkModeTwoTone, 
    History, 
    HandshakeRounded, 
    InfoRounded,
    ArrowBackIosNewRounded, 
    ArrowForwardIosRounded, 
    LogoutRounded, 
    AccountCircle, 
    Verified,
    Code
} from '@mui/icons-material'
import axios from 'axios'
import { toast }from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Settings () {
    const navigate = useNavigate()
    const { 
        isLoggedIn, 
        setIsLoggedIn, 
        phone, 
        setPhone, 
        about, 
        setAbout,
        setUserId, 
        user_username, 
        setUser_username,
        setUserEmail,
        profilePicture, loading,
    } = useContext(userDetailsContext)
    const [isHovered1, setIsHovered1] = useState(false)
    const [isHovered2, setIsHovered2] = useState(false)
    const [isHovered3, setIsHovered3] = useState(false)
    const [isHovered4, setIsHovered4] = useState(false)
    const [isHovered5, setIsHovered5] = useState(false)
    const [isHovered6, setIsHovered6] = useState(false)
    const [isHovered7, setIsHovered7] = useState(false)
    const {theme, themeStyles} = useContext(themesContext)
    const [loggingOut, setLoggingOut] = useState(false)


    const logout = async () => {
        setLoggingOut(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/logout`, { withCredentials: true })
            if(response.data.success === true) {
                navigate('/')
                setIsLoggedIn(false)
                setUserId(null)
                setUser_username(null)
                setUserEmail(null)
                setAbout(null)
                setPhone(null)
                toast.success(response.data.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                })

            }
            if(response.data.error) {
                toast.error(response.data.error, {
                    style: {
                        backgroundColor: 'white',
                        color: 'black'
                    },
                })   
            }
            setLoggingOut(false)
            
        } catch(err) {
            toast.error(err, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                },
            })
            setLoggingOut(false)
        }
    }

    return (
        <div className='settings-wrapper' 
            style={{backgroundColor: themeStyles.style.backgroundColor}}
        >
            <div className="settings-backTitle" style={{color: themeStyles.style.color}}>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        className='back-settings'
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <h2>Settings</h2>
            </div>
            <div className="settings-main">
                <div className="user">
                    { isLoggedIn ?
                        <>
                            <div 
                                style={{...!profilePicture && {backgroundColor: 'transparent'}}}
                                className="profileImage"
                            >
                                {loading ? 
                                    <CircularProgress /> 
                                    :
                                    <>
                                        { profilePicture ?
                                            <img src={`../UserProfile/${profilePicture}`} alt={user_username} />
                                            :
                                            <AccountCircle fontSize='large' htmlColor='grey' style={{transform: 'scale(1.2)'}} className="noProfilePic" />         
                                        }
                                    </>
                                }
                            </div>   
                            <div
                                className="userDetails"
                            >
                                <motion.span
                                    initial={{y: '20%', opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.2, ease: 'anticipate'}}
                                    className="username" 
                                    style={{
                                        ...theme === 'dark' ? {color: themeStyles.style.color} : {color:'#1D2671'}
                                    }}
                                >
                                    {user_username} 
                                    <motion.span
                                        initial={{x: '20%', opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        transition={{delay: 0.6, ease: 'anticipate'}}
                                    >
                                        <Verified htmlColor='green' className='verified' />
                                    </motion.span>
                                </motion.span>
                                <motion.p  
                                    initial={{y: '20%', opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.8, ease: 'anticipate'}} 
                                    className="phone"
                                >
                                    Phone: {phone ? phone : 'Phone not set'}
                                </motion.p>
                                <motion.p 
                                    initial={{y: '20%', opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 1, ease: 'anticipate'}} 
                                    className="About"
                                >
                                    About: {about ? about : 'Not set'}
                                </motion.p>
                                <motion.p 
                                    initial={{y: '20%', opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 1.2, ease: 'anticipate'}}
                                    className="status"
                                >
                                    Status: Regular User
                                </motion.p>
                            </div>
                        </>
                        :
                        <div className='guest'>
                            <AccountCircle className='loggedOut-noProfile' style={{width: 300, height: 300}} htmlColor='grey' />          
                            <span style={{...theme === 'dark' && {color: 'white'}}}>GUEST</span>
                        </div>
                    }
                    {/* {error && <AccountCircle />} */}
                </div>
                <ul>
                    <li 
                        onMouseEnter={() => setIsHovered1(true)}
                        onMouseLeave={() => setIsHovered1(false)}
                        className='acc' 
                        style={{ ...theme === 'dark' && {borderBottom: '1px solid grey', borderTop: '1px solid grey'}, 
                        ...isHovered1 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor } : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('account')}>
                        <div style={{color: themeStyles.style.color}}>
                            <h3><ManageAccounts fontSize='large' />Account</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>
                    <li 
                        onMouseEnter={() => setIsHovered2(true)}
                        onMouseLeave={() => setIsHovered2(false)}
                        style={{...theme === 'dark' && {borderBottom: '1px solid grey'},
                            ...isHovered2 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor} : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('themes')}
                    >
                        <div style={{color: themeStyles.style.color}}>
                            <h3><DarkModeTwoTone fontSize='large' />Themes</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>
                    <li 
                        onMouseEnter={() => setIsHovered3(true)}
                        onMouseLeave={() => setIsHovered3(false)}
                        style={{ ...theme === 'dark' && {borderBottom: '1px solid grey'},
                        ...isHovered3 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor} : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('order_Payment_History')}
                    >
                        <div style={{color: themeStyles.style.color}}>
                            <h3><History fontSize='large' />Order And Payment History</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>
                    <li 
                        onMouseEnter={() => setIsHovered4(true)}
                        onMouseLeave={() => setIsHovered4(false)}
                        style={{...theme === 'dark' && {borderBottom: '1px solid grey'},
                            ...isHovered4 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor} : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('terms_and_conditions')}
                    >
                        <div style={{color: themeStyles.style.color}}>
                            <h3><HandshakeRounded />Read Terms And Conditions</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>
                    <li 
                        onMouseEnter={() => setIsHovered5(true)}
                        onMouseLeave={() => setIsHovered5(false)}
                        style={{...theme === 'dark' && {borderBottom: '1px solid grey'},
                            ...isHovered5 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor} : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('/about')}
                    >
                        <div style={{color: themeStyles.style.color}}>
                            <h3><InfoRounded fontSize='large' />About</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>
                    <li 
                        onMouseEnter={() => setIsHovered6(true)}
                        onMouseLeave={() => setIsHovered6(false)}
                        style={{...theme === 'dark' && {borderBottom: '1px solid grey'},
                            ...isHovered6 && {...theme === 'dark' ? {backgroundColor: themeStyles.style.divColor} : {backgroundColor: 'rgb(199, 199, 199)'}}
                        }} 
                        onClick={() => navigate('/dev')}
                    >
                        <div style={{color: themeStyles.style.color}}>
                            <h3><Code fontSize='large' />Developer</h3> 
                            <ArrowForwardIosRounded />
                        </div>
                    </li>

                </ul>
                {isLoggedIn ?
                    <div 
                        onMouseEnter={() => setIsHovered7(true)}
                        onMouseLeave={() => setIsHovered7(false)}
                        style={{...isHovered7 && {...theme === 'dark' && {backgroundColor: themeStyles.style.divColor}}}}
                        className="logout" 
                        onClick={logout}
                    >
                        {
                            loggingOut ? <CircularProgress style={{width: 25, height: 25, ...theme === 'dark' ? {color: 'white'} : {color: 'grey'}}} />
                            :
                            <>
                                <LogoutRounded htmlColor='red' fontSize='large' />
                                <h3 style={{color: themeStyles.style.color, cursor: 'pointer'}}>Logout</h3>
                            </>
                        }
                    </div>
                    :
                    <Link to='/login'>
                        <button>Login</button>
                    </Link>
                }
            </div>
            <div className="footer">
                <p>Version: 1.0.0</p>
            </div>
            <Panel />
        </div>
    )
}