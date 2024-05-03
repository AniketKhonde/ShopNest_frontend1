import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import CartPage from './CartPage';
import OrderPage from './OrderPage';
import ProductPage from './ProductPage';

const App = () => {
    return (
        <Router>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        {/* Add route for ProductPage */}
        <Route path="/ProductPage/:productId" element={<ProductPage />} />
        {/* Add more routes for other pages */}
    </Routes>
</Router>
    );
};

export default App;
