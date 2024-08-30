import { getProductsByIds } from "../../APIsConnection/admin.js";

let ordersContainer = document.querySelector(".admin-cart");

export const getAllOrders = async () => {
  try {
    const response = await fetch("http://localhost:4000/orders");
    const orders = await response.json();
    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    const updatedOrder = await response.json();
    console.log("Order updated:", updatedOrder);
    // Re-render the orders list after updating
    renderOrdersList();
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

export const renderOrdersList = async () => {
  const orders = await getAllOrders();

  if (orders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders available.</p>";
    return;
  }

  ordersContainer.innerHTML = "";

  const ordersByUser = {};

  orders.forEach((order) => {
    if (!ordersByUser[order.userId]) {
      ordersByUser[order.userId] = [];
    }
    ordersByUser[order.userId].push(order);
  });

  for (const userId in ordersByUser) {
    const userOrders = ordersByUser[userId];

    let orderHTML = `
      <div class="product-card">
        <h3>Orders for User ID: ${userId}</h3>
        <div class="products">
    `;

    for (const order of userOrders) {
      const products = await getProductsByIds(
        order.products.map((p) => p.productId)
      );

      orderHTML += products
        .map(
          (product) => `
            <div class="product-details">
              <img src="${product.image}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <p class="description">${product.description}</p>
              <p class="price">Price: $${product.price}</p>
              <button class="accept-order" data-order-id="${order.id}">Accept</button>
              <button class="reject-order" data-order-id="${order.id}">Reject</button>
            </div>
            <hr>
          `
        )
        .join("");
    }

    orderHTML += `
        </div>
      </div>
    `;

    ordersContainer.innerHTML += orderHTML;
  }

  // Add event listeners for accept and reject buttons
  document.querySelectorAll(".accept-order").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.getAttribute("data-order-id");
      updateOrderStatus(orderId, "accepted");
      
    });
  });

  document.querySelectorAll(".reject-order").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.getAttribute("data-order-id");
      updateOrderStatus(orderId, "rejected");
    });
  });
};

window.onload = () => {
  renderOrdersList();
};
