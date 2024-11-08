document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('requestForm');
    const fileUpload = document.getElementById('fileUpload');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted');
    });

    fileUpload.addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || 'No file chosen';
        e.target.nextElementSibling.textContent = fileName;
    });

    // Add any additional JavaScript functionality here
});