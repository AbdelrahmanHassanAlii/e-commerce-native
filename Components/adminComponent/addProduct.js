import { getProductsByCategory } from "../../APIsConnection/admin.js";

let addProduct = document.querySelector(".admin-product-form");
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

const addProducts = async (categoryId) => {
  
  try {
    let products = await getProductsByCategory(categoryId);

    addProduct.innerHTML = `
  <form id="product-form">
    <h2 class="add-product-title"></h2>
    <div class="add-product-close-container">
      <button type="button" class="add-product-close">X</button>
    </div>
    
    <div class="form-group">
      <label for="product-id">Product ID:</label><br/>
      <input type="text" id="product-id" required>
    </div>
    
    <div class="form-group">
      <label for="product-name">Product Name:</label><br/>
      <input type="text" id="product-name" required>
    </div>
    
    <div class="form-group">
      <label for="product-description">Product Description:</label><br/>
      <textarea id="product-description" required></textarea>
    </div>
    
    <div class="form-group">
      <label for="product-price">Product Price:</label><br/>
      <input type="text" id="product-price" required>
    </div>
    
    <div class="form-group">
      <label for="product-image">Product Image:</label><br/>
      <input type="text" id="product-image" required>
    </div>
    
    <div class="form-group">
      <label for="product-discount">Product Discount:</label><br/>
      <input type="number" id="product-discount">
    </div>
    
    <div class="form-group">
      <label for="product-brandname">Product Brand Name:</label><br/>
      <input type="text" id="product-brandname" required>
    </div>
    
    
    <div class="form-group">
      <label for="product-stock">Product Stock:</label><br/>
      <input type="number" id="product-stock" required>
    </div>
    
    <div class="form-group">
      <label for="product-rating">Product Rating:</label><br/>
      <input type="number" id="product-rating" required>
    </div>
    
    <div class="form-group">
      <label for="product-availability">Product Availability:</label><br/>
      <input type="checkbox" id="product-availability">
    </div>
    
    <button type="submit">Add Product</button>
  </form>
`;

    document
      .getElementById("product-form")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const product = {
          id: document.getElementById("product-id").value,
          name: document.getElementById("product-name").value,
          description: document.getElementById("product-description").value,
          price: document.getElementById("product-price").value,
          image: document.getElementById("product-image").value,
          discount: document.getElementById("product-discount").value,
          availability: document.getElementById("product-availability").checked,
          brandname: document.getElementById("product-brandname").value,
          categoryId: document.getElementById("product-categoryId").value,
          stock: document.getElementById("product-stock").value,
          rating: document.getElementById("product-rating").value,
          reviews: [],
        };

        try {
          const response = await axios.post(
            "http://localhost:4000/products",
            product
          );

          console.log("Product added:", response.data);

          window.location.href = `categoryDetails.html?id=${categoryId}`;
        } catch (error) {
          console.error("Error adding product:", error);
        }
      });
    document
      .querySelector(".add-product-close")
      .addEventListener("click", () => {
        document.querySelector(".admin-product-form").style.display = "none";
      });
  } catch (error) {
    console.error("Error fetching products:", error);
    addProduct.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
};

addProducts(categoryId);
