import { getUserProfile } from "@/api/auth";
import { getOrderById } from "@/api/orders";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      try {
        const profile = await getUserProfile();
        setUser(profile);

        const orderDetails = await getOrderById(id);

        setOrder(orderDetails);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-6 text-green-500" />
      </div>
    );

  if (!order) return <p className="p-6">Order not found</p>;

  const allItems = Object.values(order.items).flat();

  const subtotal = allItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const total = parseFloat(order.totalAmount);
  const tax = total - subtotal;

  return (
    <main className="flex flex-col min-h-screen space-y-6">
      <Navbar />
      <div className="p-6 w-full max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
        <p className="text-sm text-gray-500">
          Placed on: {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">
          <div className="lg:w-2xl flex flex-col gap-4">
            {allItems.map((item) => (
              <Card key={item.productId} className="flex flex-col sm:flex-row p-4 gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full sm:w-32 h-32 object-contain bg-gray-50 rounded-lg"
                />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-700 hover:underline hover:cursor-pointer"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Price: ${parseFloat(item.price).toFixed(2)}
                    </p>
                    <p className="text-sm mt-1">
                      Shipping Status:{" "}
                      <span
                        className={
                          item.shippingStatus === "Processing"
                            ? "text-orange-500"
                            : item.shippingStatus === "Shipped"
                            ? "text-cyan-500"
                            : "text-green-600"
                        }
                      >
                        {item.shippingStatus}
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-xl font-bold text-teal-600">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">
                    Seller:{" "}
                    <Link
                      to={`/store/${item.vendorId}`}
                      className="hover:text-gray-800 transition-colors hover:cursor-pointer hover:underline"
                    >
                      {item.storeName}
                    </Link>
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:w-1/3 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="text-2xl font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-teal-600">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>{order.shipping.name}</p>
                <p>{order.shipping.addressLine1}</p>
                {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.state}, {order.shipping.country} -{" "}
                  {order.shipping.postalCode}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
