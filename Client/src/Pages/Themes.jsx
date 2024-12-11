import { useState, useContext } from 'react'
import '../Styles/Themes.css'
import { Button } from "@mui/material"
import { ArrowBackIosNewRounded } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { themesContext } from "../Contexts/userDataContext"
import { LightMode, DarkMode } from '@mui/icons-material'
import { Check } from '@mui/icons-material'

export default function Themes () {
    const navigate = useNavigate()
    const {theme, changeTheme, themeStyles} = useContext(themesContext)
    const [isHovered1, setIsHovered1] = useState(false)
    const [isHovered2, setIsHovered2] = useState(false)

    return (
        <div className="themesWrapper" 
            style={{backgroundColor: themeStyles.style.backgroundColor}}
        >
            <div className="themes-header">
                <Button color='#1D2671' 
                    style={{color: themeStyles.style.color}}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIosNewRounded fontSize='large'/>
                </Button>
                <h2 
                    style={{color: themeStyles.style.color}}
                >Themes</h2>
            </div>
            <div className="themesMain" 
            style={{backgroundColor: themeStyles.style.divColor}}
            >
                <div 
                    onMouseEnter={() => setIsHovered1(true)} 
                    onMouseLeave={() => setIsHovered1(false)}
                    className="light" 
                    style={{...isHovered1 &&
                        {...theme === 'dark' ? 
                            {backgroundColor: 'rgb(92, 91, 91)'} : {backgroundColor: 'rgb(199, 199, 199)'}
                        }
                    } }
                    onClick={() => changeTheme('light')}
                >
                    <p style={{...theme == 'dark' && {color: 'white'}}}>Light</p>
                    {theme == 'light' ? 
                        <Check htmlColor='#525fd1' fontSize='large' />
                        : 
                        <LightMode htmlColor='grey'/>
                    }
                </div>
                <div 
                    onMouseEnter={() => setIsHovered2(true)} 
                    onMouseLeave={() => setIsHovered2(false)}
                    style={{...isHovered2 && 
                        {...theme === 'dark' ? 
                            {backgroundColor: 'rgb(92, 91, 91)'} : {backgroundColor: 'rgb(199, 199, 199)'}
                        }
                    }}
                    className="dark" 
                    onClick={() => changeTheme('dark')}
                >
                    <p style={{color: themeStyles.style.color}}>Dark</p>
                    {theme == 'dark' ? 
                        <Check htmlColor='#525fd1' fontSize='large' />
                        : 
                        <DarkMode style={{color: themeStyles.style.color}}/>
                    }
                </div>
            </div>
        </div>
    )
}