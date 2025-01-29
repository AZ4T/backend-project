document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/admin/auction', {
            credentials: "include",
        });

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            const auctionTableBody = document.getElementById('auctionTableBody');
            auctionTableBody.innerHTML = '';
            
            const date = new Date();
            date.setDate(date.getDate() + 5);
            date.setHours(12, 0, 0, 0); // Set to 12:00 noon
            const formattedDate = date.toDateString();

            data.lots.forEach(lot => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${lot._id}</td>
                    <td>${lot.title}</td>
                    <td>${lot.price}</td>
                    <td>${formattedDate} 12:00</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteLot('${lot._id}')">Delete</button>
                    </td>
                `;

                auctionTableBody.appendChild(tr);
            });
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('Failed to load auction');
    }
});




async function getUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = '';

            data.users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="action-btn change-btn" onclick="showEditFormUser('${user._id}', '${user.userName}', '${user.email}', '${user.role}')">Change</button>
                        <button class="action-btn delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;

                usersTableBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load users');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: "include",
        });

        const data = await response.json();
        if (data.success) {
            alert('User deleted successfully');
            getUsers(); // Refresh the table
        } else {
            alert(data.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete user');
    }
}

function showEditFormUser(userId, userName, email, role) {
    closeModalUser();
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'edit-modal-user';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit User</h2>
            <form id="editUserForm">
                <div class="form-group">
                    <label for="userName">Username:</label>
                    <input type="text" id="userName" value="${userName}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" id="email" value="${email}" required>
                </div>
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select id="role">
                        <option value="User" ${role === 'User' ? 'selected' : ''}>User</option>
                        <option value="Admin" ${role === 'Admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onclick="closeModalUser()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Add form submit handler
    document.getElementById('editUserForm').onsubmit = async (e) => {
        e.preventDefault();
        await updateUser(userId);
    };
}

function closeModalUser() {
    const modal = document.querySelector('.edit-modal-user');
    if (modal) {
        modal.remove();
    }
}

async function updateUser(userId) {
    const userData = {
        userName: document.getElementById('userName').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (data.success) {
            alert('User updated successfully');
            closeModalUser();
            getUsers(); // Refresh the table
        } else {
            alert(data.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update user');
    }
}

async function getLots() {
    try {
        const response = await fetch('/api/admin/lots', {
            credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
            const lotsTableBody = document.getElementById('lotsTableBody');
            lotsTableBody.innerHTML = '';
            
            data.lots.forEach(lot => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${lot._id}</td>
                    <td>${lot.category}</td>
                    <td>${lot.title}</td>
                    <td>${lot.description}</td>
                    <td>${lot.price}</td>
                    <td>${lot.photo}</td>
                    <td>${lot.billOption}</td>
                    <td>${lot.information}</td>
                    <td>
                        <button class="action-btn change-btn" onclick="showEditFormLot('${lot._id}', '${lot.category}', '${lot.title}', '${lot.description}', '${lot.price}', '${lot.photo}', '${lot.billOption}', '${lot.information}')">Change</button>
                        <button class="action-btn delete-btn" onclick="deleteLot('${lot._id}')">Delete</button>
                    </td>
                `;

                lotsTableBody.appendChild(tr);
            });
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('Failed to load lots');
    }
}

async function deleteLot(lotId) {
    if (!confirm('Are you sure you want to delete this lot?')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/lots/${lotId}`, {
            method: 'DELETE',
            credentials: "include",
        });

        const data = await response.json();
        if (data.success) {
            alert('User deleted successfully');
            getLots(); // Refresh the table
        } else {
            alert(data.message || 'Failed to delete lot');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete lot');
    }
}

async function updateLot(lotId) {
    const lotData = {
        category: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        photo: document.getElementById('photo').value,
        billOption: document.getElementById('billOption').value,
        information: document.getElementById('information').value
    };

    try {
        const response = await fetch(`/api/admin/lots/${lotId}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lotData)
        });

        const data = await response.json();
        if (data.success) {
            alert('Lot updated successfully');
            closeModalLot();
            getLots(); // Refresh the table
        } else {
            alert(data.message || 'Failed to update lot');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update lot');
    }
}

function showEditFormLot(lotId, category, title, description, price, photo, billOption, information) {

    closeModalLot();

    const modal = document.createElement('div');
    modal.className = 'edit-modal-lot';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit Lot</h2>
            <form id="editLotForm">
                <div class="form-group">
                    <label for="category">Category:</label>
                    <input type="text" id="category" value="${category}" required>
                </div>
                <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" id="title" value="${title}" required>
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <input type="text" id="description" value="${description}" required>
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="text" id="price" value="${price}" required>
                </div>
                <div class="form-group">
                    <label for="photo">Photo:</label>
                    <input type="text" id="photo" value="${photo}" required>
                </div>
                <div class="form-group">
                    <label for="billOption">Bill Option:</label>
                    <select id="billOption">
                        <option value="Kaspi" ${billOption === 'Kaspi' ? 'selected' : ''}>Kaspi</option>
                        <option value="Halyk" ${billOption === 'Halyk' ? 'selected' : ''}>Halyk</option>
                        <option value="Crypto" ${billOption === 'Crypto' ? 'selected' : ''}>Crypto</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="information">Information:</label>
                    <input type="text" id="information" value="${information}" required>
                </div>
                <div class="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onclick="closeModalLot()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Add form submit handler
    document.getElementById('editLotForm').onsubmit = async (e) => {
        e.preventDefault();
        await updateLot(lotId);
    };
}

function closeModalLot() {
    const modal = document.querySelector('.edit-modal-lot');
    if (modal) {
        modal.remove();
    }
}