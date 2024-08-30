import { getProductsByIds } from "../../APIsConnection/user.js";

let CartContainer = document.querySelector(".user-cart");

let user = JSON.parse(localStorage.getItem("user"));
let userID = "";
if (user) {
  userID = user.id;
}

let cartList = JSON.parse(localStorage.getItem("cart")) || [];
let cartIDs = cartList[userID] || [];

const response = async () => {
  try {
    const response = await axios.get("http://localhost:4000/orders");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
response();

export const renderCartList = () => {
  const products = getProductsByIds(cartIDs);
  products.then((products) => {
    CartContainer.innerHTML = "";
    products.forEach((product) => {
      CartContainer.innerHTML += `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-details">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button class="remove-from-cart" data-product-id="${product.id}">Remove</button>
          </div>
        </div>
      `;
    });

    document.querySelectorAll(".remove-from-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-product-id");
        removeFromCartList(productId);
        showNotification("Removed from cart");
      });
    });
  });
};

// Function to remove product from the wishlist
const removeFromCartList = (productId) => {
  let cartList = JSON.parse(localStorage.getItem("cart")) || {};

  if (cartList[userID]) {
    const index = cartList[userID].indexOf(productId);
    if (index > -1) {
      cartList[userID].splice(index, 1);
    }

    if (cartList[userID].length === 0) {
      delete cartList[userID];
    }

    localStorage.setItem("cart", JSON.stringify(cartList));
    renderCartList();
  }
};

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.classList.add("show");

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

const placeOrder = document.querySelector(".placeOrderBtn");

if (!cartIDs || cartIDs.length === 0) {
  placeOrder.style.display = "none";
}

placeOrder.addEventListener("click", () => {
  document.querySelector(".formContainer").innerHTML = `
 <form id="paypalForm" action="https://www.paypal.com/cgi-bin/webscr" method="post">
      <!-- Saved buttons use the "secure click" command -->
      <input
        class="phone"
        type="text"
        name="phone"
        placeholder="Enter Phone Number"
        required
      />
      <input
        class="cardNumber"
        type="text"
        name="cardNumber"
        placeholder="Enter Card Number"
        required
      />
      <input
        class="cvv"
        type="text"
        name="cvv"
        placeholder="Enter Cvv"
        maxlength="3"
        required
      />
      <input
        class="submit"
        type="image"
        name="submit"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif"
        alt="PayPal - The safer, easier way to pay online"
      />
      <input type = "text"
      name = "address"
      placeholder="Enter your address"
      required
      <img
        alt=""
        width="1"
        height="1"
        src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
      />
    </form>
  `;
  document.querySelector(".formContainer").style.display = "block";
});

// Handle form submission
document
.querySelector(".formContainer")
.addEventListener("submit", function (e) {
  e.preventDefault();
  
  // window.location.href("/HTML/userPages/pastOrders.html")
    // Collect order data
    const order = {
      userId: userID,
      products: cartIDs.map((id) => ({ productId: id })),
    };

    // Send order to the server
    sendOrderToServer(order);

    // Clear cart
    cartList = JSON.parse(localStorage.getItem("cart")) || {};
    if (cartList[userID]) {
      delete cartList[userID];
      localStorage.setItem("cart", JSON.stringify(cartList));
    }
    // Display success notification
    showNotification("Order placed successfully!");

    // Update user data in usersInfo array
    const usersInfo = JSON.parse(localStorage.getItem("usersInfo")) || [];
    const updatedUser = {
      userId: userID,
      phone: document.querySelector(".phone").value,
      cardNumber: document.querySelector(".cardNumber").value,
      cvv: document.querySelector(".cvv").value,
    };

    // Update or add the user info
    const userIndex = usersInfo.findIndex((user) => user.userId === userID);
    if (userIndex > -1) {
      usersInfo[userIndex] = updatedUser;
    } else {
      usersInfo.push(updatedUser);
    }

    localStorage.setItem("usersInfo", JSON.stringify(usersInfo));
  });

const sendOrderToServer = (order) => {
  fetch("http://localhost:4000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Order placed successfully:", data);
    })
    .catch((error) => {
      console.error("Error placing order:", error);
    });
};

window.onload = () => {
  renderCartList();
};
