import React from 'react';

// Function to fetch data from the API
async function fetchProducts() {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
}

// Server-side data fetching function
export async function getServerSideProps() {
    const products = await fetchProducts();
    console.log("Fetched products:", products);
    return {
        props: { products },
    };
}

// Component to render the product list
const ProductListPage = ({ products }) => {
    
    return (
        <div>
            <h1>Product List</h1>
            {products.map((item) => (
                <div key={item.id}>
                    <h3>Name: {item.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default ProductListPage;
