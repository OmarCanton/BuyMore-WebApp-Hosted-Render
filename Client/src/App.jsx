import React, { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Cart from './Pages/Cart'
import NewArrivalsPage from './Pages/NewArrivalsPage'
import Favorites from './Pages/Favorites'
import About from './Pages/About'
import Account from './Pages/Account'
import Themes from './Pages/Themes'
import OrderPayment from './Pages/OrderPayment'
import TermsAndCons from './Pages/TermsAndCons'
import Dev from './Pages/Developer'
import ScrollPageToTop from './Components/ScrollPageToTop'
import { Toaster } from 'react-hot-toast'
import { userDetailsContext, themesContext } from './Contexts/userDataContext'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProfileImage, 
  selectUserProfileImage, 
  selectImageLoading, 
  selectImageError
} from '../src/Redux/Slices/imageslice'
import { AnimatePresence } from 'framer-motion'
import { CircularProgress } from '@mui/material'

const LazyLoadSettings = React.lazy(() => import('./Pages/Settings'))
const LazyLoadShop = React.lazy(() => import('./Pages/Shop'))
const LazyLoadSignup = React.lazy(() => import('./Pages/Signup'))
const LazyLoadLogin = React.lazy(() => import('./Pages/Login'))
const LazyLoadResetPassword = React.lazy(() => import('./Pages/ResetPasssword'))
const LazyLoadVerifyEmailAcc = React.lazy(() => import('./Pages/VerifyAccountEmail'))
const LazyLoadProductCheck = React.lazy(() => import('./Pages/Product'))
const LazyLoadSuccessPage = React.lazy(() => import('./Pages/PaymentPages/Success'))
const LazyLoadCancelPage = React.lazy(() => import('./Pages/PaymentPages/Cancel'))
const LazyLoadPageNotFound = React.lazy(() => import('./Pages/PageNotFound'))

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
  const [isVisible, setIsVisible] = useState(true)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const location = useLocation ()


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

  return (
    <>
      <Toaster 
        position='bottom-right'
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
            isVisible, setIsVisible
          }}>
          <AnimatePresence mode='wait'>
            <ScrollPageToTop />
            <Routes location={location} key={location.pathname}>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='settings' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadSettings />
                </Suspense>
              } />
              <Route path='settings/account' element={<Account />} />
              <Route path='settings/themes' element={<Themes />}/>
              <Route path='settings/order_Payment_History' element={<OrderPayment />}/>
              <Route path='settings/terms_and_conditions' element={<TermsAndCons />}/>
              <Route path='about' element={<About />} />
              <Route path='dev' element={<Dev />} />
              <Route path='cart' element={<Cart />} />
              <Route path='newArrivals' element={<NewArrivalsPage />} />
              <Route path='shop' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadShop />
                </Suspense>
              } />
              <Route path='favorites' element={<Favorites />} />
              <Route path='login' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadLogin />
                </Suspense>
              } />
              <Route path='signup' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadSignup />
                </Suspense>
              } />
              <Route path='reset-password/:token' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadResetPassword />
                </Suspense>
              } />
              <Route path='verifyEmail/:token' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadVerifyEmailAcc />
                </Suspense>
              } />
              <Route path='product/:id' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadProductCheck />
                </Suspense>
              } />
              <Route path='checkout/success' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadSuccessPage />
                </Suspense>
              } />
              <Route path='checkout/cancel' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadCancelPage />
                </Suspense>
              } />
              <Route path='*' element={
                <Suspense fallback={<CircularProgress />}>
                  <LazyLoadPageNotFound />
                </Suspense>
              }/>
            </Routes>
          </AnimatePresence>
        </userDetailsContext.Provider>
      </themesContext.Provider>
    </>
  )
}