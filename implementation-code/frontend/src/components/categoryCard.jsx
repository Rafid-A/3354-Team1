import { Card, CardContent } from "./ui/card";

const CategoryCard = ({ category }) => {
  return (
    <Card
      //   onClick={onClick}
      className="group cursor-pointer overflow-hidden transition hover:shadow-md hover:scale-[1.02]"
    >
      <div className="relative">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-32 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
      </div>

      <CardContent className="p-3 text-center">
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-teal-600 transition truncate">
          {category.name}
        </h3>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
