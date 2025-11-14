import React from "react";
import { Card, CardContent } from "./ui/card";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const handleCardClick = () => {
    navigate(`/products/${product.productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const success = addToCart(product);

    if (success) {
      toast.success("Added to Cart", {
        description: `${product.productName}`,
        duration: 1000,
      });
    } else {
      toast.warning("Max Limit", {
        description: `Cannot add more than ${product.stockQuantity} ${product.productName}`,
        duration: 2000,
      });
    }
  };

  return (
    <Card
      className="group relative hover:shadow-lg overflow-hidden transition hover:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative bg-gray-100 p-5">
        <img src={product.imageUrl} alt={product.product} className="w-full h-52 object-contain" />

        <Button
          onClick={handleAddToCart}
          size="icon"
          className="right-2 bottom-2 absolute bg-teal-500 hover:bg-teal-600 opacity-0 group-hover:opacity-100 rounded-full text-white transition hover:cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium text-gray-800 text-base truncate">{product.productName}</h3>

        <p className="mt-1 font-semibold text-teal-600">${product.price?.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
