import { useContext, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { ArrowBackIosNewRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { themesContext } from '../Contexts/userDataContext'
import '../Styles/Orders.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { userState } from '../Redux/Slices/authSlice'
import { Puff } from 'react-loader-spinner'

export default function OrderPayment () {
    const navigate = useNavigate()
    const { theme, themeStyles } = useContext(themesContext)
    const [orders, setOrders] = useState([])
    const [totals, setTotals] = useState()
    const [loading, setloading] = useState(false)
    const user = useSelector(userState)
    const id = user?._id
    
    useEffect(() => {
        const getAllOrders = async () => {
            setloading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/getOrders/${id}`)
                const grouped = response?.data.reduce((acc, item) => {
                    const key = item.createdAt.split('T')[0];

                    if (!acc[key]) {
                        acc[key] = [];
                    }

                    acc[key].push(item);
                    
                    return acc;
                }, {});
                setTotals(response?.data.length)
                setOrders(grouped)
            } catch(err) {
                console.error(err)
            } finally {
                setloading(false)
            }
        }
        getAllOrders()
    }, [id])

    if(loading) {
        return (
            <div style={{backgroundColor: theme === 'dark' && 'rgb(22, 22, 22)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%'}}>
                <Puff
                    height={40}
                    width={40}
                    radius={1}
                    color="#007aff"
                    ariaLabel="puff-loading"
                    visible={true}
                />
            </div>
        )
    }
    
    return (
        <div 
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
            className="orderPayment-wrapper"
        >
            <div className="orderPay-backTitle" style={{color: themeStyles.style.color}}>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span>Order And Payment History</span>
            </div>
            { Object.entries(orders).length > 0 && (
                <div style={{color: theme === 'dark' && 'white', padding: 20, marginTop: 55}}>
                    <h3 style={{color: '#C33764'}}>Total number of orders: {totals}</h3>
                </div>
            )}
            <div className="orders-container">
                { Object.entries(orders).length > 0 ? Object.entries(orders).map(([key, arr]) => (
                    <>
                        <h3 style={{color: theme === 'dark' && 'white'}}>&bull;{new Date(key).toDateString()}</h3>
                        <div className="table-container" key={key}>
                            <table className="orders-table" style={{color: theme === 'dark' && 'white'}}>
                            <thead>
                                <tr>
                                <th>Image</th>
                                <th>Item</th>
                                <th>Total</th>
                                <th>Amount ($)</th>
                                <th>Status</th>
                                <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arr.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <img 
                                            src={order?.image}
                                            alt={order?.name}
                                            height={50}
                                            width={50}
                                        />
                                    </td>
                                    <td>{order.name}</td>
                                    <td>{order.quantity}</td>
                                    <td>GHS {Number(order.totalItemPrice).toFixed(2)}</td>
                                    <td>
                                        <span style={{color: order.status === 'paid' ? '#23a040ff' : order.status === 'failed' ? 'red' : '#856404'}}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toTimeString().split(' ')[0]}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </>
                    )):(
                        <div 
                            style={{...theme === 'dark' && {color: 'white'}}}
                            className="orderPayment-main"
                        >
                            <span style={{color: 'grey'}}>No history available</span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}