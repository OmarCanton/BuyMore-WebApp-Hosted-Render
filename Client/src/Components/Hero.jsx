import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Hero.css'
import Background1 from '../Resources/Background1.mp4'
import Background2 from '../Resources/Background2.mp4'
import Background3 from '../Resources/Background3.mp4'
import { ChevronLeft, ChevronRight } from '@mui/icons-material' 

export default function Hero () {
    const navigate = useNavigate()

    //*** Video carousel ***
    const videos = [
        Background1,
        Background2,
        Background3
    ]
    const carouselIntervalTime = 8000
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const videoRefs = useRef([])

    //Initial check for mobile versions(650px downwards) 
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 650)
        }

        handleResize() // Called to precheck if the current device if a mobile or desktop
        window.addEventListener('resize', handleResize)
    
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (isMobile) return; // Disable auto-sliding on mobile (650px downwards)
    
        const autoSlideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, carouselIntervalTime);
    
        return () => clearInterval(autoSlideInterval);
      }, [isMobile, carouselIntervalTime, videos.length]);
    useEffect(() => {
        if (isMobile) return;
    
        videoRefs.current.forEach((video, index) => {
            if (index === currentIndex) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [currentIndex, isMobile])

    const nextVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length )
    }
    const prevVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
    }
    //End



    //::::App name Effect::::
    const name = 'Buy'
    const name2 = 'More'
    const speed = 100
    const [appNameText1, setAppNameText1] = useState('')
    const [appNameText2, setAppNameText2] = useState('')
    const [opacity, setOpacity] = useState(0)
    const [translateBut, setTranslateBut] = useState({
        position: 'relative', 
        top: '30px',
        opacity: 0,
        transition: 'all 0.2s ease',
    })

    useEffect(() => {
        const typeText = async () => {
            for (let i = 0; i < name.length; i++) {
              setAppNameText1((prev) => prev + name[i]);
              await new Promise((resolve) => setTimeout(resolve, speed));
            }
        };
        setTimeout(() => {
            typeText();
        }, 800);

        const typeText2 = async () => {
            for (let i = 0; i < name2.length; i++) {
              setAppNameText2((prev) => prev + name2[i]);
              await new Promise((resolve) => setTimeout(resolve, speed));
            }
        };
        
        setTimeout(() => {
            typeText2();
        }, 850);

    }, [ name, speed ])

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setOpacity(1)
            setTranslateBut((prevState) => ({...prevState, top: 0, opacity: 1}))
        }, 1500)
        return() => clearTimeout(timeOut)
    }, [])
    //End
    
    const viewAllProducts = () => {
        navigate('/shop')
    }



    return (
        <div className="heroWrapper">
            <ChevronLeft 
                htmlColor='white' 
                style={{cursor: 'pointer'}} 
                className='previous' 
                onClick={prevVideo}
            />
            <div className='carousel-main-wrapper'>
                <div className='carousel-video-wrapper' style={{
                    transform: `translateX(-${ currentIndex * 100 }%`,
                    transition: 'transform 0.5s ease-in'
                }}>
                    {window.innerWidth > 650 && videos.map((videoSrc, index) => (
                        <video 
                            className='video'
                            muted
                            key={index} 
                            ref={(el) => (videoRefs.current[index] = el)} 
                            src={videoSrc}
                            preload='false'
                            style={{
                                flex: '0 0 100%', 
                                transform: currentIndex === index ? 'scale(1)' : 'scale(0.7)', 
                                borderRadius: currentIndex !== index && '20px',
                                objectFit: 'cover'
                            }}
                        />
                    ))}
                </div>
            </div>
            <ChevronRight htmlColor='white' style={{cursor: 'pointer'}} className='next' onClick={nextVideo} />
            <div className="gradientFilter"></div>
            <div className='welcomeMessage'>
                <div className="welcMsgCont">
                    <h1>{appNameText1}&middot;{appNameText2}</h1>
                    <h2 style={{opacity: opacity, transition: 'opacity 0.5s ease'}}>Welcome To Your No.1 Ecommerce Platform</h2>
                    <button className='shopNowBtn' style={translateBut} onClick={viewAllProducts}>Shop Now</button>
                </div>
            </div>
        </div>
    )
}