import { getAllCategories } from "./../../APIsConnection/user.js";

let categoriesContainer = document.querySelector(".user-categories-container");

const displayCategories = async () => {
  try {
    let categories = await getAllCategories();

    categoriesContainer.innerHTML = `
      ${categories
        .map(
          (category) => `
          <div class="category-card">
              <img src="../../IMAGES/${category.image}" alt="${category.name}">
              <div class="category-card-content">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <button class="category-card-button" onclick="viewProducts(${category.id})">View Products</button>
              </div>
          </div>
      `
        )
        .join("")}
    `;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Define viewProducts function in the global scope
window.viewProducts = (categoryId) => {
  window.location.href = `categoryDetails.html?id=${categoryId}`;
};

displayCategories();
