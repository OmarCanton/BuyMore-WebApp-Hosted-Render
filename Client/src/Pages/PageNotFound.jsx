import PageNotFoundAnime from '../Effects/PageNotFoundAnime.json'
import Lottie from 'lottie-react'

export default function PageNotFound () {
    return(
        <div>
            <div className="notFound-wrapper">
                <Lottie loop={true} animationData={PageNotFoundAnime} />
            </div>
        </div>
    )
}