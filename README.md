# Ecommerce Book Store Application
Welcome to the Ecommerce Book Store Application. You can access the live demo of the project [here](https://biblioboutique.jisonline.site/).
![Image Alt Text]([https://miro.medium.com/v2/resize:fit:1400/1*C8gWRnGYKl8E6K1qePqVXg.jpeg](https://drive.google.com/drive/u/0/folders/168WEbBB4q2gBt7TCgWAgri68fNcxqI_d))

### Deployment Details

This project is deployed on AWS and configured with Nginx for serving web pages. HTTPS has been integrated to ensure secure communication with users.

- **Hosting Platform**: AWS (Amazon Web Services)
- **Web Server**: Nginx
- **HTTPS**: Configured and enforced for secure connections.


## Introduction
Welcome to the Ecommerce Book Store Application, an online platform for purchasing books. This project is developed using MongoDB, Express, and Node.js, with integration of Razorpay for payment processing. The application includes an admin dashboard for managing users, products, offers, and coupons.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Features
- **Admin Dashboard**: Manage users, products, offers, and coupons.
- **Product Search**: Users can search for products based on price, author, and other criteria.
- **User Purchases**: Seamless purchasing process with integrated Razorpay payment gateway.
- **Offer and Coupon Management**: Admin can create and manage offers and discount coupons.

## Installation
1. Clone the repository:
   
   ```sh
   git clone https://github.com/yourusername/ecommerce-book-store.git\
   
3. Navigate to the project directory:
   ```sh
   cd ecommerce-book-store
   
4. Install the dependencies:
   ```sh
   npm install

## Usage
1. Start the server:
   
   ```sh
   npm start

3. Open your browser and navigate to 'http://localhost:3000' to access the application.

## Dependencies
 - **MongoDB**: NoSQL database for storing application data.
 - **Express**: Web framework for Node.js.
 - **Node.js**: JavaScript runtime for server-side development.
 - **Razorpay**: Payment gateway for handling transactions.

 ## Installation
1. Create a .env file in the root directory and add your configuration variables:

    ```sh
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-book-store
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    
2. Ensure MongoDB is running on your system or configure the MONGODB_URI to point to your MongoDB server.

## Documentation

- [MongoDB Documentation](https://www.mongodb.com/docs)
- [Express Documentation](https://expressjs.com)
- [Node.js Documentation](https://nodejs.org)
- [Razorpay Documentation](https://razorpay.com/payment-gateway)

## Examples
Here are some example commands and how to use the application:

- **Adding a Product**:
Admin can log in to the dashboard and navigate to the product management section to add new books.
- **Searching for a Product**:
Users can use the search bar on the homepage to filter books by price, author, or other criteria.
- **Making a Purchase**:
Users can add books to their cart and proceed to checkout, where they can complete the payment using Razorpay.

## Troubleshooting

- **Common Issues**:
Ensure MongoDB is running and accessible.
Check the configuration in the .env file.
Verify that all dependencies are installed correctly.
- **Tips**:
Use the logs to debug any issues by checking the server output.

## Contributors
- [Jishnu Anil](https://github.com/jishnuanilDev)






   

















 

