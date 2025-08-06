// import { Skeleton } from '@mui/material'
// import PropTypes from 'prop-types'
// import { useContext } from 'react'
// import { themesContext } from '../Contexts/userDataContext'

// export default function SkeletonLoader({ routeName }) {
//     const theme = useContext(themesContext)

//     return (
//         routeName === 'home' && ( 
//         <>
//             <div className="newArrivals" 
//                 style={{borderBottom: theme === 'dark' ? '1px solid rgb(73, 73, 73)' : '1px solid lightgrey'}}
//             >
//                 <div className="newArrivalsImages">
//                     <div>
//                         <Skeleton variant='rounded' animation='wave' height={200} width={200} />
//                         <Skeleton variant='rounded' animation='wave' height={200} width={200} />
//                     </div>
//                     <Skeleton variant='rounded' animation='wave' height={400} width={270} />
//                 </div>
//                 <div className="newArrivalsInfo">
//                     <span className='newArrivalsHead'>
//                         <Skeleton variant='text' animation='wave' height={70} width={'30rem'} />
//                     </span>
//                     <span>
//                         <Skeleton variant='text' animation='wave' height={60} width={'45rem'} />
//                         <Skeleton variant='text' animation='wave' height={60} width={'45rem'} />
//                         <Skeleton variant='text' animation='wave' height={60} width={'45rem'} />
//                     </span>
//                 </div>
//             </div>
//         </>
//         )
//     )
// }

// SkeletonLoader.propTypes = {
//     routeName: PropTypes.string,
//     isCategory: PropTypes.bool
// }