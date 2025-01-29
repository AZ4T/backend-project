document.addEventListener("DOMContentLoaded", () => {
    async function getInfoProfile() {
        try {
            const response = await fetch('/api/users/getInfoProfile', {
                method: 'GET',
                credentials: "include",
            });
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || `fetch error during getting prof info! status: ${response.status}`);
            }
            document.getElementById("profile_username").textContent = ("Username: " + result.user.userName) || "N/A";
            document.getElementById("profile_email").textContent = ("Email: " + result.user.email) || "N/A";
            document.getElementById("profile_balance").textContent = ("Current wallet: " + result.user.balance) || "0";

        }
        catch (error) {
            console.error(error);
            alert("error during getting Info for Profile");
        }
    };
    getInfoProfile();

    const depositBtn = document.getElementById("deposit-btn"); // Button to open popup
    const popupOverlay = document.getElementById("depositPopup"); // Popup overlay
    const cancelBtn = document.querySelector(".cancel-btn"); // Cancel button inside popup
    const submitBtn = document.querySelector(".submit-btn"); // Submit button inside popup

    // Show popup when deposit button is clicked
    depositBtn.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });

    // Hide popup when cancel button is clicked
    cancelBtn.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    // Handle submit button click
    submitBtn.addEventListener("click", () => {

        const depositAmount = Number(document.getElementById('depositAmount').value.trim());

        if (depositAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        (async () => {
            try {
                const amountInput = document.getElementById('depositAmount');
                const amount = amountInput.value.trim();

                const response = await fetch('/api/users/balance', {
                    headers: {
                        "Content-Type": "application/json", // Ensure JSON Content-Type
                    },
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ amount }),
                });

                const result = await response.json();

                if(!result.success) {
                    throw new Error("Error during fetch");
                }

                document.getElementById('profile_balance').textContent = ("Current wallet: " + result.balance) || "0";
            }
            catch (error){
                console.error(error);
                alert("Error during deposit balance");
            }
        })()

        // Close the popup after submission
        popupOverlay.style.display = "none";
    });

    const saveChanges = document.getElementById('save-btn');
    saveChanges.addEventListener('click', async () => {
        try {
            const userName = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if(password !== confirmPassword) {
                alert("passwords are not equal!");
                return;
            }

            const data = {
                userName,
                password
            }

            const response = await fetch('/api/users/updateInfo', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await response.json();

            if(!result.success) {
                throw new Error("Error during updating user info");
            }

        }
        catch(error) {
            console.error(error);
        }
    });
});