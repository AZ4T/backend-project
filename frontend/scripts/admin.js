async function getUsers() {
    try {
        const response = await fetch('/api/admin/users');
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
                        <button class="action-btn change-btn" onclick="showEditForm('${user._id}', '${user.userName}', '${user.email}', '${user.role}')">Change</button>
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
            method: 'DELETE'
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

function showEditForm(userId, userName, email, role) {
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
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
                    <button type="button" onclick="closeModal()">Cancel</button>
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

function closeModal() {
    const modal = document.querySelector('.edit-modal');
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (data.success) {
            alert('User updated successfully');
            closeModal();
            getUsers(); // Refresh the table
        } else {
            alert(data.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update user');
    }
}