import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "@/api/products";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCartWithQuantity } = useCartStore();

  const [product, setProduct] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    const count = addToCartWithQuantity(product, quantity);

    if (count == quantity) {
      toast.success("Added to Cart", {
        description: `${count} ${product.productName}`,
        duration: 2000,
      });
    } else if (count == 0) {
      toast.warning("Max Limit", {
        description: `Cannot add more than ${product.stockQuantity} ${product.productName}`,
        duration: 2000,
      });
    } else {
      toast.warning("Limited Quantity", {
        description: `Could only add ${product.stockQuantity} ${product.productName}`,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-6 text-green-500" />
      </div>
    );

  return (
    <main className="flex flex-col gap-2 space-y-6 min-h-screen">
      <Navbar />

      <div className="flex lg:flex-row flex-col gap-10 mx-auto p-6 w-full max-w-7xl">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <Card className="overflow-hidden">
            <CardContent className="p-2">
              <img
                src={product.images[selectedImageIndex].imageUrl}
                alt={product.productName}
                className="bg-gray-100 rounded-lg w-full h-[500px] object-contain"
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`border rounded-md overflow-hidden w-30 h-30 shrink-0 ${
                  selectedImageIndex === i ? "border-teal-600" : "border-gray-300"
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`Thumbnail ${i}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:w-1/2">
          <div>
            <h1 className="mt-2 font-semibold text-3xl">{product.productName}</h1>

            <Badge className="bg-teal-200 mt-3 border-2 border-teal-700 border-solid text-gray-700 text-sm">
              {product.categoryName.charAt(0).toUpperCase() +
                product.categoryName.slice(1).toLowerCase()}
            </Badge>
          </div>

          <Separator />

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <p className="text-gray-800 text-left">
            Seller:{" "}
            <Link
              to={`/store/${product.vendorId}`}
              className="hover:text-teal-600 transition-colors hover:cursor-pointer hover:underline"
            >
              {product.storeName}
            </Link>
          </p>

          <Separator />

          <h1 className="mt-1 font-bold text-teal-600 text-3xl">${product.price?.toFixed(2)}</h1>

          <div className="flex md:flex-row flex-col justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>

              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQty}
                  className="hover:bg-teal-100"
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <span className="px-4 font-semibold text-lg">{quantity}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQty}
                  className="hover:bg-teal-100"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="bg-teal-600 hover:bg-teal-700 mt-3 w-full sm:w-auto h-12 text-white text-xl hover:cursor-pointer"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
