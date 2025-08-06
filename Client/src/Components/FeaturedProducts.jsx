import { useEffect, useContext, useState } from "react"
import { Verified } from '@mui/icons-material'
import { themesContext } from "../Contexts/userDataContext"
import ProductContainer from "./ProductContainer"
import axios from "axios"
import '../Styles/overallPrdsContainer2.css'
import { Puff } from "react-loader-spinner"

export default function FeaturedProducts () {
    const { theme, themeStyles } = useContext(themesContext)
    const [applePrds, setApplePrds] =  useState([])
    const [nikePrds, setNikePrds] = useState([])
    const [samsungPrds, setSamsungPrds] = useState([])
    const [lvtPrds, setLvtPrds] = useState([])
    const [loadingApplePrds, setLoadingApplePrds] = useState(false)
    const [loadingNikePrds, setLoadingNikePrds] = useState(false)
    const [loadingSamsungPrds, setLoadingSamsungPrds] = useState(false)
    const [loadingLVTPrds, setLoadingLVTPrds] = useState(false)

    //apple
    useEffect(() => {
        const fetchApplePrds = async () => {
            setLoadingApplePrds(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/appleFeaturedProducts`)
                setApplePrds(response?.data?.featuredProducts)
            } catch(err) {
                console.error(err)
            } finally {
                setLoadingApplePrds(false)
            }
        }
        fetchApplePrds()
    }, [])

    //nike
    useEffect(() => {
        const fetchNikePrds = async () => {
            setLoadingNikePrds(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/nikeFeaturedProducts`)
                setNikePrds(response?.data?.featuredProducts)
            } catch(err) {
                console.error(err)
            } finally {
                setLoadingNikePrds(false)
            }
        }
        fetchNikePrds()
    }, [])

    //samsung
    useEffect(() => {
        const fetchSamsungPrds = async () => {
            setLoadingSamsungPrds(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/samsungFeaturedProducts`)
                setSamsungPrds(response?.data?.featuredProducts)
            } catch(err) {
                console.error(err)
            } finally {
                setLoadingSamsungPrds(false)
            }
        }
        fetchSamsungPrds()
    }, [])
    
    //louis vuitton
    useEffect(() => {
        const fetchLVTPrds = async () => {
            setLoadingLVTPrds(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/luisVuittonFeaturedProducts`)
                setLvtPrds(response?.data?.featuredProducts)
            } catch(err) {
                console.error(err)
            } finally {
                setLoadingLVTPrds(false)
            }
        }
        fetchLVTPrds()
    }, [])

    return (
        (loadingApplePrds || loadingNikePrds || loadingSamsungPrds || loadingLVTPrds) ? (
            <div style={{padding: 30}}>
                <Puff
                    height={40}
                    width={40}
                    radius={1}
                    color="#007aff"
                    ariaLabel="puff-loading"
                    visible={true}
                />
            </div>
        ):(
            <>
                <div className="apple">
                    <h2 
                        style={{color: themeStyles.style.color, width: '100%', paddingLeft: window.innerWidth > 700 ? '9%': '5%', display: 'flex', alignItems: 'center', gap: 2}}
                    >FROM APPLE <Verified style={{color: theme === 'dark' ? 'lightgrey' : 'grey'}} /></h2>
                    <div className="container">
                        <div className={window.innerWidth <= 768 ? 'gridContainer2' : 'gridContainer'}>
                            {applePrds.map((product, index) => (
                                <ProductContainer key={index} item={product}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="nike">
                    <h2 
                        style={{color: themeStyles.style.color, width: '100%', paddingLeft: window.innerWidth > 700 ? '9%': '5%', display: 'flex', alignItems: 'center', gap: 2}}
                    >FROM NIKE <Verified style={{color: theme === 'dark' ? 'lightgrey' : 'grey'}} /></h2>
                    <div className="container">
                    <div className={window.innerWidth <= 768 ? 'gridContainer2' : 'gridContainer'}>
                        {nikePrds.map((product, index) => (
                            <ProductContainer key={index} item={product}/>
                        ))}
                    </div>
                    </div>
                </div>
                <div className="samsung">
                    <h2 
                        style={{color: themeStyles.style.color, width: '100%', paddingLeft: window.innerWidth > 700 ? '9%': '5%', display: 'flex', alignItems: 'center', gap: 2}}
                    >FROM SAMSUNG <Verified style={{color: theme === 'dark' ? 'lightgrey' : 'grey'}} /></h2>
                    <div className="container">
                        <div className={window.innerWidth <= 768 ? 'gridContainer2' : 'gridContainer'}>
                            {samsungPrds.map((product, index) => (
                                <ProductContainer key={index} item={product}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="louisVuitton">
                    <h2 
                        style={{color: themeStyles.style.color, width: '100%', paddingLeft: window.innerWidth > 700 ? '9%': '5%', display: 'flex', alignItems: 'center', gap: 2}}
                    >FROM LOUIS VUITTON <Verified style={{color: theme === 'dark' ? 'lightgrey' : 'grey'}} /></h2>
                    <div className="container">
                        <div className={window.innerWidth <= 768 ? 'gridContainer2' : 'gridContainer'}>
                            {lvtPrds.map((product, index) => (
                                <ProductContainer key={index} item={product}/>
                            ))}
                        </div>
                    </div>
                </div>
                {
                    (
                        applePrds.length === 0 && 
                        nikePrds.length === 0 &&
                        samsungPrds.length === 0 &&
                        lvtPrds.length === 0
                    ) && <div style={{color: theme === 'dark' && 'white', padding: '40px'}}>Oops, no products found at this time!</div>
                }
            </>
        )
    )
}