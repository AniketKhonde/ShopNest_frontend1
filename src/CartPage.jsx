import React, { useState, useEffect } from 'react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch cart data for the logged-in user from backend
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                // Assuming userId is obtained from authentication mechanism
                const userId = localStorage.getItem('userId'); // Replace with your actual method of obtaining the user ID

                // Fetch cart data for the logged-in user
                const response = await fetch(`https://shop-nest-backend1.vercel.app/api/showcart/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cart data');
                }

                const data = await response.json();
                setCartItems(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                setError('Failed to fetch cart data');
                setIsLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const handelDelete = async (itemId) => {
        try {
            // Make a DELETE request to your backend API to remove the item from the database
            const response = await fetch(`https://shop-nest-backend1.vercel.app/api/deleteCartItem/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from the cart');
            }

            // If the deletion was successful, update the cartItems state to remove the item
            const updatedCartItems = cartItems.filter(item => item._id !== itemId);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from the cart:', error);
            // Handle error
        }
    };

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-8 text-center text-red-600">{error}</div>;
    }


    return (
        <div className="container py-8 bg-blue-100">
            <h1 className="md:text-3xl text-xl font-semibold md:mb-6 mb-4 text-center">~Your Cart~</h1>
            {cartItems.length === 0 ? (

                <div className="text-center text-gray-600">
                    <div className='flex justify-center item-center'>
                        <img src="/no_toshow.gif" alt="" />
                    </div>
                    <h1>
                        <b>No cart items to show</b>
                    </h1>
                </div>
            ) : (
                cartItems.map((item) => (
                    <div key={item._id} className="w-3/4 mx-auto bg-white p-4 rounded-md shadow-2xl mb-4 md:flex">
                        <div className='flex justify-center item-center mb-2'>
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 rounded-md object-cover ml-4 mr-8" />
                        </div>
                        <div className=''>
                            <h3 className="md:text-lg font-semibold mb-2">{item.product.name}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">{item.product.description}</p>
                            <p className="text-sm sm:text-base">Price: ₹{item.product.price}</p>
                            <p className=" text-sm sm:text-base mb-4">Category: {item.product.category}</p>
                            <div className='flex justify-end mt-4'>
                                <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={() => { handelDelete(item._id) }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CartPage;
