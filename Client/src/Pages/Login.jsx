import { useState, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Login.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { userDetailsContext, themesContext } from '../Contexts/userDataContext'
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material'
import { CircularProgress, Dialog, DialogActions, DialogTitle, Slide } from '@mui/material'

export default function Login () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [open, setOpen] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [reVerify, setReVerify] = useState(false)
    const [verifyOpen, setVerifyOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState()
    const [loading, setLoading] = useState(false) 
    const [forgotPassLoading, setForgotPassLoading] = useState(false) 
    const [shake, setShake] = useState(false) 
    const passInputRef = useRef()
    const containerShakeRef = useRef()
    const navigate = useNavigate() 

    const {theme, themeStyles} = useContext(themesContext)
    const { 
        setUser_username, 
        setIsLoggedIn, 
        setUserId, 
        setUserEmail, 
        setAbout, 
        setPhone 
    } = useContext(userDetailsContext)
    
    const userData = { email, password, rememberMe }

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        setShake(false)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/login`, userData, { withCredentials: true })
            if(response.data.error) {
                if(response.data.hasToVerify) {
                    setReVerify(response.data.hasToVerify)
                }
                toast.error(response.data.error, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
                passInputRef.current.value = ''
                setPassword('')
                setShake(true)
            }
            if(response.data.success) {
                toast.success(response.data.success, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
                setIsLoggedIn(true)
                setUser_username(response.data.user.username)
                setUserId(response.data.user._id)
                setUserEmail(response.data.user.email)
                setAbout(response.data.user.about) 
                setPhone(response.data.user.phone)
                navigate('/')
            }
            setLoading(false)
        } catch (error) {
            //The reason it's !error.response is that, if the server is not running at all there wont be any error from the server
            if(!error.response) {
                toast.error('An unexpected error occured\n It could be that the server is down or not working!', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                    duration: 3000
                })
            } else {
                toast.error('An unexpected error occured!', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                    duration: 3000
                })
            }
            setLoading(false)
        }
    }

    const reVerifyUser = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/reVerify`, { email })
            if(response.data.linkSent) {
                setDialogContent(response.data.msg)
                setVerifyOpen(true)
            }
            if(response.data.error) {
                toast.error(response.data.error, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                })
            }
            setLoading(false)
        } catch(err) {
            toast.error(`An error occurred ${err}`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                },
            })
        }
        
    }

    const showPasswordFunc = () => {
        setShowPassword((showPassword) => !showPassword)
    }
   

    const resetPassword = async (e) => {
        e.preventDefault()
        setOpen(false)
        setForgotPassLoading(true)
        try {
            const response = await axios. post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/forgot-password`, {resetEmail})
            if(response.data.success) {
                toast.success(response.data.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                    duration: 10000
                })
            }
            if(response.data.success === false) {
                toast.error(response.data.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                    duration: 5000
                })    
            }
            setForgotPassLoading(false)
        } catch (err) {
            console.log(err)
            toast.error('An unexpected error occured!', {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                },
                duration: 5000
            })
        } finally {
            setResetEmail('')
        }

    }


    return(
        <div 
            className="parent-wrapper"
            style={{backgroundColor: themeStyles.style.backgroundColor}}
        >
            <div 
                ref={containerShakeRef}
                key={shake}
                style={{...theme === 'dark' && {boxShadow: '0 5px 10px -3px black'}, ...shake && {animation: 'shake 0.2s forwards'}}}
                className='login-wrapper'
            >
                <div className='welcomeMsg'>
                    <div className='child1'>
                        <p>Welcome to BuyMore</p>
                        <p>Please sign into your account</p>
                    </div>
                    <div className='child2'>
                        <p>Don&apos;t have an account yet?</p>
                        <div>
                            <Link to='/signup'>
                                <button>Signup</button>
                            </Link>
                            
                        </div>
                    </div>
                </div>
                <div 
                    style={{backgroundColor: themeStyles.style.divColor}}
                    className="login-form"
                >
                    <div className="loginHeader">
                        <span style={{ color: themeStyles.style.color}}>Sign In to BuyMore</span>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className='email'>
                            <input type="email" name="email" id="email" placeholder='Enter your email' onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div className='pass'>
                            <input style={{paddingRight: 50}} ref={passInputRef} type= { showPassword ? 'text' : 'password' } name="password" id="password" placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                            <span className='viewPass' onClick={showPasswordFunc}>
                                { showPassword ? <VisibilityOff htmlColor='grey' style={{cursor: 'pointer'}}/> : <Visibility htmlColor='#1D2671' style={{cursor: 'pointer'}} /> }
                            </span>
                        </div>
                        <span className='rememberMe'>
                            <input type="checkbox" id='rememberMe' onChange={() => setRememberMe((rememberMe) => !rememberMe)}/>
                            <label style={{ color: themeStyles.style.color}} htmlFor="rememberMe">Remember Me</label>
                        </span>
                        { reVerify ? 
                            <span className='verifyButton' onClick={reVerifyUser}>{loading && <CircularProgress style={{width: 25, height: 25, color: 'white'}}/>}Verify</span>
                            :
                            <button>{loading && <CircularProgress style={{width: 25, height: 25, color: 'white'}}/>}Login</button>
                        }
                        <span className="forgotPassword" onClick={() => setOpen(true)}>
                            {forgotPassLoading && <CircularProgress style={{width: 25, height: 25}}/>}
                            <Link style={{ color: themeStyles.style.color}}>Forgot Password?</Link>
                        </span>
                        <span className='singup-noAcc' style={{...theme === 'dark' && {color: 'white'}}}>
                            Don&apos;t have an account yet?&nbsp;<Link to={'/signup'}>Signup</Link>&nbsp;now
                        </span>
                    </form>
                </div>
            </div>
            <Dialog 
                open={open}
                TransitionComponent={Slide}
                TransitionProps={{direction: 'up'}}
                PaperProps={{ 
                    style: {
                        width: '35%',
                        height: 'fit-content',
                        paddingLeft: 10,
                        paddingRight: 10,
                        ...window.innerWidth <= 768 && {width: '50%'},
                        ...window.innerWidth <= 425 && {width: '80%'},
                        ...window.innerWidth <= 375 && {width: '95%'},
                    }
                }}
                onClose={ (event, reason) => {
                    if(reason === 'escapeKeyDown') {
                        setOpen(false)
                    }
                } }
            
            >
                <DialogTitle><h4>Forgot Password?</h4></DialogTitle>
                <i>Enter your email to reset your password</i>
                <form onSubmit={resetPassword} style={{width: '100%'}}>
                    <input 
                        autoFocus
                        type="email" 
                        style={{
                            width: '98%',
                            padding: 10, 
                            cursor: 'auto', 
                            marginTop: 5, 
                            fontSize: 'medium', 
                            border: '1px solid #1D2671', 
                            borderRadius: 3,
                            
                        }}
                        onChange={(e) => setResetEmail(e.target.value)} 
                        placeholder='Enter email here...' 
                    />
                </form>
                <DialogActions>
                    <button style={{width: 75, padding: 5, marginTop: 25, cursor: 'pointer'}} onClick={resetPassword}>Confirm</button>
                    <button style={{width: 75, padding: 5, marginTop: 25, cursor: 'pointer'}} onClick={() => setOpen(false)}>Cancel</button>
                </DialogActions>
            </Dialog>
            <Dialog 
                open={verifyOpen} 
                TransitionComponent={Slide}
                TransitionProps={{direction: 'up'}}
                onClose={(event, reason) => {
                    if(reason === 'backdropClick' || reason === 'escapeKeyDown'){
                        setVerifyOpen(false)
                    }
                }}
                PaperProps={{style: {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                    width: '30%',
                    height: 'fit-content',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 35,
                    paddingBottom: 35,
                    gap: 35,
                    textAlign: 'center',
                    ...window.innerWidth <= 768 && {width: '50%'},
                    ...window.innerWidth <= 425 && {width: '80%'},
                    ...window.innerWidth <= 375 && {width: '95%'},
                }}}
            >
                <CheckCircle 
                    fontSize='large' 
                    htmlColor='green'
                    style={{transform: 'scale(2.5)'}} 
                />
                {dialogContent}
            </Dialog>
        </div>
    )
}