import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useCartStore } from "@/store/cartStore";

const Navbar = () => {
  const { totalItems } = useCartStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-6">
                <div className="flex flex-col gap-4">
                  <Link to="/products" onClick={() => setOpen(false)}>
                    Products
                  </Link>

                  {/* <Link to="/categories" onClick={() => setOpen(false)}>
                    Categories
                  </Link> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="text-xl font-bold">
            <span className="text-teal-500">Circuit</span>Zone
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-teal-600">
              Products
            </Link>

            {/* <Link
              to="/categories"
              className="text-sm font-medium text-gray-600 hover:text-teal-600"
            >
              Categories
            </Link> */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex max-w-md">
            <Input type="text" placeholder="Search products" className="w-full" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-teal-600 relative hover:cursor-pointer"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalItems()}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-teal-600 hover:cursor-pointer"
            onClick={handleProfileClick}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
