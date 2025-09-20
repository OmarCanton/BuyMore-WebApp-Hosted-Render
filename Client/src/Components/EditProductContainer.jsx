import PropTypes from 'prop-types'
import '../Styles/ProductContainer.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tokenState } from '../Redux/Slices/authSlice';
import { useContext } from 'react';
import { themesContext } from '../Contexts/userDataContext';
import { addToFavorites, favoriteItems, removeFromFavorites } from '../Redux/Slices/FavoritesSlice';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';
// import { addToCart } from '../Redux/Slices/WishlistSlice';

export default function EditProductContainer({ item }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { theme } = useContext(themesContext)
  const favorites = useSelector(favoriteItems)
  const token = useSelector(tokenState)

  const isFav = (item) => { 
    const isfav = favorites.some(favorite => favorite._id === item._id)
    if(isfav) {
      return(
        <FavoriteRounded htmlColor="red" className='fav' style={{cursor: 'pointer'}} /> 
      )
    }else {
      return (
        <FavoriteBorderRounded className='fav' htmlColor='red' style={{cursor: 'pointer'}} />
      )
    }
  }
  const addItemToFavorites = (item, e) => {
    e.stopPropagation()
    if(token) {
      const isFavorite = favorites.some(favorite => favorite._id === item._id)
      if(isFavorite) {
        dispatch(removeFromFavorites(item))
      } else {
        dispatch(addToFavorites(item))
      }
    } else {
      toast.error(`Please log into your account to add items to your Favorites`, {
        style: {
          backgroundColor: 'black',
          color: 'white',
        }
      })
    }
  }

  const checkProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } })
  }
  const editPro = (product,  e) => {
    e.stopPropagation()
    navigate(`/admin/editPage/${product._id}`)
  }
  
  // const addItemTocart = (item, e) => {
  //   if(token) {
  //     dispatch(addToCart(item))
  //     toast.success(`${item.name} added to wishlist`, {
  //       style: {
  //         backgroundColor: 'black',
  //         color: 'white',
  //       }
  //     })
  //   } else {
  //     toast.error(`Please log into your account to add items to your wishlist`, {
  //       style: {
  //         backgroundColor: 'black',
  //         color: 'white',
  //       }
  //     })
  //   }
  // }

  return (
    <div 
      className='productContainer'
      onClick={() => checkProduct(item)}
      style={{
        backgroundColor: theme === 'dark' && '#3C3C3C', 
        willChange: 'transform, opacity', 
        cursor: 'pointer', 
        border: theme === 'dark' && '1px solid #3c3c3c'
      }}
    >
      <div className='imageContainer' style={{position: 'relative'}}>
        <img 
          src={item?.image} 
          alt={item?.name} 
          className='productImage'
        />
        <span style={{position: 'absolute', top: 10, right: 10}} onClick={(e) => addItemToFavorites(item, e)}>
          { isFav(item) }
        </span>
      </div>
      <div className='detailsContainer'>
        <h3 className='productName' style={{color: theme === 'dark' && 'white'}}>{item?.name}</h3>
        <div className='productPrice' 
          style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
        >
          <p>GHS {item?.actualPrice?.toFixed(2)}</p>
          <p style={{color: 'grey'}}><s>GHS {item?.prevPrice.toFixed(2)}</s></p>
        </div>
        <p className='productDescription'>{item?.description}</p>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold'}}
        >
          <p style={{color: "darkgrey"}}>{item?.category}</p>
          <p style={{color: "darkgrey"}}>{item?.brand}</p>
        </div>
        <button 
          onClick={(e) => editPro(item, e)} 
          style={{cursor: 'pointer', border: 'none', backgroundColor: '#C33764', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10}}>
          <p style={{color: 'white', fontWeight: 'bold'}}>Edit</p>
        </button>
      </div>
    </div>
  );
};

EditProductContainer.propTypes = {
  item: PropTypes.any
}