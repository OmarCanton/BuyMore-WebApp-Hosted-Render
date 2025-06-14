import { useState, useContext, useRef } from "react"
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Slide } from "@mui/material"
import { ArrowBackIosNewRounded, PhotoCamera, AccountCircle, Logout, Cancel, Edit, InfoRounded } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import '../Styles/Account.css'
import { themesContext } from "../Contexts/userDataContext"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import DialogComponent from "../Components/Dialog"
import { 
    userState, 
    tokenState,
    logout, 
    updateUsername, 
    updateUserPhone, 
    updateUserAbout, 
    updateProfileImage 
} from "../Redux/Slices/authSlice"
import { useDispatch, useSelector } from "react-redux"


export default function Account () {
    const navigate = useNavigate()
    const user = useSelector(userState)
    const token = useSelector(tokenState)
    const dispatch = useDispatch()
    const {theme, themeStyles} = useContext(themesContext)
    const [usernameOpen, setUsernameOpen] = useState(false)
    const [phoneOpen, setPhoneOpen] = useState(false)
    const [aboutOpen, setAboutOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [usernameDialogContent, setUsernameDialogContent] = useState('')
    const [phoneDialogContent, setPhoneDialogContent] = useState('')
    const [aboutDialogContent, setAboutDialogContent] = useState('')
    const [updatedUsername, setUpdatedUsername] = useState('')
    const [updatedPhone, setUpdatedPhone] = useState('')
    const [updatedAbout, setUpdatedAbout] = useState('')
    const [viewProfile, setViewProfile] = useState(false)
    const [delAccOpen, setDelAccOpen] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetOpen, setResetOpen] = useState(false)
    const [finalAccDelOpen, setFinalAccDelOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
    const inputRef = useRef()
    const delInputRef = useRef()
    const inputChangeRefs = useRef()
    const [viewOps, setViewOps] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const id = user?._id


    const changeUsername = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/changeUsername/${user?._id}`, {updatedUsername}, {withCredentials: true})
            if(response?.status === 200) {
                dispatch(updateUsername(updatedUsername))
                toast.success('Username was sucessfully changed', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
                setUsernameOpen(false)
            }
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
            setUsernameOpen(true)
            inputChangeRefs.current.value = ''
            inputChangeRefs.current.focus()
        }
    }

    const updatePhone = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/updatePhone/${user?._id}`, {updatedPhone}, {withCredentials: true})
            if(response?.status === 200) {
                dispatch(updateUserPhone(updatedPhone))
                toast.success('Phone was sucessfully set', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
                setPhoneOpen(false)
            }
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
            setPhoneOpen(true)
            inputChangeRefs.current.value = ''
            inputChangeRefs.current.focus()
        }
    }
    const updateAbout = async () => {
        setAboutOpen(false)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/updateAbout/${user._id}`, {updatedAbout}, {withCredentials: true})
            if(response?.status === 200) {
                dispatch(updateUserAbout(updatedAbout))
                toast.success('About was sucessfully set', {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
            }
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
            setAboutOpen(true)
            inputChangeRefs.current.value = ''
            inputChangeRefs.current.focus()
        }
    }

    const selectPicture = () => {
        inputRef.current.click()
        setViewProfile(false)
        setViewOps(false)
    }

    const updateProfilePicture = async (e) => {
        const file = e.target.files[0]
        if(file) {
            const formData = new FormData()
            formData.append('profileImage', file)
            try {
                const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/updateProfilePicture/${user?._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }, 
                    withCredentials: true 
                })
                if(response?.status === 200) {
                    dispatch(updateProfileImage(response?.data?.userProfileImage))
                    toast.success(response?.data?.message, {
                        style: {
                            backgroundColor: 'black',
                            color: 'white'
                        }
                    })
                }
            } catch(err) {
                console.error(err)
                toast.error(err?.response?.data?.message)
                inputRef.current.value = ''
                inputRef.current.focus()
            } finally {
                setViewProfile(false)
                setViewOps(false)
            }
        }
    }
    const deleteProfilePicture = async () => {
        setViewProfile(false)
        setViewOps(false)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/deleteProfilePicture/${user?._id}`)
            if(response?.status === 200) {
                dispatch(updateProfileImage(null))
                toast.success(response?.data?.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
            }
        } catch (err) {
            console.error(err)
            toast.error(err?.response?.data?.message)
        }
    } 
    
    const logoutUser = async () => {
        setLoggingOut(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/logout/${id}`, { withCredentials: true })
            if(response.status === 200) {
                toast.success(response?.data?.message)
                navigate('/')
            }
            dispatch(logout())
            setLoggingOut(false)
        } catch(err) {
            console.error(err)
            toast.error(err?.response?.data?.message)
            setLoggingOut(false)
        }
    }

    const delUser = async (e) => {
        e.preventDefault()
        setDelAccOpen(false)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/delUser/${user?._id}`, { password })
            if(response?.status === 200) {
                dispatch(logout())
                navigate('/')
                toast.success(response?.data?.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
            }
            
        } catch (err) {
            console.log(err)
            delInputRef.current.value = ''
            delInputRef.current.focus()    
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                },
            })
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        setResetOpen(false)
        setOpenLoadingSpinner(true)
        const userEmail = user?.email
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/forgot-password`, {resetEmail, userEmail})
            if(response?.status === 200) {
                toast.success(response?.data?.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
            }
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        } finally {
            setOpenLoadingSpinner(false)
        }

    }

    return (
        <div className="accounts-wrapper" 
            style={{
                backgroundColor: themeStyles.style.backgroundColor,
                ...!token && {height: '100vh'}
            }}
        >
            <div 
                style={{...!token && {position: 'absolute', top: 0}}}
                className="accounts-backTitle"
            >
                <Button title="Back" 
                    style={{cursor: 'pointer'}} 
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <h2 
                    style={{color: themeStyles.style.color}}
                >Account Settings</h2>
                { token &&
                    <div className="header-logout" title="Logout" onClick={logoutUser}>
                        { 
                            loggingOut ? <CircularProgress style={{width: 25, height: 25, ...theme === 'dark' ? {color: 'white'} : {color: 'grey'}}} /> 
                            : 
                            <Logout htmlColor="red" style={{transform: 'scale(1.3)'}} />
                        }
                    </div>
                }
            </div>
            { token ?
                <>
                    <div className="profileImage">
                        { user?.profileImage ?
                            <img onClick={() => setViewProfile(true)} src={user?.profileImage} alt={user?.username} />
                            :
                            <AccountCircle fontSize='large' htmlColor='grey' style={{transform: 'scale(1.2)'}} className="noProfilePic" />         
                        }
                        <PhotoCamera onClick={selectPicture} htmlColor="white" className="changeProfile" fontSize="large" />
                    </div>
                    <input ref={inputRef} type="file" accept='image/png, image/jpeg, image/jpg' onChange={updateProfilePicture} style={{display: 'none'}} />
                </>
                :
                <AccountCircle style={{width: 300, height: 300}} htmlColor='grey' />
            }
            
            {token && 
                <div className="email">
                    <span 
                        style={{backgroundColor: themeStyles.style.divColor, color: themeStyles.style.color}}
                    >Email</span>
                    <p style={{color: themeStyles.style.color}}>{user?.email}</p>    
                </div>
            }
            <div className="username">
                <span 
                    style={{backgroundColor: themeStyles.style.divColor, color: themeStyles.style.color}}
                >Username</span>
                {token ? 
                    <p> 
                        <pre style={{color: themeStyles.style.color}}>{user?.username}</pre>
                        <button onClick={() => { 
                            setDialogTitle('Change Username')
                            setUsernameDialogContent(() => { 
                                return ( 
                                    <input 
                                        autoFocus
                                        ref={inputChangeRefs}
                                        type="text"
                                        placeholder="Enter new Username"
                                        onChange={(e) => setUpdatedUsername(e.target.value)}
                                        style={{
                                            padding: "10px", 
                                            width: '100%',
                                            fontSize: 'medium',
                                            cursor: 'auto'
                                        }}
                                    /> 
                                )
                            })
                            setUsernameOpen(true)
                        }}>Change</button>
                    </p>
                : <pre style={{...theme === 'dark' && {color: 'white'}}}>Guest</pre>
                }
            </div>
            {token && 
                <div className="phoneNumber">
                    <span 
                        style={{backgroundColor: themeStyles.style.divColor, color: themeStyles.style.color}}
                    >Phone</span>
                    <p>
                        <pre style={{color: themeStyles.style.color}}>{user?.phone ? user?.phone : <span className="otherSpan" style={{color: 'grey'}}>Add Phone number</span>}</pre> 
                        <button onClick={() => { 
                        setDialogTitle('Add/Change Phone')
                        setPhoneDialogContent(() => { 
                            return ( 
                                <input 
                                    autoFocus
                                    ref={inputChangeRefs}
                                    type="number" 
                                    placeholder="Enter Phone Number"
                                    onChange={(e) => setUpdatedPhone(e.target.value)}
                                    style={{
                                        padding: "10px", 
                                        width: '100%',
                                        fontSize: 'medium',
                                        cursor: 'auto'
                                    }}
                                />
                            )
                        })
                        setPhoneOpen(true)
                    }}>Change</button>
                    </p>
                </div>
            }
            {token &&
                <>
                    <div className="about">
                        <span 
                            style={{backgroundColor: themeStyles.style.divColor, color: themeStyles.style.color}}
                        >About</span>
                        <p>
                            <pre style={{color: themeStyles.style.color}}>{user?.about ? user?.about : <span className="otherSpan" style={{color: 'grey'}}>Briefly write about yourself</span>} </pre> 
                            <button onClick={() => { 
                                setDialogTitle('Add/Change About')
                                setAboutDialogContent(() => { 
                                    return ( 
                                        <input 
                                            type="text" 
                                            placeholder="Write About"
                                            onChange={(e) => setUpdatedAbout(e.target.value)}
                                            style={{
                                                padding: "10px", 
                                                width: '100%',
                                                fontSize: 'medium',
                                                cursor: 'auto'
                                            }}
                                        /> 
                                    )
                                })
                                setAboutOpen(true)
                            }}>Change</button>
                        </p>
                    </div>
                    <div className="status">
                        <span 
                            style={{backgroundColor: themeStyles.style.divColor, color: themeStyles.style.color}}
                        >Status</span>
                        <p style={{color: themeStyles.style.color}}>Regular User</p>
                    </div>
                </>
            }
            { token ?
                <div className="resetDel">
                    <button
                        style={{...theme === 'dark' && {border: '1px solid white', color: themeStyles.style.color}}} 
                        className="resetPassword"
                        onClick={() => setResetOpen(true)}
                    >{openLoadingSpinner? <CircularProgress style={{width: 25, height: 25}} /> : 'Reset Password'}</button>
                    <button className="delAcc" onClick={() => setDelAccOpen(true)}>Delete Account</button>
                </div>
                :
                <Link to='/login'>
                    <button className="accLogin">Login</button>
                </Link>
            }
            <DialogComponent 
                open={usernameOpen}
                setOpen={setUsernameOpen}
                title={dialogTitle}
                content={usernameDialogContent}
                func={changeUsername}
            />
            <DialogComponent 
                open={phoneOpen}
                setOpen={setPhoneOpen}
                title={dialogTitle}
                content={phoneDialogContent}
                func={updatePhone}
            />
            <DialogComponent 
                open={aboutOpen}
                setOpen={setAboutOpen}
                title={dialogTitle}
                content={aboutDialogContent}
                func={updateAbout}
            />
            <Dialog 
                open={viewProfile} 
                onClose={(event, reason) => {
                    if(reason === 'escapeKeyDown') {
                        setViewProfile(false)
                        setViewOps(false)
                    }
                }}
                TransitionComponent={Slide}
                TransitionProps={{direction: 'up'}}
                slotProps={{backdrop: {sx: {backgroundColor: 'rgba(0, 0, 0, 0.95)'}}}}
                PaperProps={{
                    style: {
                        height: '70%', 
                        overflow: 'hidden',
                        ...window.innerWidth <= 425 && {height: '60%', width: '90%'},
                        ...window.innerWidth <= 375 && {height: '50%', width: '90%'}
                    }
                }}
            >
                <img 
                    className="viewProfile" 
                    width={'100%'}
                    height={'100%'}
                    src={user?.profileImage} 
                    alt={user?.username}
                    onClick={() => setViewOps(false)}
                />
                <DialogActions style={{
                    position: 'absolute', 
                    top: 5,
                    padding: 20,
                    borderRadius: 50,
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Edit htmlColor="#1D2671" onClick={() => setViewOps(true)} style={{ borderRadius: 50, padding: 5, width: 30, height: 30, backgroundColor: 'lightgrey'}}/>
                    <Cancel htmlColor="red"  onClick={() => { 
                        setViewProfile(false)
                        setViewOps(false)
                    }}/>
                    <div
                        style={{...viewOps && {opacity: 1, pointerEvents: 'all'}}}
                        className="delChange"
                    >
                        <ul>
                            <li onClick={selectPicture} className="change">Change</li>
                            <li onClick={deleteProfilePicture} className="remove">Remove</li>
                        </ul>
                    </div>
                </DialogActions>
            </Dialog>
            <Dialog 
                open={delAccOpen} 
                PaperProps={{
                    style: {padding: 30}
                }}
                onClose={(event, reason) => {
                    if(reason === 'escapeKeyDown') setDelAccOpen(false)
                }}
            >
                <div style={{display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <InfoRounded htmlColor="#1D2671" fontSize="large"/>
                    <h3>Delete Account?</h3>
                </div>
                <DialogActions>
                    <button style={{cursor: 'pointer', width: 80, marginTop: 10}} onClick={() => { 
                        setFinalAccDelOpen(true)
                        setDelAccOpen(false)
                    }}>Yes</button>
                    <button style={{cursor: 'pointer', width: 80, marginTop: 10}} onClick={() => setDelAccOpen(false)}>Cancel</button>
                </DialogActions>
            </Dialog>
            <Dialog 
                open={finalAccDelOpen} 
                PaperProps={{
                    style: {
                        padding: 30,
                        height: 'fit-content',
                        ...window.innerWidth <= 375 && {padding: 20},
                    }
                }}
                onClose={(event, reason) => {
                    if(reason === 'escapeKeyDown') setFinalAccDelOpen(false)
                }}
            >
                <DialogTitle style={{display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <InfoRounded htmlColor="#1D2671" fontSize="large" />
                    <h3 style={{...window.innerWidth <= 375 && { width: '100%', fontSize: '1.2rem'}}}>Confirm Deletion</h3>
                </DialogTitle>
                <div style={{display: 'flex', width: '100%', gap: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <form onSubmit={delUser} style={{width: '100%'}}>
                        <input 
                            ref={delInputRef}
                            autoFocus 
                            style={{width: '100%', padding: 5}} 
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Confirm password to delete account" 
                        />
                    </form>
                </div>
                <DialogActions>
                    <button 
                        style={{
                            cursor: 'pointer', 
                            width: 80, 
                            marginTop: 10, 
                            backgroundColor: 'red', 
                            color: 'white', 
                            border: 'none', 
                            padding: 5
                        }} 
                        onClick={delUser}
                    >Delete</button>
                </DialogActions>
            </Dialog>
            
            <Dialog 
                open={resetOpen}
                TransitionComponent={Slide}
                TransitionProps={{direction: 'up'}}
                PaperProps={{ 
                    style: {
                        width: '35%',
                        paddingLeft: 10,
                        paddingRight: 10, 
                        height: 'fit-content',
                        textAlign: 'center',
                        ...window.innerWidth <= 768 && {width: '50%'},
                        ...window.innerWidth <= 425 && {width: '80%'},
                        ...window.innerWidth <= 375 && {width: '95%'},
                    }
                }}
                onClose={ (event, reason) => {
                    if(reason === 'escapeKeyDown') {
                        setResetOpen(false)
                    }
                } }
            
            >
                <DialogTitle><h4>Password Reset</h4></DialogTitle>
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
                            borderRadius: 3
                        }}
                        onChange={(e) => setResetEmail(e.target.value)} 
                        placeholder='Enter email here...' 
                    />
                </form>
                <DialogActions>
                    <button style={{width: 75, padding: 5, marginTop: 25, cursor: 'pointer'}} onClick={resetPassword}>Confirm</button>
                    <button style={{width: 75, padding: 5, marginTop: 25, cursor: 'pointer'}} onClick={() => setResetOpen(false)}>Cancel</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}