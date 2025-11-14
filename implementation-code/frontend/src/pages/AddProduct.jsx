import { createProduct } from "@/api/products";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  brand: z.string().min(2, "Brand is required"),
  category: z.string().min(2, "Category is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), "Price must be a number"),
  stockQuantity: z.string().refine((val) => !isNaN(parseInt(val)), "Stock must be a number"),
});

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const primaryImageRef = useRef(null);
  const imagesRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      price: "",
      stockQuantity: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // validate images
      const primaryImageFiles = primaryImageRef.current?.files;
      if (!primaryImageFiles || primaryImageFiles.length === 0) {
        toast.error("Primary image is required");
        return;
      }

      const additionalImages = imagesRef.current?.files;
      if (additionalImages && additionalImages.length > 4) {
        toast.error("You can upload a maximum of 4 additional images");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("stockQuantity", data.stockQuantity);
      formData.append("primaryImage", primaryImageFiles[0]);

      if (additionalImages && additionalImages.length > 0) {
        for (let i = 0; i < additionalImages.length; i++) {
          formData.append("images", additionalImages[i]);
        }
      }

      console.log("Form submitted:", primaryImageFiles[0]);

      const response = await createProduct(formData);

      toast.success("Product added successfully!");

      reset();
      if (primaryImageRef.current) primaryImageRef.current.value = "";
      if (imagesRef.current) imagesRef.current.value = "";
    } catch (error) {
      toast.error(error.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="grow bg-muted/10 py-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow p-8">
          <h1 className="text-3xl font-semibold mb-6">Add New Product</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
            encType="multipart/form-data"
          >
            <FieldSet>
              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="name">Product Name</FieldLabel>
                    <Input id="name" placeholder="e.g. iPhone 17 Pro" {...register("name")} />
                    {errors.name && <FieldError errors={[errors.name]} />}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="brand">Brand</FieldLabel>
                    <Input id="brand" placeholder="e.g. Apple" {...register("brand")} />
                    {errors.brand && <FieldError errors={[errors.brand]} />}
                  </Field>
                </div>
              </FieldGroup>

              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <Input id="category" placeholder="e.g. Smartphone" {...register("category")} />
                    {errors.category && <FieldError errors={[errors.category]} />}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="price">Price ($)</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="1299.00"
                      {...register("price")}
                    />
                    {errors.price && <FieldError errors={[errors.price]} />}
                  </Field>
                </div>
              </FieldGroup>

              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="stockQuantity">Stock Quantity</FieldLabel>
                    <Input
                      id="stockQuantity"
                      type="number"
                      placeholder="10"
                      {...register("stockQuantity")}
                    />
                    {errors.stockQuantity && <FieldError errors={[errors.stockQuantity]} />}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="primaryImage">Primary Image</FieldLabel>
                    <Input id="primaryImage" type="file" accept="image/*" ref={primaryImageRef} />
                    <FieldDescription>Upload a single main image for the product.</FieldDescription>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="images">Additional Images (up to 4)</FieldLabel>
                  <Input id="images" type="file" multiple accept="image/*" ref={imagesRef} />
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  rows={5}
                  placeholder="Enter product details..."
                  {...register("description")}
                />
                {errors.description && <FieldError errors={[errors.description]} />}
              </Field>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? "Submitting..." : "Add Product"}
              </Button>
            </FieldSet>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AddProduct;
