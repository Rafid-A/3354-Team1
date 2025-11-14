import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { Toaster } from "sonner";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Store from "./pages/Store";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/store/:id" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
