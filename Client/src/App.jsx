import { useState, useEffect } from 'react'
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
import './Styles/App.css'
import { logout, updateToken, tokenState, userState } from './Redux/Slices/authSlice'
import Settings from './Pages/Settings'
import Shop from './Pages/Shop'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Account from './Pages/Account'
import ResetPassword from './Pages/ResetPasssword'
import VerifyAccountEmail from './Pages/VerifyAccountEmail'
import ProductCheck from './Pages/Product'
import SuccessPage from './Pages/PaymentPages/Success'
import CancelPage from './Pages/PaymentPages/Cancel'
import PageNotFound from './Pages/PageNotFound'
import Dev from './Pages/Developer'
import TermsAndCons from './Pages/TermsAndCons'
import AdminHome from './Pages/admin'
import AddProduct from './Pages/admin/addProduct'
import EditProducts from './Pages/admin/editProducts'
import EditPage from './Pages/admin/editPage'

export default function App () {
  const dispatch = useDispatch()
  const [openMenu, setOpenMenu] = useState(false)
  const [showThemeOverlay, setShowThemeOverlay] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [stripeSessionId, setStripeSessionId] = useState(null)
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
            isVisible, setIsVisible,
            stripeSessionId, setStripeSessionId
          }}>
          <AnimatePresence mode='wait'>
            <ScrollPageToTop />
            <Routes location={location} key={location.pathname}>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='settings' element={<Settings />} />
              <Route path='settings/account' element={<Account />} />
              <Route path='settings/themes' element={<Themes />} />
              <Route path='settings/order_Payment_History' element={<OrderPayment />} />
              <Route path='settings/terms_and_conditions' element={<TermsAndCons />} />
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
              <Route path='admin/dashboard' element={<AdminHome />} />
              <Route path='admin/addProduct' element={<AddProduct />} />
              <Route path='admin/editProduct' element={<EditProducts />} />
              <Route path='admin/editPage/:id' element={<EditPage />} />
              <Route path='*' element={<PageNotFound />}/>
            </Routes>
          </AnimatePresence>
        </userDetailsContext.Provider>
      </themesContext.Provider>
    </>
  )
}