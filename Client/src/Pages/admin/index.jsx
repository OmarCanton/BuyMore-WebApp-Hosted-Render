import { useContext } from "react";
import Panel from "../../Components/Panel";
import { themesContext } from "../../Contexts/userDataContext";
import { motion } from 'framer-motion'
import { Button } from "@mui/material";
import { ArrowBackIosNewRounded, Dashboard } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHome () {
    const navigate = useNavigate()
    const {themeStyles} = useContext(themesContext)
    // const user = useSelector(userState)

    return(
        <div className="wrapper-cart" 
            style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <motion.div 
                initial={{y: '-10vh', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: '-10vh', opacity: 0}}
                transition={{duration: 0.2}}
                className='header'
            >
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded
                        className="back-cart" 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}}
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <span 
                    className="wishlist-header"
                    style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
                >
                    <Dashboard fontSize="large"/>
                    <p>Dashboard</p>
                </span>
            </motion.div>
            <div style={{width: '100%', display: 'flex', padding: 15, justifyContent: window.innerWidth <= 500 && 'center', flexDirection: window.innerWidth <= 500 && 'column', gap: 20, marginTop: 20}}>
                <Link to={'/admin/addProduct'} style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #C33764, #1D2671)', borderRadius: 15 }}>
                    <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: 'white',  padding: 70, alignItems: 'center', justifyContent: 'flex-start',}}>Add a Product</p>
                </Link>
                {/* <Link to={'/admin/editProduct'} style={{ textDecoration: 'none', background: 'linear-gradient(to right, #1D2671, #C33764)', borderRadius: 15 }}>
                    <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: 'white',  padding: 70, alignItems: 'center', justifyContent: 'flex-start',}}>Edit Products</p>
                </Link> */}
            </div>
            <Panel />
        </div>
    )
}