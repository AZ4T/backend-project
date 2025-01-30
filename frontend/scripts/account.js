if (window.location.pathname.startsWith('/account')) {
    const signUpSection = document.querySelector('.sign-up');
    const signInSection = document.querySelector('.sign-in');
    const showSignInLink = document.getElementById('show-sign-in');
    const showSignUpLink = document.getElementById('show-sign-up');

    showSignInLink.addEventListener('click', (event) => {
        event.preventDefault();
        signUpSection.style.display = 'none';
        signInSection.style.display = 'block';
    });

    showSignUpLink.addEventListener('click', (event) => {
        event.preventDefault();
        signUpSection.style.display = 'block';
        signInSection.style.display = 'none';
    });
} else {
    if (!document.cookie.includes('token')) {
        window.location.href = '/account'; // Redirect if no token is found
    }

    (async () => {
        try {
            const response = await fetch('/api/middleware/auth', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
            if(response.status === 401) {
                logout();
            }

            const result = response.json();
    
            if(!result.success) {
                throw new Error("Error during fetch auth");
            }
        }
        catch(error) {
            console.error(error);
        }
        
    })()
}


// ----------------------------------------

async function signUp(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = (email === "bolatbekov718@gmail.com") ? 'Admin' : 'User';
    const twoFactorEnabled = document.getElementById('enable2FA').checked;
    console.log(userName, email, password, role, twoFactorEnabled);
    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userName, email, password, role, twoFactorEnabled}),
        });

        const data = await response.json(); // Получить данные здесь
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || "Error during registration");
        }

        if (data.requiresOTP && data.qrCode && data.user._id) {
            // Make sure the modal is properly initialized
            if (typeof bootstrap !== 'undefined') {
                showOTPSetupModal(data.qrCode, data.user._id);
            } else {
                console.error('Bootstrap is not loaded');
                alert('Error: Required libraries not loaded');
            }
        } else {
            alert('User created successfully!');
            window.location.href = '/account';
        }

    }
    catch (error) {
        alert('Error creating user: ' + error.message);
        console.error('Error creating user:', error);
    }
}

async function signIn(event){
    event.preventDefault();

    try {
        const userName = document.getElementById('log_userName').value;
        const password = document.getElementById('log_password').value;

        const data = {
            userName,
            password,
        };

        if (!userName || !password) {
            alert('Please fill in all fields');
            return;
        }

        const response = await fetch('/api/users/signin', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        } else {
            if (result.requiresOTP) {
                // Show 2FA verification modal for login
                showLoginOTPModal(result.userId);
            } else {
                alert('Login successful!');
                window.location.href = '/about';
            } 
        }
    }
    catch (error) {
        alert('Login failed: ' + error.message);
        console.error('Login error:', error);
    };
};

async function logout() {
    try {
        // Optional: Inform the server to clear the cookie (if HttpOnly)
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error('Failed to logout on the server');
        }

        // Clear non-HttpOnly cookies (if any)
        document.cookie = 'token=; Max-Age=0; path=/;';

        // Redirect to the account page
        window.location.href = '/account';
    }
    catch(error) {
        console.error('logout error' + error);
        alert('Error during logout. Please try again.');
    }
}

function showOTPSetupModal(qrCode, userId) {

    // Remove any existing modal
    const existingModal = document.getElementById('otpSetupModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
        <div class="modal fade" id="otpSetupModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Set Up Two-Factor Authentication</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>1. Install an authenticator app like Google Authenticator or Authy</p>
                        <p>2. Scan this QR code with your app:</p>
                        <img src="${qrCode}" class="img-fluid mb-3" style="max-width: 200px;">
                        <div class="form-group">
                            <label class="form-label">3. Enter the 6-digit code from your app:</label>
                            <input type="text" class="form-control" id="otpCode" maxlength="6" pattern="[0-9]*">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="verifyOTP">Verify</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('otpSetupModal'), {
        backdrop: 'static',
        keyboard: false
    });
    
    modal.show();

    document.getElementById('verifyOTP').addEventListener('click', async () => {
        const token = document.getElementById('otpCode').value;
        if (!token || token.length !== 6) {
            alert('Please enter a valid 6-digit code');
            return;
        }
    
        try {
            const response = await fetch('/api/users/verify2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, token })
            });
    
            const data = await response.json();
            
            if (response.ok && data.success) {
                alert('2FA setup successful!');
                modal.hide();
            } else {
                alert(data.message || 'Verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    });
}

function showLoginOTPModal(userId) {
    const modalHtml = `
        <div class="modal fade" id="otpLoginModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Two-Factor Authentication</h5>
                    </div>
                    <div class="modal-body text-center">
                        <p>Enter the 6-digit code from your authenticator app:</p>
                        <input type="text" class="form-control" id="loginOtpCode" maxlength="6" pattern="[0-9]*">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="verifyLoginOTP">Verify</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('otpLoginModal'), {
        backdrop: 'static',
        keyboard: false
    });
    
    modal.show();

    document.getElementById('verifyLoginOTP').addEventListener('click', async () => {
        const token = document.getElementById('loginOtpCode').value;
        if (!token || token.length !== 6) {
            alert('Please enter a valid 6-digit code');
            return;
        }

        try {
            const response = await fetch('/api/users/verify2fa-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ userId, token })
            });

            const data = await response.json();
            if (response.ok) {
                modal.hide();
                window.location.href = '/about'
            } else {
                alert(data.message || 'Verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}