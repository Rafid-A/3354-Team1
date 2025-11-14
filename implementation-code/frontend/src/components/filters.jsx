import { useProductStore } from "@/store/productStore";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { DualRangeSlider } from "./ui/dual-range-slider";

const Filters = ({ categories, brands }) => {
  const { setFilters, filters } = useProductStore();

  const toggleCategory = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    setFilters({ categories: newCategories });
  };

  const toggleBrand = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];

    setFilters({ brands: newBrands });
  };

  const handlePriceChange = (value) => {
    setFilters({ priceRange: value });
  };

  const toggleStock = () => {
    setFilters({ inStockOnly: !filters.inStockOnly });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-lg">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const id = cat.name;

            return (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.categories.includes(id)}
                  onCheckedChange={() => toggleCategory(id)}
                />

                <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-lg">Price Range</h3>
        <DualRangeSlider
          min={0}
          max={10000}
          step={100}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          label={(value) => value}
          className="mt-10"
        />
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-lg">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => {
            const id = brand.brand.toLowerCase();

            return (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.brands.includes(id)}
                  onCheckedChange={() => toggleBrand(id)}
                />

                <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-lg">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="in-stock" checked={filters.inStockOnly} onCheckedChange={toggleStock} />

          <Label htmlFor="in-stock">In Stock Only</Label>
        </div>
      </div>
    </div>
  );
};

export default Filters;
