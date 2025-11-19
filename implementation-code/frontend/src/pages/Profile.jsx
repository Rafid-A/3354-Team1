import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/auth";
import { getAllUserOrders, getAllVendorOrders } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();

    navigate("/", { replace: true });
  };

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      try {
        const profile = await getUserProfile();
        setUser(profile);

        const orderData =
          profile.role === "vendor" ? await getAllVendorOrders() : await getAllUserOrders();
        setOrders(orderData);
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
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-6 text-green-500" />
      </div>
    );

  return (
    <main className="flex flex-col min-h-screen space-y-6">
      <Navbar />
      <div className="p-6 w-full max-w-7xl mx-auto">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-2xl font-semibold mb-6">
            <span className="text-teal-600">{user.name}</span>{" "}
            <span className="font-light">({user.role})</span>
          </h1>
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">My Orders</h2>

        <div className="space-y-6">
          {orders.length == 0 && <p className="text-gray-800">You have not placed any orders</p>}

          <div className="mx-auto max-w-5xl space-y-10">
            {orders.map((order) => (
              <Card key={order.orderId} className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    <span
                      className="underline underline-offset-3 hover:text-teal-700 hover:cursor-pointer"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      Order #{order.orderId}
                    </span>
                    - Total: <span className="text-teal-600">${order.totalAmount}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(order.items)
                    .flat()
                    .map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-32 h-32 object-contain bg-gray-50 rounded-lg"
                        />
                        <div className="flex flex-col justify-between flex-grow">
                          <h3
                            className="font-semibold text-gray-700 hover:underline hover:cursor-pointer"
                            onClick={() => navigate(`/products/${item.productId}`)}
                          >
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">
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
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
