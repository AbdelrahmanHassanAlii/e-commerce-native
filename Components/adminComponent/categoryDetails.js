import { getProductsByCategory } from "../../APIsConnection/admin.js";

// Get the categoryId from the URL parameters
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

// Select elements from the DOM
let categoryDetails = document.querySelector(".admin-category-details-page");
const editProductContainer = document.querySelector(
  ".admin-product-form-container"
);

if (!categoryDetails) {
  console.error("Category details container not found in the DOM.");
}

if (!editProductContainer) {
  console.error("Edit product container not found in the DOM.");
}

// Function to display products by category
const viewProducts = async (categoryId) => {
  try {
    let products = await getProductsByCategory(categoryId);

    // Generate HTML content for the products
    categoryDetails.innerHTML = `
      ${products
        .map(
          (product) => `
          <div class="product-card" data-product-id="${product.id}">
            <div class="productBtns">
              <button class="delete-product">X</button>
              <button class="edit-product"><i class="fa-solid fa-pencil"></i></button>
            </div>
            <img src="${product.image}" alt="${product.name}" /><br/>
            <div class="productDetails">
              <h1>${product.name}</h1>
              <p>Price: $${product.price}</p>
              <p>Stock: ${product.stock} available</p>
            </div>
            <p>${product.description}</p><br/>
          </div>`
        )
        .join("")}
    `;

    attachEventListenersToProducts(); // Attach event listeners to buttons after products are rendered
  } catch (error) {
    console.error("Error fetching products:", error);
    categoryDetails.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
};

// Function to attach event listeners to product buttons
const attachEventListenersToProducts = () => {
  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button
        .closest(".product-card")
        .getAttribute("data-product-id");
      await deleteProduct(productId);
      viewProducts(categoryId); // Refresh the product list after deletion
    });
  });

  document.querySelectorAll(".edit-product").forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button
        .closest(".product-card")
        .getAttribute("data-product-id");
      showEditProductForm(productId);
    });
  });
};

// Function to show the edit product form
const showEditProductForm = async (productId) => {
  editProductContainer.style.display = "flex";
  editProductContainer.style.opacity = "1";

  try {
    const response = await axios.get(
      `http://localhost:4000/products/${productId}`
    );
    const product = response.data;

    // Populate the edit product form with product data
    editProductContainer.innerHTML = `
  <form id="edit-product-form">
    <h2>Edit Product: ${product.name}</h2>
    <div class="edit-product-close-container">
      <button type="button" class="edit-product-close">X</button>
    </div>
    
    <div class="form-group">
      <label for="edit-product-name">Product Name:</label>
      <input type="text" id="edit-product-name" value="${
        product.name
      }" required>
    </div>
    
    <div class="form-group">
      <label for="edit-product-description">Product Description:</label>
      <textarea id="edit-product-description" required>${
        product.description
      }</textarea>
    </div>
    
    <div class="form-group">
      <label for="edit-product-price">Product Price:</label>
      <input type="text" id="edit-product-price" value="${
        product.price
      }" required>
    </div>
    
    <div class="form-group">
      <label for="edit-product-image">Product Image:</label>
      <input type="text" id="edit-product-image" value="${
        product.image
      }" required>
    </div>
    
    <div class="form-group">
      <label for="edit-product-discount">Product Discount:</label>
      <input type="number" id="edit-product-discount" value="${
        product.discount
      }">
    </div>
    
    <div class="form-group">
      <label for="edit-product-availability">Product Availability:</label>
      <input type="checkbox" id="edit-product-availability" ${
        product.availability ? "checked" : ""
      }>
    </div>
    
    <div class="form-group">
      <label for="edit-product-brandname">Product Brand Name:</label>
      <input type="text" id="edit-product-brandname" value="${
        product.brandname
      }" required>
    </div>
    
    <div class="form-group">
      <label for="edit-product-stock">Product Stock:</label>
      <input type="number" id="edit-product-stock" value="${
        product.stock
      }" required>
    </div>
    
    <div class="form-group">
      <label for="edit-product-rating">Product Rating:</label>
      <input type="number" id="edit-product-rating" value="${
        product.rating
      }" required>
    </div>
    
    <button type="submit">Save Changes</button>
  </form>
`;

    // Add event listener for form submission
    document
      .getElementById("edit-product-form")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedProduct = {
          id: productId,
          name: document.getElementById("edit-product-name").value,
          description: document.getElementById("edit-product-description")
            .value,
          price: document.getElementById("edit-product-price").value,
          image: document.getElementById("edit-product-image").value,
          discount: document.getElementById("edit-product-discount").value,
          availability: document.getElementById("edit-product-availability")
            .checked,
          brandname: document.getElementById("edit-product-brandname").value,
          categoryId: product.categoryId,
          stock: document.getElementById("edit-product-stock").value,
          rating: document.getElementById("edit-product-rating").value,
          reviews: product.reviews,
        };

        try {
          const response = await axios.put(
            `http://localhost:4000/products/${productId}`,
            updatedProduct
          );
          console.log("Product updated:", response.data);
          window.location.href = `categoryDetails.html?id=${product.categoryId}`; // Redirect to category details page
        } catch (error) {
          console.error("Error updating product:", error);
        }
      });
    document
      .querySelector(".edit-product-close")
      .addEventListener("click", () => {
        document.querySelector(".admin-product-form-container").style.display =
          "none";
        editProductContainer.innerHTML = ""; // Clear form content
      });
  } catch (error) {
    console.error(`Error retrieving product with id ${productId}:`, error);
    editProductContainer.innerHTML = `<p>Error retrieving product. Please try again later.</p>`;
  }
};

// Function to delete a product
const deleteProduct = async (productId) => {
  try {
    await axios.delete(`http://localhost:4000/products/${productId}`);
    console.log(`Product with id ${productId} deleted.`);
  } catch (error) {
    console.error(`Error deleting product with id ${productId}:`, error);
  }
};

// Initialize the product view
viewProducts(categoryId);
