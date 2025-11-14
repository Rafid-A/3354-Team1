import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: "products" });
  return result.secure_url;
};

export default uploadFile;
