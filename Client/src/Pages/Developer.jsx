import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowBackIosNewRounded,
    Call, 
    Message,
    WhatsApp,
    X,
    Telegram,
    GitHub, 
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { themesContext } from "../Contexts/userDataContext";
import '../Styles/Dev.css'
import DevImage from '../Resources/Dev.png'
import { motion } from 'framer-motion'

export default function Dev() {
    const {theme, themeStyles} = useContext(themesContext)
    const navigate = useNavigate()
    return (
        <div 
            className="devWrapper" 
            style={{...theme === 'dark' && {backgroundColor: 'rgb(22, 22, 22)', color: 'white'}}}
        >
            <div className="dev-backTitle" style={{color: themeStyles.style.color}}>
                <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded 
                        style={{color: themeStyles.style.color, cursor: 'pointer'}} 
                        htmlColor="#1D2671" fontSize="large"
                    />
                </Button>
                <h2>Meet the developer</h2>
            </div>
            <motion.div 
                initial={{y: '10%', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{ease: 'anticipate'}}
                style={{...theme === 'dark' && {backgroundColor: themeStyles.style.divColor}}}
                className="devMain"
            >
                <motion.div 
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{delay: 0.5, ease: 'anticipate'}}
                    className="image"
                >
                    <img src={DevImage} alt="dev image" />
                </motion.div>
                <div className="dev-details">
                    <div className="callOrMessageDev">
                        <a href="mailto: abdulaiumar20@gmail.com">
                            <span style={{...theme === 'dark' && {color: 'white'}}}>
                                <Message htmlColor="skyblue"/>
                                <p>Message</p>
                            </span>
                        </a>
                        <a href="tel: 0536342775">
                            <span style={{...theme === 'dark' && {color: 'white'}}}>
                                <Call htmlColor="yellowgreen"/>
                                <p>Call</p>
                            </span> 
                        </a>
                    </div>
                    <div className="dev-creds">
                        <motion.span
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.4, ease: 'anticipate'}}
                            className="name"
                        >
                            ABDULAI UMAR TIJANI
                        </motion.span>
                        <motion.p 
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.6, ease: 'anticipate'}}
                            className="status"
                        >
                            Status: WEB Developer
                        </motion.p>
                        <motion.p 
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.8, ease: 'anticipate'}}
                            className="contact"
                        >
                            Contact: 0536342775
                        </motion.p>
                        <motion.p 
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 1, ease: 'anticipate'}}
                            className="frontend"
                        >
                            Front-end Technologies: HTML, CSS, React JS
                        </motion.p>
                        <motion.p 
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 1.2, ease: 'anticipate'}}
                            className="backend"
                        >
                            Backend Technologies: Node JS, Express JS, MongoDB
                        </motion.p>
                        <motion.p 
                            initial={{y: '20%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 1.4, ease: 'anticipate'}}
                            className="socialMed"
                        >
                            <a href="#"target="_blank">
                                <span><WhatsApp fontSize="large" htmlColor="green"/></span>
                            </a>
                            <span><X fontSize="large"/></span>
                            <span><Telegram fontSize="large" htmlColor="skyblue"/></span>
                            <span><GitHub fontSize="large"/></span>
                        </motion.p>
                    </div>
                    <motion.small
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 1.6, ease: 'anticipate'}}
                    >
                        @CantonsTech, 2024
                    </motion.small>
                </div>
            </motion.div>
        </div>
    )
}