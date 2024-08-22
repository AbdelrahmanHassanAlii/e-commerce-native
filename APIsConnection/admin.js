//function to get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:4000/categories");
    console.log(response.data);
    const lastElement = response.data. slice(-1)[0] 
    console.log(`last category ID is : ${lastElement.id}`)
    console.log("test");
    return response.data;
  } catch (error) {
    console.error("Error in getAllCategories function", error);
    return [];
  }
};

// Function to get all products and categories, then filter products by category
export const getProductsByCategory = async (categoryId) => {
  try {
    // Fetch all products and categories
    const [productsResponse, categoriesResponse] = await Promise.all([
      axios.get("http://localhost:4000/products"),
      axios.get("http://localhost:4000/categories"),
    ]);

    const products = productsResponse.data;
    const categories = categoriesResponse.data;

    const category = categories.find((cat) => cat.id === categoryId);

    if (!category) {
      console.error(`Category with id ${categoryId} not found.`);
      return [];
    }

    // Filter products by categoryId
    const filteredProducts = products.filter(
      (product) => product.categoryId === categoryId
    );

    return filteredProducts;
  } catch (error) {
    console.error("Error in getProductsByCategory function", error);
    return [];
  }
};
