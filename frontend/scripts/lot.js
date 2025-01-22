document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', sendLot); // Pass the function as the callback
});

async function sendLot(event) {
    event.preventDefault();

    const category = document.getElementById('product-category').value;
    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-info').value;
    const price = document.getElementById('product-price').value;
    const photo = document.getElementById('product-photo').files[0];
    const billOption = document.getElementById('bill').value;
    const information = document.getElementById('information').value;

    const formData = new FormData();
    formData.append('photo', photo); // 'photo' must match field name expected by Multer
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('billOption', billOption);
    formData.append('information', information);

    console.log("form data created")

    try {
        const response = await fetch('/api/lot/sendlot', {
            method: 'POST',
            body: formData,
        });

        console.log('Response status:', response.status); // Debug log

        if(!response.ok) {
            throw new Error("fetch failed");
        }
        alert('Lot created successfully!');
        window.location.href = '/lot';
    }
    catch (error) {
        alert('Error creating lot: ' + error.message);
        console.error('Error creating lot:', error);
    }
}