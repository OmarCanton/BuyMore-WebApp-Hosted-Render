import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Signup.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material'
import { CircularProgress, Dialog, Slide } from '@mui/material'
import { themesContext } from '../Contexts/userDataContext'

export default function Signup () {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState('')
    const [sex, setSex] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false) 
    const [loading, setLoading] = useState(false) 
    const [open, setOpen] = useState(false) 
    const [dialogContent, setDialogContent] = useState('')  
    const [shake, setShake] = useState(false)  
    const {theme, themeStyles} = useContext(themesContext)

    const passwordStrength = (password) => {
        let strength = 0

        if(password.match(/[A-Z]/)) strength++
        if(password.match(/[a-z]/)) strength++
        if(password.match(/\d/)) strength++
        if(password.match(/\W/)) strength++
        if(password.length >= 8) strength++

        return strength
    }
    
    const getBarColor = (strength) => {
        if(strength === 0) {
            return ''
        } else if(strength === 1) {
            return 'red'
        } else if(strength === 2) {
            return 'orange'
        } else if(strength === 3) {
            return 'gold'
        } else if(strength === 4) {
            return 'lightblue'
        } else {
            return 'yellowgreen'
        }
    }
    
    let setText = ''

    const getText = (setText) => {
        if(strength === 0) {
            setText = ''
        } else if(strength === 1) {
            setText = 'Poor'
        } else if(strength === 2) {
            setText = 'Fair'
        } else if(strength === 3) {
            setText = 'Good'
        } else if(strength === 4) {
            setText = 'very Good'
        } else {
            setText = 'Strong'
        }
        return setText
    }

    const strength = passwordStrength(password)
    const backgroundColor = getBarColor(strength)
    const text = getText(setText)

    const barStyle = {
        padding: '2px',
        borderRadius: '15px',
        width: `${strength / 5 * 100}%`,
        backgroundColor: `${backgroundColor}`
    }

    const formData = { username, password, confPassword, email, birthday, sex }
    
    const handleSignUp = async (event) => {
        event.preventDefault()
        setLoading(true)
        setShake(false)
        try {

            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/signup-verify`, formData, { withCredentials: true })
            if(response.data.error) {
                toast.error(response.data.error, {
                    style: {
                        backgroundColor: 'white',
                        color: 'black'
                    },
                    duration: 3000
                })
                setShake(true)
            }
            if(response.data.success) {
                toast.success(response.data.success, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    },
                    duration: 3000,
                })
            }
            setLoading(false)
            if(response.data.linkSent == true) {
                setOpen(true)
                setDialogContent(response.data.msg)
            }

        } catch (error) {
            setLoading(false)
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
                    duration: 4000
                })
            }
        }
    }

    const showPasswordFunc = () => {
        setShowPassword((showPassword) => !showPassword)
    }

    const showConfPasswordFunc = () => {
        setShowConfPassword((showConfPassword) => !showConfPassword)
    }

    return(
        <div 
            style={{backgroundColor: themeStyles.style.backgroundColor, color: themeStyles.style.color}}
            className='wrapper-signup'
        >
            <div 
                className="form-wrapper"
                style={{
                    ...theme === 'dark' && {
                        boxShadow: '0 5px 10px -3px black', 
                        backgroundColor: themeStyles.style.divColor
                    }, 
                    ...shake && {animation: 'shake 0.2s forwards'}
                }}
            >
                <span className='signup-header' style={{color: themeStyles.style.color}}>Sign up to BuyMore</span>
                <form onSubmit={handleSignUp}>
                    <div>
                        <input type="text" name="username" id="username" placeholder="Choose a Username" onChange={(e) => setUsername(e.target.value) } />
                    </div>
                    <div>
                        <input type="email" name="email" id="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value) } />
                    </div>
                    <div className='pass'>
                        <div className="passwordBar" >
                            <span style={barStyle} className='passwordStrength'></span>
                        </div> 
                        <input style={{paddingRight: 50}} type={ showPassword ? 'text' : 'password' } value={password} name="password" id="password" placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)}/>
                        <span className='child2' onClick={showPasswordFunc}>
                            { showPassword ? <VisibilityOff htmlColor='grey' style={{cursor: 'pointer'}} /> : <Visibility htmlColor='#1D2671' style={{cursor: 'pointer'}}  /> }
                        </span>
                    </div>
                    {text &&
                        <small className='strengthText' style={{
                            color: `${barStyle.backgroundColor}`
                        }}>{text}</small>
                    }
                    <div className='pass2'>
                        <input style={{paddingRight: 50}} type={ showConfPassword ? 'text' : 'password' } value={confPassword} name="confPassword" id="confPassword" placeholder='Confirm Password' onChange={(e) => setConfPassword(e.target.value) } />
                        <span className='child2' onClick={showConfPasswordFunc}>
                            { showConfPassword ? <VisibilityOff htmlColor='grey' style={{cursor: 'pointer'}} /> : <Visibility htmlColor='#1D2671' style={{cursor: 'pointer'}} /> }
                        </span>
                    </div>
                    <div>
                        <input type="date" name="birthday" id="birthday" placeholder='Enter Birthdate' onChange={(e) => setBirthday(e.target.value) } />
                    </div>
                    <span className='sexOp'>
                        <label htmlFor="sex" style={{color: themeStyles.style.color}}>Sex:</label>
                        <select name="sex" defaultValue={'none'} id="sex" onChange={(e) => setSex(e.target.value) }>
                            <option value="none" >none</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </span>
                    <button>{loading && <CircularProgress style={{width: 25, height: 25, color: 'white'}}/>} Signup</button>
                </form>
                <div className='loginSignupLink'>
                    Already have an account?&nbsp;<Link style={{...theme === 'dark' && {color: '#dd4273'}}} to='/login'>Login</Link>&nbsp;now
                </div>
            </div>
            <Dialog 
                open={open} 
                TransitionComponent={Slide}
                TransitionProps={{direction: 'up'}}
                onClose={(event, reason) => {
                    if(reason === 'backdropClick' || reason === 'escapeKeyDown'){
                        setOpen(false)
                    }
                }}
                PaperProps={{style: {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                    width: '30%',
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