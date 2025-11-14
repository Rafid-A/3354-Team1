import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/productCard";
import { getVendorById } from "@/api/vendor";
import { getVendorProducts } from "@/api/products";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/navbar";
import { LucideMail } from "lucide-react";

const Store = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const vendorData = await getVendorById(id);
      const vendorProducts = await getVendorProducts(id);
      setVendor(vendorData);
      setProducts(vendorProducts);
    }
    fetchData();
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  return (
    <main className="flex flex-col gap-2 space-y-6 min-h-screen">
      <Navbar />

      <div className="p-6 w-full max-w-6xl self-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between text-center mb-6">
          <div className="text-left">
            <h1 className="text-2xl font-semibold">{vendor.storeName}</h1>

            <p className="text-muted-foreground max-w-md mt-1">{vendor.description}</p>

            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-2 hover:cursor-pointer hover:text-teal-600 transition-colors text-gray-600 text-sm mt-3"
            >
              <LucideMail className="w-4 h-4" />
              Contact
            </a>
          </div>

          <div className="flex-1">
            <img
              src={vendor.storeImageUrl}
              alt={vendor.name}
              className="w-full h-46 rounded-md object-cover mb-3"
            />
          </div>
        </div>

        <Separator className="my-6" />

        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Store;
