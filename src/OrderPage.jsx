import React, { useState, useEffect } from 'react';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order data for the logged-in user from backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Assuming userId is obtained from authentication mechanism
                const userId = localStorage.getItem('userId'); // Replace with your actual method of obtaining the user ID

                // Fetch orders for the logged-in user
                const response = await fetch(`https://shop-nest-backend1.vercel.app/api/showorder/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                else {
                    setIsLoading(false);
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrders();
    }, []);

    const handelDelete = async (orderId) => {
        try {
            const response = await fetch(`https://shop-nest-backend1.vercel.app/api/deleteorder/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete order');
            }
    
            // If the deletion was successful, update the orders state to reflect the changes
            const updatedOrders = orders.filter(order => order._id !== orderId);
            setOrders(updatedOrders);
    
        } catch (error) {
            console.error('Error deleting order:', error);
            // Handle error
        }
    }

    if (isLoading) {
        return <div className="container mx-auto py-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto py-8  bg-blue-100">
            <h1 className="md:text-3xl text-xl font-semibold md:mb-6 mb-2 text-center">~Orders~</h1>
            {orders.length === 0 ? (
                <div className="text-center text-gray-600">
                    <div className='flex justify-center item-center'>
                        <img src="/no_toshow.gif" alt="" />
                    </div>
                    <h1>
                        <b>No orders to show</b>
                    </h1>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="w-3/4 mx-auto bg-white p-4 rounded shadow-2xl mb-4">
                        <h1 className='md:mb-4 mb-2 text-sm sm:text-base'>Order date: {order.orderDate}</h1>
                        {order.products.map((product) => (
                            <div key={product._id} className="md:flex items-center mb-2">
                                <div className='flex justify-center item-center'>
                                   <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-md object-cover ml-4 mr-8" />
                                </div>
                                
                                <div>
                                    <h3 className="md:text-lg font-semibold">{product.name}</h3>
                                    <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
                                    <p className="text-gray-600 text-sm sm:text-base">Price: ₹{product.price} /-</p>
                                    <p className="text-gray-600 text-sm sm:text-base">Delivery charges:₹ 40 /-</p>
                                    <p className="text-gray-600 text-sm sm:text-base">will be delivered within 2-3 days</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end mt-4">
                            <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                onClick={() => { handelDelete(order._id) }}> {/* Corrected spelling of 'handleDelete' */}
                                cancel
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderPage;
