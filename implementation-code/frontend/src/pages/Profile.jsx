import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/auth";
import { getAllUserOrders, getAllVendorOrders, updateStatus } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();

    navigate("/", { replace: true });
  };

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatedStatuses((prev) => ({
      ...prev,
      [itemId]: newStatus,
    }));

    console.log(newStatus);

    await updateStatus(itemId, newStatus);
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

  const groupedOrders = orders.reduce((acc, item) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        vendorId: item.vendorId,
        items: [],
      };
    }

    acc[item.orderId].items.push({
      orderItemId: item.orderItemId,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      shippingStatus: item.shippingStatus,
      imageUrl: item.imageUrl,
    });

    return acc;
  }, {});

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
        <div className="flex flex-col md:flex-row w-full justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4">
            <span className="text-teal-600">{user.name}</span>{" "}
            <span className="font-light">({user.role})</span>
          </h1>
          {user.role === "vendor" ? (
            <div className="flex gap-4 mb-4">
              <Button
                className="hover:cursor-pointer"
                size="sm"
                onClick={() => navigate("/addProduct")}
              >
                Add Product
              </Button>
              <Button
                className="hover:cursor-pointer"
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/store/${user.vendorId}`)}
              >
                View Store
              </Button>
              <Button
                className="hover:cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="hover:cursor-pointer"
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">My Orders</h2>

        <div className="space-y-6">
          {orders.length == 0 && <p className="text-gray-800">You do not have any orders</p>}

          <div className="mx-auto max-w-5xl space-y-10">
            {user.role === "customer" &&
              orders.map((order) => (
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
                          <div className="flex flex-col justify-between flex-1">
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

            {user.role === "vendor" &&
              Object.values(groupedOrders)
                .sort((a, b) => b.orderId - a.orderId)
                .map((order) => (
                  <Card key={order.orderId} className="p-4">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        <span
                          className="underline underline-offset-3 hover:text-teal-700 hover:cursor-pointer"
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                        >
                          Order #{order.orderId}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-32 h-32 object-contain bg-gray-50 rounded-lg"
                          />
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <h3
                                className="font-semibold text-gray-700 hover:underline hover:cursor-pointer"
                                onClick={() => navigate(`/products/${item.productId}`)}
                              >
                                {item.productName}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                              <p className="text-sm text-gray-500">Shipping Status: </p>
                              <Select
                                value={updatedStatuses[item.orderItemId] ?? item.shippingStatus}
                                onValueChange={(value) =>
                                  handleStatusChange(item.orderItemId, value)
                                }
                                disabled={item.shippingStatus === "Delivered"}
                              >
                                <SelectTrigger className="w-full sm:w-32 hover:cursor-pointer">
                                  <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Processing">
                                    <p className="text-orange-500">Processing</p>
                                  </SelectItem>
                                  <SelectItem value="Shipped">
                                    <p className="text-cyan-500">Shipped</p>
                                  </SelectItem>
                                  <SelectItem value="Delivered">
                                    <p className="text-green-600">Delivered</p>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
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
