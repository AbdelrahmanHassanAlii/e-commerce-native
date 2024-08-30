import { getAllOrders } from "./orders.js";
// Update sidebar content
let sideBarContent = `
    <div class="menu">
        <ul class="menu-list">
            <li>
                <a class="Side-Bar-buttons" href="/HTML/adminPages/dashboard.html" data-page="dashboard">
                    <i class="fas fa-home"></i>
                    <p>dashboard</p>
                </a>
            </li>
            <li>
                <a class="Side-Bar-buttons" href="allUser.html" data-page="users">
                    <i class="fas fa-user-group"></i>
                    <p>Users</p>
                </a>
            </li>
            <li>
                <a style="position:relative;" class="Side-Bar-buttons" href="/HTML/adminPages/orders.html" data-page="orders">
                    <i class="fa-solid fa-cube"></i>
                    <p>Orders</p>
                    <p style="position:absolute; top:4px; left:35px; display:none" class="para"><i class="fa-solid fa-circle dot"></i></p>
                </a>
            </li>
        </ul>
    </div>
`;

// Set the sidebar content
let sideBar = document.querySelector(".adminSb");
sideBar.innerHTML = sideBarContent;

// Function to set active class
function setActiveClass(target) {
  document.querySelectorAll(".Side-Bar-buttons").forEach((btn) => {
    btn.classList.remove("active");
  });
  target.classList.add("active");
}

// Add event listeners to sidebar buttons
document.querySelectorAll(".Side-Bar-buttons").forEach((button) => {
  button.addEventListener("click", function (e) {
    setActiveClass(this);
  });
});

// Check if elements exist before adding event listeners for other buttons
const showUsersBtn = document.querySelector(".showUsers");

if (showUsersBtn) {
  showUsersBtn.addEventListener("click", () => {
    window.location.href = "/HTML/adminPages/allUser.html";
  });
}

const  handleorders = async() => { 
  const data = await getAllOrders();
  console.log(data[0].products)
  if (data.map((item)=>item.productId)) { 
    const dot = document.querySelector(".para")
    dot.style.display = "block";
  }

}
handleorders();