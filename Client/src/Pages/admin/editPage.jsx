import { useState } from "react";
import "./addProduct.css";
import { Button, CircularProgress } from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { themesContext } from "../../Contexts/userDataContext";
import axios from 'axios'
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function EditPage() {
    const navigate = useNavigate()
    const { themeStyles, theme } = useContext(themesContext)
    const [formData, setFormData] = useState({        
        image: null,
        name: '',
        category: '',
        actualPrice: '',
        prevPrice: '',
        description: '',
        brand: ''
    })
    const [addingProduct, setAddingProduct] = useState(false)
    const [product, setProduct] = useState([])
    const params = useParams();
	const { pid } = params;

    // console.log(id)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/products/${pid}`)
                setProduct([...response.data.products])
                console.log(response.data)
            } catch(err) {
                console.error(err)
            }
        }
        fetchProduct()
    }, [pid])
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        if(!formData.image ||
            !formData.name ||
            !formData.category ||
            !formData.actualPrice ||
            !formData.prevPrice ||
            !formData.description ||
            !formData.brand
        ) {
            toast.error('All fields are required', {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
            return
        }
        setAddingProduct(true)
        const formdata = new FormData()
        formdata.append('productImage', formData.image)
        formdata.append('name', formData.name)
        formdata.append('category', formData.category)
        formdata.append('actualPrice', formData.actualPrice)
        formdata.append('prevPrice', formData.prevPrice)
        formdata.append('description', formData.description)
        formdata.append('brand', formData.brand)

        try {
            const response = await axios.post(`${import.meta.env.VITE_EXTERNAL_HOSTED_BACKEND_URL}/add_Product`, formdata, {
                headers: { 'Content-Type': 'multipart/form-data' }, 
                withCredentials: true 
            })
            toast.success(response.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        } catch(err) {
            console.error(err?.response.data?.message || err?.message)
            toast.error(err?.response.data?.message || err?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        } finally {
            setAddingProduct(false)
        }

    };

    return (
        <div
            className="wrapper-cart" 
            style={{ color: themeStyles.style.color, backgroundColor: themeStyles.style.backgroundColor}}
        >
            <Button style={{ position: 'absolute', cursor: 'pointer', left: 10, top: 5}} onClick={() => navigate(-1)}>
                <ArrowBackIosNewRounded
                    className="back-cart" 
                    style={{color: themeStyles.style.color, cursor: 'pointer'}}
                    htmlColor="#1D2671" fontSize="large"
                />
            </Button>
            <div 
                className="form-card"
                style={{color: themeStyles.style.color, backgroundColor: themeStyles.style.divColor}}
            >
                <h2 style={{color: theme === 'dark' && 'white'}}>Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Product Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} />
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Product Name</label>
                        <input type="text" name="name" placeholder="iPhone 17 Air" value={product.name} onChange={handleChange} />
                    </div>

                    {/* Brand */}
                    <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Brand</label>
                        <input type="text" name="brand" placeholder="Apple" value={product.brand} onChange={handleChange} />
                    </div>

                    {/* Brand */}
                    {/* <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Brand</label>
                        <select name="brand" value={formData.brand} onChange={handleChange}>
                            <option value="">Select a brand</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Apple">Apple</option>
                        </select>
                    </div> */}

                    {/* Category */}
                    <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Category</label>
                        <select name="category" value={product.category} onChange={handleChange}>
                            <option value="">Select a category</option>
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

                    {/* Prices */}
                    <div className="form-row">
                        <div className="form-group">
                            <label style={{color: theme === 'dark' && 'white'}}>New Price</label>
                            <input type="number" placeholder="300" min={1} name="actualPrice" value={product.actualPrice} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label style={{color: theme === 'dark' && 'white'}}>Old Price</label>
                            <input type="number" placeholder="370" name="prevPrice" value={product.prevPrice} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label style={{color: theme === 'dark' && 'white'}}>Description</label>
                        <textarea name="description" placeholder="Description of product" value={product.description} onChange={handleChange}></textarea>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="submit-btn">
                        {addingProduct ? (
                            <CircularProgress size={25}/>
                        ):(
                            'Add Product'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}