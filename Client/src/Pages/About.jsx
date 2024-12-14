import { Button } from '@mui/material'
import '../Styles/About.css'
import { ArrowBackIosNewRounded, Facebook, WhatsApp, X, Telegram, GitHub, Instagram } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { themesContext } from '../Contexts/userDataContext'
import { motion } from 'framer-motion'

export default function About () {
    const navigate = useNavigate()
    const { theme, themeStyles } = useContext(themesContext)

    return (
        <div 
            className='about-wrapper' 
            style={{backgroundColor: themeStyles.style.backgroundColor}}
        >
            <div className="header" 
                style={{color: themeStyles.style.color}}
            >
                <Button color='#1D2671' style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRounded fontSize='large'/>
                </Button>
                <h2>About</h2>
            </div>
            <motion.div 
                initial={{y: '10%', opacity: 0}}
                animate={{y: '0', opacity: 1}}
                exit={{
                    y: '20%',
                    transition: {
                        delay: 0.6
                    }
                }}
                transition={{duration: 0.15, ease: 'anticipate'}}
                className="main"  
                style={{...theme === 'dark' && {
                    backgroundColor: themeStyles.style.divColor, 
                    color: themeStyles.style.color
                }}}
            >
                <span 
                    className='appname'
                    style={{...theme === 'dark' ? {
                        background: 'linear-gradient( to right, #cf1d55, #3542b6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',           
                        filter: 'brightness(1.5)'                
                        } : {color: '#1D2671'}
                    }}
                >BuyMore&reg;</span>
                <motion.p 
                    initial={{y: '20%', opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{
                        y: '20%', 
                        opacity: 0,
                        transition: {
                            delay: 0.6
                        }
                    }}
                    transition={{duration: 0.1, delay: 0.14, ease: 'anticipate'}}
                >
                    BuyMore is your one-stop destination for all your shopping needs! 
                    We offer a vast array of products, carefully curated to cater to diverse tastes
                    and preferences. From trendy fashion wear to essential home goods, and from
                    cutting-edge Electronics to premium beauty products, our website has it all.
                </motion.p>
                <div className="socialMedia">
                    <motion.span 
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%', 
                            opacity: 0,
                            transition: {
                                delay: 0.6
                            }
                        }}
                        transition={{delay: 0.2, ease: 'anticipate'}}
                    >
                        <Link to=''>
                            <WhatsApp fontSize='large' htmlColor='green'/>
                        </Link>
                    </motion.span>
                    <motion.span 
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%', 
                            opacity: 0,
                            transition: {
                                delay: 0.5
                            }
                        }}
                        transition={{delay: 0.4, ease: 'anticipate'}}   
                    >
                        <Link to=''>
                            <Facebook fontSize='large' htmlColor='darkgrey'/>
                        </Link>
                    </motion.span>
                    <motion.span
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%', 
                            opacity: 0,
                            transition: {
                                delay: 0.4
                            }
                        }}
                        transition={{delay: 0.6, ease: 'anticipate'}}
                    >
                        <Link to=''>
                            <X 
                                fontSize='large' 
                                htmlColor='white' 
                                style={{...theme === 'light' && {color: 'black'}}}
                            />
                        </Link>
                    </motion.span>
                    <motion.span
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%', 
                            opacity: 0,
                            transition: {
                                delay: 0.3
                            }
                        }}
                        transition={{delay: 0.8, ease: 'anticipate'}}
                    >
                        <Link to=''>
                            <Telegram fontSize='large' htmlColor='skyblue'/>
                        </Link>
                    </motion.span>
                    <motion.span
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%', 
                            opacity: 0,
                            transition: {
                                delay: 0.2
                            }
                        }}
                        transition={{delay: 1, ease: 'anticipate'}}
                    >
                        <Link to=''>
                            <Instagram fontSize='large' htmlColor='orangered'/>
                        </Link>
                    </motion.span>
                    <motion.span
                        initial={{y: '20%', opacity: 0}}
                        animate={{y: '0', opacity: 1}}
                        exit={{
                            y: '20%',
                            opacity: 0,
                            transition: {
                                delay: 0.1
                            }
                        }}
                        transition={{delay: 1.2, ease: 'anticipate'}}
                    >
                        <Link to=''>
                            <GitHub 
                                fontSize='large' 
                                htmlColor='white'
                                style={{...theme === 'light' && {color: 'black'}}}
                            />
                        </Link>
                    </motion.span>
                </div>
                <span 
                    style={{...theme === 'dark' && {color: 'lightgrey'}}}
                >&copy; CantonsTech 2024, All rights reserved.</span>
            </motion.div>
        </div>
    )
}