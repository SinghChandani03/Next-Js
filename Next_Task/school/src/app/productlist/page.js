import React from 'react';

// Function to fetch data
async function productList() {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    return data.products;
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps() {
    const products = await productList();
    return {
        props: { products },
    };
}

const ProductListPage = ({ products }) => {
    return (
        <div>
            <h1>Product List</h1>
            {
                products.map((item) => (
                    <div key={item.id}>
                        <h3>Name: {item.title}</h3>
                    </div>
                ))
            }
        </div>
    );
};

export default ProductListPage;
