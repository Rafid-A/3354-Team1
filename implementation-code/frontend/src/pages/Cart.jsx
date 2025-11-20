import { checkoutSession } from "@/api/checkout";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCartStore } from "@/store/cartStore";
import { Separator } from "@radix-ui/react-select";
import { Minus, OctagonX, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async () => {
    if (cartItems.length == 0) {
      toast.warning("Please add an item to cart", {
        duration: 2000,
      });

      return;
    }

    setIsCheckoutLoading(true);

    const body = {
      products: cartItems,
    };

    const session = await checkoutSession(body);

    setIsCheckoutLoading(false);

    window.location.href = session.sessionUrl;
  };

  return (
    <main className="flex flex-col space-y-6 min-h-screen gap-2">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8 p-6 w-full max-w-7xl mx-auto">
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Shopping Cart ({totalItems()} items)
            </h2>
            {cartItems.length != 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="cursor-pointer rounded-full hover:text-red-600 transition-colors"
                      variant="outline"
                      size="icon"
                      onClick={() => clearCart()}
                    >
                      <OctagonX className="h-15 w-15" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black">
                    <p>Clear Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {cartItems.length == 0 && <p className="text-gray-800">Your cart is empty</p>}

          {cartItems.map((item) => (
            <Card key={item.productId} className="flex flex-col sm:flex-row p-4 gap-4">
              <img
                src={item.imageUrl || item?.images[0]?.imageUrl}
                alt={item.productName}
                className="w-full sm:w-32 h-32 object-contain bg-gray-50 rounded-lg shrink-0"
              />

              <div className="flex flex-col justify-between grow">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-700">{item.productName}</h3>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Price: ${item.price}</p>
                </div>

                <div className="flex justify-between items-center mt-3 sm:mt-0">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="hover:bg-teal-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 text-lg font-semibold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="hover:bg-teal-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <span className="text-xl font-bold text-teal-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>{" "}
                {/* Assuming free shipping for simplicity */}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax (8.25%)</span>
                <span className="font-medium">${(totalPrice() * 0.0825).toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between pt-2">
                <span className="text-2xl font-bold text-gray-800">Order Total</span>
                <span className="text-3xl font-bold text-teal-600">
                  ${(totalPrice() * 1.0825).toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xl w-full h-12 transition-colors hover:cursor-pointer"
              >
                {isCheckoutLoading && <Spinner />}Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Cart;
