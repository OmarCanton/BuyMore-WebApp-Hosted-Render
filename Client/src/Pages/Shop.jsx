import { useEffect, useContext, useState, useRef } from "react";
import { themesContext } from "../Contexts/userDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowBackIosRounded, 
    Search, 
    Tune, 
    Cancel, 
} from '@mui/icons-material'
import '../Styles/Shop.css'
import { Button } from "@mui/material";
import Panel from '../Components/Panel'
import LoadingEffect from "../Effects/LoadingEffect";
import { useDispatch, useSelector } from 'react-redux'
import { 
    fetchProducts, 
    totalNumberOfProductsPages, 
    fetchSearchedProducts, 
    fetchFilteredProduct, 
    searchedName, 
    isSearch, 
    isFiltered,
    selectProductsStatus,
    selectProducts 
} from '../Redux/Slices/productsSlice'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import SearchNotFound from '../Effects/SearchNotFound.json' 
import ShopEmpty from '../Effects/SearchNotFound.json' 
import ProductContainer from '../Components/ProductContainer'
import '../Styles/overallPrdsCont.css'

export default function Shop () {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const products = useSelector(selectProducts)
    const totalProductsPages = useSelector(totalNumberOfProductsPages)
    const status = useSelector(selectProductsStatus)
    const is_Search = useSelector(isSearch)
    const is_Filtered = useSelector(isFiltered)
    const searched_Name = useSelector(searchedName)
    const [name, setName] = useState('')
    const filterRef = useRef()
    const headerRef = useRef()
    const {theme, themeStyles} = useContext(themesContext)
    const [pageNumber, setPageNumber] = useState(0)
    const [isHovered1, setIsHovered1] = useState(false)
    const [isHovered2, setIsHovered2] = useState(false)
    const [viewSearchInput, setViewSearchInput] = useState(false)
    const [viewCloseSearch, setViewCloseSearch] = useState(false)
    const location = useLocation()
    const {category} = location.state || {}

    useEffect(() => {
        if(category) {
            dispatch(fetchFilteredProduct(category))
        } else {
            dispatch(fetchProducts(pageNumber))
        }
    }, [dispatch, pageNumber, category])

    const searchForProduct = (e, name) => {
        e.preventDefault()
        dispatch(fetchSearchedProducts(name))
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [pageNumber])

    useEffect(() => {
        const handleScroll = () => {
            headerRef.current.style.boxShadow = '0 5px 5px -5px black'
            if(window.scrollY === 0) {
                headerRef.current.style.boxShadow = '0 0 0 0'
            }
        }
        window.addEventListener('scroll', handleScroll)
        
        return () => window.removeEventListener('scroll', handleScroll)
        
    }, [])

    return (
        <div className="shop-wrapper" 
            style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <motion.div
                initial={{y: '-10vh', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: '-10vh', opacity: 0}}
                transition={{duration: 0.2}}
                ref={headerRef} 
                className="shop-header" 
                style={{...theme === 'dark' && { backgroundColor: themeStyles.style.divColor}}}
            >
                <div className="headerComp-first">
                    <div className="backTitle">
                        <Button style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                            <ArrowBackIosRounded 
                                className="back"
                                style={{...theme === 'dark' && {color: themeStyles.style.color} , cursor: 'pointer'}} 
                                htmlColor="#1D2671" fontSize="large"
                            />
                        </Button>
                        <h2 
                            style={{...theme === 'dark' && {color: themeStyles.style.color}}}
                        >Shop</h2>
                    </div>
                    <div className='searchProduct'>
                        <form className="searchForm1" onSubmit={(e) => searchForProduct(e, name)}>
                            <input 
                                className="input1"
                                type="search" 
                                name="search" 
                                id="search" 
                                placeholder='Search Products'
                                onChange={(e) => {
                                    if(e.target.value === '') {
                                        if(filterRef.current.value === 'All') {
                                            dispatch(fetchProducts())
                                        } else {
                                            dispatch(fetchFilteredProduct(filterRef.current.value))
                                        }
                                    } else {
                                        setName(e.target.value)
                                    }
                                }}
                            />
                            <Search className='searchIcon' htmlColor='white' onClick={(e) => searchForProduct(e, name)}/>  
                        </form>
                        <Search 
                            className="searchIcon2"
                            htmlColor='white'
                            style={{...theme  ===  'light'  && {color:  '#3c3c3c'}}}
                            onClick={() => {
                                setViewCloseSearch(true)
                                setViewSearchInput(true)
                            }}
                        />
                    </div>
                    <div className='filter'>
                        <Tune className="filterIcon" fontSize='large' /> 
                        <select 
                            ref={filterRef}
                            defaultValue={'All'} 
                            name="filter" 
                            id="filter"
                            style={{border: "none", filter: 'brightness(1.1)'}}
                            onChange={(e) => { 
                                if(e.target.value === 'All') {
                                    dispatch(fetchProducts())
                                } else {
                                    dispatch(fetchFilteredProduct(e.target.value))
                                }
                            }}>
                            <option value="All">All</option>
                            <option value="Home">Home</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Outerwear">Outerwear</option>
                            <option value="Gadgets">Gadgets</option>
                            <option value="Smartphones">Smartphones</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Shoes">Shoes</option>
                        </select>
                    </div>  
                </div>
                {viewSearchInput && 
                    <>
                        <form
                            className="searchForm2" 
                            onSubmit={(e) => searchForProduct(e, name)}
                            style={{...viewSearchInput && {display: 'flex'}, ...theme === 'light' && {backgroundColor: 'rgb(224, 224, 224)'}}}
                        >
                            <input 
                                className="input2"
                                type="search" 
                                name="search2" 
                                id="search2" 
                                placeholder='Search Products'
                                onChange={(e) => {
                                    if(e.target.value === '') {
                                        if(filterRef.current.value === 'All') {
                                            dispatch(fetchProducts())
                                        } else {
                                            dispatch(fetchFilteredProduct(filterRef.current.value))
                                        }
                                    } else {
                                        setName(e.target.value)
                                    }
                                }}
                            />
                            <Cancel 
                                className="closeSearch" 
                                htmlColor="#C33764"
                                style={{...viewCloseSearch && {display: 'flex'}}}
                                onClick={() => {
                                    setViewCloseSearch(false)
                                    setViewSearchInput(false)
                                }}
                            />
                        </form>
                    </>
                }
            </motion.div>
            
            {(is_Search && name) && 
                <h2 className="searchMsg"
                    style={{...viewSearchInput && {paddingTop: 50}}}
                >
                    Search Results for &apos;{searched_Name}&apos;
                </h2>
            }
            { status === 'loading' &&
                <div className="loadingEffectWrapper">
                    <LoadingEffect />
                </div>
            }
            { status === 'succeeded' && (
                <div 
                    style={{
                        ...is_Search && {paddingBottom: 100}, 
                        ...is_Filtered && {paddingBottom: 100},
                        ...viewSearchInput && {paddingTop: 50},
                        marginTop: '10%'
                    }}
                    className="gridContainer"
                >
                    { products.length > 0 &&
                        products.map(product => (
                            <ProductContainer key={product?._id} item={product} />
                        ))
                    }
                </div>
            )}
            {
                (!is_Search && !is_Filtered && status === 'succeeded' && products.length > 0) &&
                <div className="prevAndNextPage">
                    <button
                        onMouseEnter={() => setIsHovered1(true)}
                        onMouseLeave={() => setIsHovered1(false)}
                        style={{
                            ...theme === 'dark' && {
                                color: 'white', 
                                backgroundColor: themeStyles.style.divColor,
                                ...pageNumber + 1 === 1 && {color: 'grey'},
                                ...isHovered1 && {backgroundColor: 'darkgrey'}
                            },
                        }}
                        disabled={pageNumber + 1 === 1} 
                        onClick={() => {
                            setPageNumber(prevNumber => prevNumber -= 1)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                    >&lt;&lt;</button>
                    <button
                        onMouseEnter={() => setIsHovered2(true)}
                        onMouseLeave={() => setIsHovered2(false)}
                        style={{
                            ...theme === 'dark' && {
                                color: 'white', 
                                backgroundColor: themeStyles.style.divColor,
                                ...pageNumber + 1 === totalProductsPages && {color: 'grey'},
                                ...isHovered2 && {backgroundColor: 'darkgrey'}
                            },
                        }} 
                        disabled={pageNumber + 1 === totalProductsPages} 
                        onClick={() => {
                            setPageNumber(prevNumber => prevNumber += 1)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                    >&gt;&gt;</button>
                    <p>Page {pageNumber + 1}</p>
                </div>
            }
            { (status === 'succeeded' && products.length <= 0) &&
                <div className="searchNotFound">
                    <Lottie className="searchAnime" loop={true} animationData={SearchNotFound} />
                    <p>Sorry, No such product!</p>
                </div>
            }
            { status === 'failed' && 
                <p 
                    className="No-shopItem"
                    style={{color: themeStyles.style.color, backgroundColor:themeStyles.style.backgroundColor}}
                >
                    <Lottie className="anime-noItem" loop={true} animationData={ShopEmpty} />
                </p> 
            }
            <Panel />
        </div>
    )
}