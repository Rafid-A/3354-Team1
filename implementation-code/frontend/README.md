# Frontend

## How to run

- cd into the frontend folder
- Open up a terminal and execute `npm i` (make sure you have node js installed)
- Start the backend server first
- Then, execute `npm run dev` to start the frontend dev server

## Pages

- `/` - home screen
- `/login` - login form
- `/signup` - signup form
- `/products` - shows all the products
- `/products/:id` - shows the details of a specific product
- `/addProduct` - form to add details of a new product
- `/cart` - shows all the products in the user's cart
- `/store/:id` - view the details of a store and all the products offered by that specific store
- `/profile` - show all the orders made by the user (the user need to be signed in) - for a vendor shows all the orders for their store

## TODO

- Improve the profile page UI
- Add support to place an order using Stripe

## Libraries used

- React js
- TailwindCSS
- ShadCN
- Axios
- React Router Dom
- Zod
- React Hook Form
- Zustand
