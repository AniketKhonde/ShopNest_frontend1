import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slideshow from './SlideShow';

const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

const LandingPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const productSectionRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading]=useState(true);

    useEffect(() => {
        setTimeout(()=>{
            setLoading(false);
            fetchProducts();
        },4000)
        setIsLoggedIn(checkLoginStatus());
        checkLoginStatus();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://shop-nest-backend1.vercel.app/api/products');
            const data = await response.json();
            setProducts(data);
            filterProducts(category, searchQuery, data);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    const filterProducts = (selectedCategory, query, products) => {
        let filtered = products;

        // Apply category filter if selectedCategory is not 'all' and search query is empty
        if (selectedCategory !== 'all' && query.trim() === '') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Apply search query filter if it's not empty
        if (query.trim() !== '') {
            filtered = filtered.filter(product => (
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            ));
        }

        setFilteredProducts(filtered);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
    };

    const scrollToBottomOfFirst = () => {
        productSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const filterProductsByCategory = (selectedCategory) => {
        setCategory(selectedCategory);
        filterProducts(selectedCategory, searchQuery, products);
        scrollToBottomOfFirst();
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        filterProducts(category, event.target.value, products);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            scrollToBottomOfFirst();
        }
    };


    const images = [
        { src: 'https://m.media-amazon.com/images/I/91NSAfbSYkL._SX3000_.jpg', alt: 'Slide 1' },
        { src: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG23/TVs/Manish/MayART24/Mainpage/graborgone/55/D129149002_IN_HE_TV_GW_MayART_PC_Hero_3000x1200_._CB559897093_.jpg', alt: 'Slide 2' },
        { src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img24/Media/MayART/TEASER/PC_Hero_3000x1200_Outdoor_toys._CB559804226_.jpg', alt: 'Slide 3' },
        { src: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG24/Smart_Watches/MAY_ART24/PC_Hero_3000x1200_Unrec_Smartwatch_bankrevised._CB559788299_.jpg', alt: 'Slide 4' },
        { src: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/PC_hero_3000x1200_3_2x._CB559754018_.jpg', alt: 'Slide 5' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gray-600 shadow-2xl">
                <div className="container mx-auto py-2 px-2 md:py-4 md:px-4 md:mb-0 mb-2 md:flex md:items-center">
                    <div className='flex ml-4  md:mb-0 mb-2'>
                        <div className="flex items-center justify-between md:mr-24 mr-12">
                            <div className="text-2xl font-bold text-white tracking-tight">
                                <span className="text-blue-500">Shop</span>
                                <span className="text-yellow-500">Nest</span>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search products"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                            className="bg-gray-100 border-2 border-gray-800 rounded-lg md:py-2 md:px-2 focus:outline-none focus:bg-white focus:border-blue-500  mr-16"
                        />
                    </div>


                    <nav className="hidden md:flex space-x-4 mr-64">
                        {/* Navigation Links */}

                        <button onClick={() => filterProductsByCategory('all')} className={`mr-4 text-white hover:text-blue-600 ${category === 'all' ? 'font-semibold' : ''}`}>All</button>
                        <button onClick={() => filterProductsByCategory('elctronics')} className={`mr-4 text-white hover:text-blue-600 ${category === 'elctronics' ? 'font-semibold' : ''}`}>Electronics</button>
                        <button onClick={() => filterProductsByCategory('sport')} className={`mr-4 text-white hover:text-blue-600 ${category === 'sport' ? 'font-semibold' : ''}`}>Sports</button>
                        <button onClick={() => filterProductsByCategory('Fashion')} className={`mr-4 text-white hover:text-blue-600 ${category === 'Fashion' ? 'font-semibold' : ''}`}>Fashion</button>
                        <button onClick={() => filterProductsByCategory('grocery')} className={`text-white hover:text-blue-600 ${category === 'grocery' ? 'font-semibold' : ''}`}>Groceries</button>
                    </nav>

                    <div className="md:flex items-center ">

                        <div className='flex space-x-14 ml-18'>
                            {isLoggedIn && (
                                <>
                                    <Link to="/profile" className="text-white flex flex-col items-center hover:text-blue-600">
                                        <img src="/profile_icon.gif" alt="Profile Icon" className="w-8 h-8 rounded-md" />
                                        <span>Profile</span>
                                    </Link>

                                    <Link to="/orders" className="text-white flex flex-col items-center hover:text-blue-600">
                                        <img src="/order_icon.gif" alt="order_icon" className="w-8 h-8 rounded-md" />
                                        <span>Orders</span>
                                    </Link>

                                    <Link to="/cart" className="text-white flex flex-col items-center hover:text-blue-600">
                                        <img src="/cart_icon.gif" alt="cart_icon" className="w-8 h-8 rounded-md" />
                                        <span>Cart</span>
                                    </Link>

                                    <button onClick={handleLogout} className="text-white flex flex-col items-center hover:text-blue-600">
                                        <img src="/logout_icon.gif" alt="logout_icon" className="w-8 h-8 rounded-md" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Login/Signup Buttons */}
                        {!isLoggedIn && (

                            <div class="flex md:mt-0 mt-1 mr-2">
                                <div class="ml-auto">
                                    <Link to="/login" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold md:py-2 md:px-4 rounded-lg py-1 px-1">Login</Link>
                                    <Link to="/register" className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold md:py-2 md:px-4 rounded-lg py-1 px-1">Sign Up</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-12 px-4 text-center shadow-lg">

                <div className='mt-4'>
                    <Slideshow images={images} />
                </div>

                <div className="container mx-auto relative z-10 mt-64">

                    <div className="container mx-auto relative z-10 flex justify-around items-center space-x-1 border border-gray-800 shadow-md bg-white rounded-md p-4 ">

                        <div className="" onClick={() => filterProductsByCategory('all')}>
                            <img src="https://m.media-amazon.com/images/G/31/img23/HPC/CatPage/Halo_434x434_3_V2._CB594076119_.jpg" alt="electronics" className="md:w-44 md:h-64 w-16 h-34 md:rounded-full cursor-pointer md:border border-gray-100 hover:border-red-900 border-8" />
                            <p className="md:mt-2 text-sm sm:text-base">All producs</p>
                        </div>

                        <div className="" onClick={() => filterProductsByCategory('elctronics')}>
                            <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img22/dec/pc/sbc/440X460_1.jpg" alt="electronics" className="md:w-44 md:h-64 w-14 h-34 md:rounded-full cursor-pointer md:border border-gray-600 hover:border-red-800  border-8" />
                            <p className="md:mt-2 mt-4 text-sm sm:text-base">electronics</p>
                        </div>
                        <div className="" onClick={() => filterProductsByCategory('sport')}>
                            <img src="https://m.media-amazon.com/images/I/61Pk-inEobL._AC_UL480_FMwebp_QL65_.jpg" alt="sports" className="md:w-44 md:h-64 w-16 h-16 md:rounded-full cursor-pointer md:border border-gray-600 hover:border-red-800  border-8" />
                            <p className="md:mt-2 mt-3 text-sm sm:text-base">sports</p>
                        </div>
                        <div className="" onClick={() => filterProductsByCategory('Fashion')}>
                            <img src="https://m.media-amazon.com/images/I/41eKJH0mMBL._AC_UL480_FMwebp_QL65_.jpg" alt="fashion" className="md:w-44 md:h-64 w-16 h-34 md:rounded-full cursor-pointer md:border border-gray-600 hover:border-red-800  border-8" />
                            <p className="md:mt-2 mt-6 text-sm sm:text-base">fashion</p>
                        </div>
                        <div className="" onClick={() => filterProductsByCategory('grocery')}>
                            <img src="https://m.media-amazon.com/images/I/51iL74dA4yS._AC_UL480_FMwebp_QL65_.jpg" alt="grocery" className="md:w-44 md:h-64 w-16 h-34 md:rounded-full cursor-pointer md:border border-gray-800  hover:border-red-800  border-8" />
                            <p className="md:mt-2 mt-4 text-sm sm:text-base">grocery</p>
                        </div>

                    </div>

                </div>
            </section>

            {/* Product Showcase */}
            {/* Product Showcase */}
            <section ref={productSectionRef} className="bg-green-100 py-12">
            <div className="container mx-auto">
                <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-6 text-center">Products</h2>
                {loading ? (
                 <div className="flex justify-center items-center h-full">
                     <div className="text-center">
                         <p>Loading...</p>
                         <img src="/loading_icon.gif" alt="Loading" />
                     </div>
                 </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:ml-24 md:mr-24 ml-4 mr-4 ">
                        {filteredProducts.length === 0 ? (
                         <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <p>No items to show</p>
                                <img src="/no_toshow.gif" alt="no items" />
                            </div>
                        </div>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md relative">
                                    <div className='flex items-center justify-center'>
                                        <img src={product.imageUrl} alt={product.name} className="md:h-56 h-24 p-4" />
                                    </div>
                                    <div className="p-4 font-sans">
                                        <h3 className="md:text-xl text-12 font-semibold text-gray-800 mb-2">{product.name.split(' ').slice(0, 3).join(' ')}
                                            {product.name.split(' ').length > 3 ? ' ...' : ''}</h3>
                                        <p className="text-gray-600 md:p-4 p-1 text-sm sm:text-base">{product.description.split(' ').slice(0, 15).join(' ')}
                                            {product.description.split(' ').length > 15 ? ' ...' : '...'}</p>
                                        <p className="text-gray-800 md:p-4 p-1 mb-10">M.R.P: only ₹ <span className="md:text-2xl text-xl">{product.price} /-</span></p>
                                        <div className="absolute bottom-4">
                                            <Link to={`/ProductPage/${product._id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold md:py-2 py-1 md:px-4 px-2 rounded-lg mr-14 ml-2 text-sm sm:text-base">Buy Now</Link>
                                            <Link to={`/ProductPage/${product._id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold md:py-2 py-1 md:px-4 px-2 rounded-lg text-sm sm:text-base">Add to Cart</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 ShopNest. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;