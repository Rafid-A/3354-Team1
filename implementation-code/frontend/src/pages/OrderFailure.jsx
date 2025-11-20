import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";

const OrderFailure = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!timeLeft) navigate("/cart", { replace: true });

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <main className="flex justify-center items-center min-h-screen p-4 sm:p-10 bg-gray-50">
      <Card className="w-full max-w-lg p-5 shadow-lg rounded-lg flex flex-col items-center">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <CircleX className="h-28 w-28 md:h-32 md:w-32 text-red-600" />

          <CardTitle className="mt-4 font-bold text-2xl md:text-3xl">Payment Failed</CardTitle>

          <CardDescription className="text-base md:text-lg">Please Try Again</CardDescription>
        </CardHeader>

        <CardContent>Redirecting to Cart in {timeLeft} seconds</CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-center gap-4 mt-2 w-full">
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-auto hover:cursor-pointer"
            onClick={() => navigate("/cart", { replace: true })}
          >
            Cart
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default OrderFailure;
