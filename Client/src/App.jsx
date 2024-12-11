import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Settings from './Pages/Settings'
import Cart from './Pages/Cart'
import PageNotFound from './Pages/PageNotFound'
import NewArrivalsPage from './Pages/NewArrivalsPage'
import Favorites from './Pages/Favorites'
import Shop from './Pages/Shop'
import About from './Pages/About'
import SuccessPage from './Pages/PaymentPages/Success'
import CancelPage from './Pages/PaymentPages/Cancel'
import ResetPassword from './Pages/ResetPasssword'
import VerifyAccountEmail from './Pages/VerifyAccountEmail'
import Account from './Pages/Account'
import Themes from './Pages/Themes'
import OrderPayment from './Pages/OrderPayment'
import TermsAndCons from './Pages/TermsAndCons'
import Dev from './Pages/Developer'
import { Toaster } from 'react-hot-toast'
import { userDetailsContext, themesContext } from './Contexts/userDataContext'
import ProductCheck from './Pages/Product'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProfileImage, 
  selectUserProfileImage, 
  selectImageLoading, 
  selectImageError
} from '../src/Redux/Slices/imageslice'
import { AnimatePresence } from 'framer-motion'

export default function App () {
  const [user_username, setUser_username] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const [about, setAbout] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const dispatch = useDispatch()
  const profilePicture = useSelector(selectUserProfileImage)
  const loading = useSelector(selectImageLoading)
  const error = useSelector(selectImageError)
  const [profileChanged, setProfileChanged] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [showThemeOverlay, setShowThemeOverlay] = useState(false)
  // const [isVisible, setIsVisible] = useState(true)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })


  useEffect(() => {
    if(openMenu) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }, [openMenu])

  useEffect(() => {
    dispatch(fetchProfileImage(userId))
  }, [dispatch, userId, profileChanged])

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const  response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/checkAuth`, {withCredentials: true})
        if(response.data.authenticated === true) {
          setIsLoggedIn(true)
          setUser_username(response.data.user.username)
          setUserId(response.data.user._id)
          setUserEmail(response.data.user.email)
          setPhone(response.data.user.phone)
          setAbout(response.data.user.about)
        } else {
          setIsLoggedIn(false)
          setUser_username(null)
          setUserEmail(null)
          setUserId(null)
          setAbout(null)
          setPhone(null)
        }
      } catch (err) {
        console.log(err)
      }
    }
    checkUserAuth()
  }, [setIsLoggedIn, setUser_username, setUserId])


  // For the theme context
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const themeStyles = {
    style: {...theme === 'dark' && {
      backgroundColor: 'rgb(22, 22, 22)',
      color: 'white',
      divColor: '#3C3C3C'
    }} 
  }
  //end

  // const containerStyles = {
  //   ...isVisible && (window.innerWidth <= 768) && {
  //     marginBottom: 40
  //   }
  // }

  return (
    <>
      <Toaster 
        position='bottom-right' 
        // containerStyle={containerStyles} 
        containerStyle={{marginBottom: 40}}
        toastOptions={{ duration: 3000 }} 
      />
      <themesContext.Provider value={{
          theme, setTheme, changeTheme, themeStyles,
          showThemeOverlay, setShowThemeOverlay,
        }}
      >
        <userDetailsContext.Provider value={{ 
            user_username, setUser_username, 
            isLoggedIn, setIsLoggedIn, 
            userId, setUserId,
            userEmail, setUserEmail,
            phone, setPhone,
            about, setAbout,
            profilePicture, loading, error, 
            profileChanged, setProfileChanged,
            openMenu, setOpenMenu,
            // isVisible, setIsVisible
          }}>
          <AnimatePresence mode='wait'>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='settings' element={<Settings />} />
              <Route path='settings/account' element={<Account />} />
              <Route path='settings/themes' element={<Themes />}/>
              <Route path='settings/order_Payment_History' element={<OrderPayment />}/>
              <Route path='settings/terms_and_conditions' element={<TermsAndCons />}/>
              <Route path='about' element={<About />} />
              <Route path='dev' element={<Dev />} />
              <Route path='cart' element={<Cart />} />
              <Route path='newArrivals' element={<NewArrivalsPage />} />
              <Route path='shop' element={<Shop />} />
              <Route path='favorites' element={<Favorites />} />
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
              <Route path='reset-password/:token' element={<ResetPassword />} />
              <Route path='verifyEmail/:token' element={<VerifyAccountEmail />} />
              <Route path='product/:id' element={<ProductCheck />} />
              <Route path='checkout/success' element={<SuccessPage />} />
              <Route path='checkout/cancel' element={<CancelPage />} />
              <Route path='*' element={<PageNotFound />}/>
            </Routes>
          </AnimatePresence>
        </userDetailsContext.Provider>
      </themesContext.Provider>
    </>
  )
}