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

// ----------------------------------------

