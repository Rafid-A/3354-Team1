import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/auth";
// import { getUserOrders, getVendorOrders } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      try {
        const profile = await getUserProfile();
        setUser(profile);

        // const orderData =
        //   profile.role === "vendor"
        //     ? await getVendorOrders(profile.vendorId)
        //     : await getUserOrders(profile.userId);
        // setOrders(orderData);
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

  if (loading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen space-y-6 flex flex-col">
      <Navbar />

      <div className="p-6 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome, {user.name} ({user.role})
        </h1>

        {user.role === "vendor" && (
          <Link href={`/store/${user.vendorId}`}>
            <Button className="mb-6">View My Store</Button>
          </Link>
        )}

        <h2 className="text-xl font-semibold mb-4">
          {user.role === "vendor" ? "Store Orders" : "My Orders"}
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link href={`/orders/${order.orderId}`} key={order.orderId}>
              <div className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
                <p className="font-semibold">
                  Order #{order.orderId} — {order.status}
                </p>
                {user.role === "vendor" ? (
                  <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Total: ${order.totalPrice}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Profile;
