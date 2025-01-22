const signUpSection = document.querySelector('.sign-up');
const signInSection = document.querySelector('.sign-in');
const showSignInLink = document.getElementById('show-sign-in');
const showSignUpLink = document.getElementById('show-sign-up');

if (showSignInLink) {
    showSignInLink.addEventListener('click', (event) => {
        event.preventDefault();
        signUpSection.style.display = 'none';
        signInSection.style.display = 'block';
    });
}

if (showSignUpLink) {
    showSignUpLink.addEventListener('click', (event) => {
        event.preventDefault();
        signUpSection.style.display = 'block';
        signInSection.style.display = 'none';
    });
}

// ----------------------------------------

async function signUp(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = (email === "bolatbekov718@gmail.com") ? 'Admin' : 'User';

    const data = {
        userName,
        email,
        password,
        role,
    };

    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('Response status:', response.status); // Debug log

        if(!response.ok) {
            throw new Error("fetch failed");
        }
        alert('User created successfully!');
        window.location.href = '/account';
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        // Store the token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        alert('Login successful!');

        window.location.href = '/about';
    }
    catch (error) {
        alert('Login failed: ' + error.message);
        console.error('Login error:', error);
    };
};

async function logout() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to account page
        window.location.href = '/account';
    }
    catch(err) {
        console.err('logout error' + err);
        alert('Error during logout. Please try again.');
    }
}

