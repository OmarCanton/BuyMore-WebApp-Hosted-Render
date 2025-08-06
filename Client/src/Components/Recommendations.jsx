import { useSelector } from "react-redux"
import ProductContainer from './ProductContainer'
import '../Styles/overallPrdsCont.css'
import { useEffect, useState } from "react"
import { userState } from "../Redux/Slices/authSlice"
import axios from "axios"
import { MutatingDots } from 'react-loader-spinner'
import { Info } from "@mui/icons-material"

export default function Recommendations() {
    const user = useSelector(userState)
    const [recommended_items, setRecommendItems] = useState([])
    const [loadingRecommended, setLoadingRecommended] = useState(false)
    const [seeWhy, setSeeWhy] = useState(false)
    

    useEffect(() => {
        const fetchRecommendedPrds = async () => {
            setLoadingRecommended(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/get_recommendations/${user?._id}`)
                setRecommendItems(response?.data?.recommendations)
            } catch(err) {
                console.error(err)
            } finally {
                setLoadingRecommended(false)
            }
        }
        fetchRecommendedPrds()
    }, [user?._id])

    return (
        <>
            {recommended_items.length > 0 && (
                <div style={{
                    paddingTop: 10, 
                    paddingLeft: window.innerWidth > 700 && '9%', 
                    display: 'flex', 
                    flexDirection: window.innerWidth <= 700 && 'column', 
                    alignItems: 'center', 
                    gap: 10, 
                    width: '100%',
                }}>
                    <h2 style={{
                        background: 'linear-gradient( to right, #C33764, #1D2671)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'brightness(1.5)',
                        fontSize: window.innerWidth <= 700 ? '2rem' : '2.25rem'  
                    }}>Recommended For you</h2>
                    <p
                        style={{
                            padding: 5, 
                            paddingLeft: 10, 
                            paddingRight: 10, 
                            borderRadius: 25, 
                            color: 'white',
                            backgroundColor: '#3c3c3cc2',
                            backdropFilter: 'blur(10px)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}
                    >AI Generated</p>
                </div>
            )}
            {loadingRecommended ? (
                <div style={{padding: 30}}>
                    <MutatingDots
                        height={100}
                        width={100}
                        color="#C33764"
                        secondaryColor="#1D2671"
                        radius={12.5}
                        ariaLabel="mutating-dots-loading"
                        visible={true}
                    />
                </div>
            ):(
                recommended_items.length > 0 && (
                    <>
                        <div 
                            onClick={() => setSeeWhy(prev => !prev)} 
                            style={{
                                width: '100%', 
                                paddingLeft: '12.5%', 
                                cursor: 'pointer',
                                paddingTop: 20
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center', gap: 3}}>
                                <Info htmlColor="grey" fontSize="small"/>
                                <p style={{color: 'grey', fontSize: 'small'}}>Why am I seeing this?</p>
                            </div>
                        </div>
                        {seeWhy && (
                            <i style={{color: 'grey', fontSize: 'small',  padding: 20, paddingLeft: window.innerWidth > 700 ? '12.5%' : '15%',}}>We’ve hand‑picked these products based on your ratings and shopping activity. 
                                The more products you rate, the better we can understand your style and suggest items you’ll love. 
                                Keep exploring and rating to unlock even more personalized recommendations!
                            </i>
                        )}
                        <div className='gridContainer'>
                            {recommended_items.map((product, index) => (   
                                <ProductContainer key={index} item={product}/>
                            ))}
                        </div>
                    </>
                )
            )}
        </>
    )
}