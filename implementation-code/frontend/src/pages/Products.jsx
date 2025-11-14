import { getAllBrands, getAllCategories, getAllProducts } from "@/api/products";
import Filters from "@/components/filters";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProductStore } from "@/store/productStore";
import { ArrowRightIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const Products = () => {
  const { setProducts, setCategories, setBrands, categories, brands, filteredProducts } =
    useProductStore();

  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  // const filteredProducts = useProductStore((state) => state.filteredProducts());

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "low":
        return a.price - b.price;
      case "high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllBrands(),
        ]);

        setProducts(productRes);
        setCategories(categoryRes);

        console.log(categoryRes);
        setBrands(brandRes);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts, setCategories, setBrands]);

  return (
    <main className="flex flex-col gap-2 space-y-6 min-h-screen">
      <Navbar />

      <div className="mx-auto p-4 md:p-6 container">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="hidden md:block w-64 shrink-0">
            <Filters categories={categories} brands={brands} />
          </div>

          <div className="flex-1">
            <div className="flex justify-end gap-4 mb-4">
              <div className="md:hidden flex justify-end">
                <Sheet open={openFilter} onOpenChange={setOpenFilter}>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SlidersHorizontal className="mr-2 w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="left" className="p-4 w-72">
                    <Filters categories={categories} brand={brands} />
                  </SheetContent>
                </Sheet>
              </div>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>

                  <SelectItem value="low">
                    <span className="inline-flex items-center gap-1">
                      Price: Low <ArrowRightIcon className="w-5 h-4" /> High
                    </span>
                  </SelectItem>

                  <SelectItem value="high">
                    <span className="inline-flex items-center gap-1">
                      Price: High <ArrowRightIcon className="w-5 h-4" /> Low
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <p>Loading</p>
            ) : (
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
