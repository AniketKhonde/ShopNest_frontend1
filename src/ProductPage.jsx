import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import backgroundImage from '/background_img1.jpg';

const ProductPage = () => {
    const { productId } = useParams(); // Extract productId from URL parameters
    const [product, setProduct] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setIsLoggedIn(true);
        }
    }, []); // Run once on component mount to check user login status

    useEffect(() => {
        if (productId) { // Check if productId is not null
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://shop-nest-backend1.vercel.app/api/productDetails/${productId}`);
                    const data = await response.json();
                    setProduct(data);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            };

            fetchData();
        }
    }, [productId]); // Re-fetch product data when productId changes

    // Function to handle adding product to cart
    const handleAddToCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!isLoggedIn) {
            alert("please login/register");
        }
        else {
            try {
                const response = await fetch(`https://shop-nest-backend1.vercel.app/api/addcart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: productId,
                        quantity: 1 // You can adjust the quantity as needed
                    })
                });

                if (response.ok) {
                    alert("product added cart succesull")
                    console.log('Product added to cart:', productId);
                    // You can update the UI to indicate that the product has been added to the cart
                } else {
                    console.error('Failed to add product to cart:', response.statusText);
                    // Handle the error
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        }
    };

    // Function to handle buying product
    const handleBuyNow = async (productId, productPrice) => {
        const userId = localStorage.getItem('userId');
        if (!isLoggedIn) {
            alert("please login/resister first")
        }
        else {
            try {
                // Calculate the total price (assuming quantity is 1 for now)
                const totalPrice = productPrice * 1;

                // Make API call to add product to order
                const response = await fetch(`https://shop-nest-backend1.vercel.app/api/addorder/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userId, // assuming userId is defined somewhere in your code
                        productId: productId,
                        totalPrice: totalPrice,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    alert("Product added to orders successfully");
                    console.log('Buying product:', productId);
                    console.log('product ordered:', productId); // assuming the response includes the orderId
                } else {
                    console.error('Failed to order product:', response.statusText);
                }
            } catch (error) {
                console.error('Error buying product:', error);
            }
        }
    };



    return (
        <div className="container mx-auto py-8 flex bg-cover bg-center h-screen justify-center item-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {product ? (
                <div className="bg-blue-100 p-4 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-800 md:w-1/2 w-3/4">
                    <div>
                        <div className='flex items-center justify-center'>
                           <img src={product.imageUrl} alt={product.name} className="md:h-56 h-34 p-4 m-8  rounded-2xl"/>
                        </div>
                    <h2 className="md:text-xl font-semibold mb-2 text-sm ">{product.name}</h2>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{product.description}</p>
                    <p className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">₹{product.price} /-</p>
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">Category: {product.category}</p>
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">Delivery charges ₹40 /-</p>

                    </div>
                    <div className="flex justify-between w-full mt-6 mb-2">
                        <button
                            className="md:py-2 md:px-4 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-sm sm:text-base"
                            onClick={() => handleAddToCart(product._id)} // Assuming _id is the product ID
                        >
                            Add to Cart
                        </button>
                        <button
                            className="md:py-2 md:px-4 py-1 px-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 text-sm sm:text-base"
                            onClick={() => handleBuyNow(product._id, product.price)}>
                            Buy Now
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProductPage;
