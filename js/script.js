// Get elements
const signUpSection = document.querySelector('.sign-up');
const signInSection = document.querySelector('.sign-in');
const showSignInLink = document.getElementById('show-sign-in');
const showSignUpLink = document.getElementById('show-sign-up');

// Event listener to show sign-in section
showSignInLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    signUpSection.style.display = 'none';
    signInSection.style.display = 'block';
});

// Event listener to show sign-up section
showSignUpLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    signUpSection.style.display = 'block';
    signInSection.style.display = 'none';
});