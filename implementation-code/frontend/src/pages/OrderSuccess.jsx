import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCartStore } from "@/store/cartStore";
import confetti from "canvas-confetti";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
    setLoading(false);

    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-6 text-green-500" />
      </div>
    );

  return (
    <main className="flex justify-center items-center min-h-screen p-4 sm:p-10 bg-gray-50">
      <Card className="w-full max-w-lg p-5 shadow-lg rounded-lg flex flex-col items-center">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <CircleCheck className="h-28 w-28 md:h-32 md:w-32 text-teal-600" />

          <CardTitle className="mt-4 font-bold text-2xl md:text-3xl">
            Order Placed Successfully
          </CardTitle>

          <CardDescription className="text-base md:text-lg">
            Thank you for ordering!
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col md:flex-row justify-center gap-4 mt-10 w-full">
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-auto hover:cursor-pointer"
            onClick={() => navigate("/profile", { replace: true })}
          >
            View Order
          </Button>

          <Button
            size="lg"
            className="w-full md:w-auto hover:cursor-pointer"
            onClick={() => navigate("/", { replace: true })}
          >
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default OrderSuccess;
