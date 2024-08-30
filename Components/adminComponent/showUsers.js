// Get all users
const getAllUsers = async () => {
  const response = await axios.get("http://localhost:4000/users");
  return response.data;
};

// Get all admins
const getAllAdmins = async () => {
  const response = await axios.get("http://localhost:4000/admins");
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  try {
    await axios.delete(`http://localhost:4000/users/${userId}`);
    await displayUsers(); // Update the display after deletion
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Delete admin
const deleteAdmin = async (adminId) => {
  try {
    await axios.delete(`http://localhost:4000/admins/${adminId}`);
    await displayUsers(); // Update the display after deletion
  } catch (error) {
    console.error("Error deleting admin:", error);
  }
};

// Remove admin role (convert back to user)
const removeAdmin = async (adminId) => {
  try {
    const adminData = await axios.get(
      `http://localhost:4000/admins/${adminId}`
    );
    const { username, email, password } = adminData.data;

    await axios.post("http://localhost:4000/users", {
      username,
      email,
      password,
      role: 1, // Assuming role 1 is for regular users
    });

    await deleteAdmin(adminId); // Delete from the admins table
    await displayUsers(); // Update the display after role change
  } catch (error) {
    console.error("Error removing admin role:", error);
  }
};

// Make user admin
const makeAdmin = async (userId) => {
  try {
    const userData = await axios.get(`http://localhost:4000/users/${userId}`);
    const { username, email, password } = userData.data;

    await axios.post("http://localhost:4000/admins", {
      username,
      email,
      password,
      role: 0, // Assuming role 0 is for admins
    });

    await deleteUser(userId); // Delete from the users table
    await displayUsers(); // Update the display after role change
  } catch (error) {
    console.error("Error updating user role:", error);
  }
};

// Function to display users and admins
const displayUsers = async (searchTerm = "") => {
  const users = await getAllUsers();
  const admins = await getAllAdmins();

  console.log("Users:", users); // تحقق من البيانات
  console.log("Admins:", admins); // تحقق من البيانات

  let filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  let filteredAdmins = admins.filter((admin) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let userRows = filteredUsers
    .map(
      (user) => `
      <div class="headers">
      <span class="name">${user.username}</span>
        <span class="info">${user.id}</span>
        <span class="info">${user.email}</span>  
        <span class="info">${user.role}</span>
        <div class="buttons">
        <div class="tooltip">
        <button class="delete-user" data-id="${user.id}"><i class="fa-solid fa-user-xmark"></i></button>
        <span class="tooltiptext">Remove account</span>
        </div>
        <button class="make-admin" data-id="${user.id}"><i class="fa-solid fa-user-tie"></i> Make Admin</button>
       </div>
      </div>
      <br/>
      <hr/>
      <br/>
     `
    )
    .join("");

  let adminRows = filteredAdmins
    .map(
      (admin) => `
      <div  class="headers">
      <span class="name">${admin.username}</span>
        <span class="info">${admin.id}</span>
        <span class="info">${admin.email}</span>
        <span class="info">${admin.role}</span>
        <div class="buttons">
        <div class="tooltip">
        <button class="delete-admin" data-id="${admin.id}"><i class="fa-solid fa-user-xmark"></i></button>
         <span class="tooltiptext">Remove account</span>
         </div>
        <button class="remove-admin" data-id="${admin.id}"><i class="fa-solid fa-user-minus"></i> Remove Admin</button>
        </div>
      </div>
      <br/>
      <hr/>
      <br/>
    `
    )
    .join("");

  document.querySelector(".usersInfo").innerHTML = userRows;
  document.querySelector(".adminsInfo").innerHTML = adminRows;

  attachEventListeners(); // Attach event listeners again after rendering
};

// Event listeners for buttons (delete/make admin/remove admin)
const attachEventListeners = () => {
  document.querySelectorAll(".delete-user").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.closest("button").getAttribute("data-id");
      await deleteUser(userId);
    });
  });

  document.querySelectorAll(".make-admin").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.closest("button").getAttribute("data-id");
      await makeAdmin(userId);
    });
  });

  document.querySelectorAll(".delete-admin").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const adminId = event.target.closest("button").getAttribute("data-id");
      await deleteAdmin(adminId);
    });
  });

  document.querySelectorAll(".remove-admin").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const adminId = event.target.closest("button").getAttribute("data-id");
      await removeAdmin(adminId);
    });
  });

  // Add new member functionality
  const addMemberButton = document.querySelector(".addmember");
  addMemberButton.addEventListener("click", () => {
    const username = prompt("Enter username:");
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");

    addUser(username, email, password);
  });
};

// Add new user to the database
const addUser = async (username, email, password) => {
  try {
    await axios.post("http://localhost:4000/users", {
      username,
      email,
      password,
      role: 1, // Assuming role 1 is for regular users
    });
    displayUsers();
  } catch (error) {}
};

// Handle the search input
const searchHandler = (event) => {
  const searchTerm = event.target.value;
  displayUsers(searchTerm); // Filter users/admins based on search term
};

// Content for users and admins table
export let content = `
<div class="container">
<div class="content">
<h1 class="members">MEMBERS.</h1>
<div style="display:flex; align-items:center ;height:40px;gap:10px">
<input class="search" id="searchInput" type="search" placeholder="search ..." />
<button class="addmember">add member</button>
</div>
</div>
<hr>
<h3><i class="fa-brands fa-black-tie"></i> ADMINS</h3>
<div class="adminsInfo"></div>
<hr>
<h3><i class="fa-solid fa-users"></i> USERS</h3>
<div class="usersInfo"></div>
</div>
`;

let usersContainer = document.querySelector(".admin-user-container");
if (usersContainer) {
  usersContainer.innerHTML = content; // Load table structure
  await displayUsers(); // Populate with all data initially
  document
    .getElementById("searchInput")
    .addEventListener("input", searchHandler); // Add search event
} else {
  console.error("Element with class 'admin-user-container' not found.");
}
