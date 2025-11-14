import CategoryCard from "@/components/categoryCard";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/productCard";
import { bestSellers, topCategories } from "@/lib/data";
import React from "react";

const Home = () => {
  return (
    <main className="flex flex-col gap-2 space-y-12 min-h-screen">
      <Navbar />

      <Hero />

      <div className="mx-auto px-5 w-full max-w-5xl">
        <h2 className="font-bold text-2xl">Best Sellers</h2>

        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 px-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>

      <div className="mx-auto px-5 w-full max-w-5xl">
        <h2 className="font-bold text-2xl">Top Categories</h2>

        <div className="gap-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 mt-5 px-2">
          {topCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Home;
