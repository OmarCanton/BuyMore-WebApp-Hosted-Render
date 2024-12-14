import PageNotFoundAnime from '../Effects/PageNotFoundAnime.json'
import Lottie from 'lottie-react'
import '../Styles/PageNotFound.css'

export default function PageNotFound () {
    return(
        <div className="notFound-wrapper">
            <div>
                <Lottie loop={true} animationData={PageNotFoundAnime} />
            </div>
        </div>
    )
}