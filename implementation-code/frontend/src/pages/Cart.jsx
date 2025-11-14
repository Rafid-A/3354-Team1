import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { Separator } from "@radix-ui/react-select";
import { Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  return (
    <main className="flex flex-col space-y-6 min-h-screen gap-2">
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-8 p-6 w-full max-w-7xl mx-auto">
        <div className="lg:w-2/3 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart ({totalItems()} items)</h2>

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
                // onClick={handleCheckout}
                // disabled={isCheckoutLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xl w-full h-12 transition-colors hover:cursor-pointer"
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Cart;
