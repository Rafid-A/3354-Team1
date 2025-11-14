# Backend

## How to run

- cd into the backend folder
- Open up a terminal and execute `npm i` (make sure you have node js installed)
- Then, execute `npm run dev` to start the dev server

## Routes

- **Auth**

  - `/api/auth/signup` - `POST` - create an account
  - `/api/auth/login` - `POST` - login to account
  - `/api/auth/logout` - `POST` - logout of account
  - `/api/auth/profile` - `GET` - get the profile info of the logged in user

- **Brand**

  - `/api/brands` - `GET` - get all the product brands

- **Category**

  - `/api/categories` - `GET` - get all the product categories

- **Product**

  - `/api/products/` - `GET` - get all products
  - `/api/products/:id` - `GET` - get a specific product by _id_
  - `/api/products/` - `POST` - create a new product (vendor only)

- **Vendor**

  - `/api/vendors/` - `GET` - get all vendors
  - `/api/vendors/:id` - `GET` - get a specific vendor by _id_
  - `/api/vendors/:id/products` - `GET` - get all products sold by a specific vendor
  - `/api/vendors/register` - `POST` - register a new vendor

## Currently supported features

- Creating account
- Signing in to account
- Creating products with image upload
- Viewing all products
- Viewing a specific product by id
- Registering a vendor
- Viewing a vendor store page

## TODO

- Integrate stripe to process orders
- Store customer orders in db
- Allow users to retrieve their orders
- Allow vendors to view the orders for their store
- Allow vendors to update order shipping status

## Libraries used

- Express js - RESTful API
- JSON Web Tokens - signing/verifying jwt tokens
- Bcrypt - hashing passwords
- Cloudinary - storing images
- Drizzle - ORM for the postgres database
