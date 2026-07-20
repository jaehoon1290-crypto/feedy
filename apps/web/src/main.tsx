import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './state/cart';
import { Header } from './components';
import { Cart, Favorites, Home, Login, Orders, StoreDetail } from './pages';
import { MyPage } from './my-page';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><CartProvider><Header /><Routes><Route path="/" element={<Home />} /><Route path="/stores/:id" element={<StoreDetail />} /><Route path="/cart" element={<Cart />} /><Route path="/login" element={<Login />} /><Route path="/orders" element={<Orders />} /><Route path="/favorites" element={<Favorites />} /><Route path="/settings" element={<MyPage />} /></Routes></CartProvider></BrowserRouter></StrictMode>);
