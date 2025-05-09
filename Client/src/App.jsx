import React, { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './Pages/Home'
import Cart from './Pages/Cart'
import NewArrivalsPage from './Pages/NewArrivalsPage'
import Favorites from './Pages/Favorites'
import About from './Pages/About'
import Themes from './Pages/Themes'
import OrderPayment from './Pages/OrderPayment'
import ScrollPageToTop from './Components/ScrollPageToTop'
import toast, { Toaster } from 'react-hot-toast'
import { userDetailsContext, themesContext } from './Contexts/userDataContext'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import { CircularProgress } from '@mui/material'
import './Styles/App.css'
import { logout, updateToken, tokenState, userState } from './Redux/Slices/authSlice'

const LazyLoadSettings = React.lazy(() => import('./Pages/Settings'))
const LazyLoadShop = React.lazy(() => import('./Pages/Shop'))
const LazyLoadSignup = React.lazy(() => import('./Pages/Signup'))
const LazyLoadLogin = React.lazy(() => import('./Pages/Login'))
const LazyLoadAccount = React.lazy(() => import('./Pages/Account'))
const LazyLoadResetPassword = React.lazy(() => import('./Pages/ResetPasssword'))
const LazyLoadVerifyEmailAcc = React.lazy(() => import('./Pages/VerifyAccountEmail'))
const LazyLoadProductCheck = React.lazy(() => import('./Pages/Product'))
const LazyLoadSuccessPage = React.lazy(() => import('./Pages/PaymentPages/Success'))
const LazyLoadCancelPage = React.lazy(() => import('./Pages/PaymentPages/Cancel'))
const LazyLoadPageNotFound = React.lazy(() => import('./Pages/PageNotFound'))
const LazyLoadDev = React.lazy(() => import('./Pages/Developer'))
const LazyLoadTerms = React.lazy(() => import('./Pages/TermsAndCons'))

export default function App () {
  const dispatch = useDispatch()
  const [openMenu, setOpenMenu] = useState(false)
  const [showThemeOverlay, setShowThemeOverlay] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const [isConnected, setIsConnected] = useState(navigator.onLine) //default to online since the app is rendered when you have internet connectivity else the website wont open
  const location = useLocation ()
  const navigate = useNavigate()
  const token = useSelector(tokenState)
  const user = useSelector(userState)
  const id = user?._id

  //constantly refresh the token every 14 minutes
  // this is to prevent the user from being logged out when the token expires
  useEffect(() => {
    const refreshPage = setInterval(async () => {
      if(!token) return
      try {
        const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/refresh/${id}`, {} , {withCredentials: true})
        if(response?.status === 200) {
          dispatch(updateToken(response?.data?.token))
        }
      } catch (err) {
        console.error('Error refreshing token:', err)
        toast.error(err?.response?.data?.message)
        await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/logout/${id}`, {withCredentials: true})
        dispatch(logout())
        navigate('/')
      }
    }, 14 * 60 * 1000)
    return () => clearInterval(refreshPage)
  }, [dispatch, navigate, token, id])

  useEffect(() => {
    if(openMenu) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }, [openMenu])

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


  //check internet connectivity
  useEffect(() => {
    const connected = () => {
      setIsConnected(true)
    }
    const disconnected = () => {
      setIsConnected(false)
      alert('No Internet')
    }

    window.addEventListener('online', connected)
    window.addEventListener('offline', disconnected)

    return () => {
      window.removeEventListener('online', connected)
      window.removeEventListener('offline', disconnected)
    } 
  }, [isConnected])

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
            openMenu, setOpenMenu,
            isVisible, setIsVisible
          }}>
          <AnimatePresence mode='wait'>
            <ScrollPageToTop />
            <Routes location={location} key={location.pathname}>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='settings' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadSettings />
                </Suspense>
              } />
              <Route path='settings/account' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadAccount />
                </Suspense>
              } />
              <Route path='settings/themes' element={<Themes />}/>
              <Route path='settings/order_Payment_History' element={<OrderPayment />}/>
              <Route path='settings/terms_and_conditions' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadTerms />
                </Suspense>
              }/>
              <Route path='about' element={<About />} />
              <Route path='dev' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadDev />
                </Suspense>
              } />
              <Route path='cart' element={<Cart />} />
              <Route path='newArrivals' element={<NewArrivalsPage />} />
              <Route path='shop' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>  
                  <LazyLoadShop />
                </Suspense>
              } />
              <Route path='favorites' element={<Favorites />} />
              <Route path='login' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadLogin />
                </Suspense>
              } />
              <Route path='signup' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadSignup />
                </Suspense>
              } />
              <Route path='reset-password/:token' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadResetPassword />
                </Suspense>
              } />
              <Route path='verifyEmail/:token' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadVerifyEmailAcc />
                </Suspense>
              } />
              <Route path='product/:id' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadProductCheck />
                </Suspense>
              } />
              <Route path='checkout/success' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadSuccessPage />
                </Suspense>
              } />
              <Route path='checkout/cancel' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
                  <LazyLoadCancelPage />
                </Suspense>
              } />
              <Route path='*' element={
                <Suspense fallback={
                  <div 
                    style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
                    className='activityIndicator'
                  >
                    <CircularProgress />
                  </div>
                }>
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