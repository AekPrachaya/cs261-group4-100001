const form = document.getElementById('requestForm');
    const fileUpload = document.getElementById('fileUpload');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted');
    });

    fileUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        const allowedTypes = ['application/pdf', 'image/png'];
        
        // ตรวจสอบจำนวนไฟล์
        if (files.length > 5) {
            alert('กรุณาอัปโหลดไม่เกิน 5 ไฟล์');
            e.target.value = '';  // รีการเลือกไฟล์
            e.target.nextElementSibling.textContent = 'No file chosen';
            return;
        }
        
        // ตรวจสอบชนิดไฟล์
        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert('กรุณาเลือกไฟล์ PDF หรือ PNG เท่านั้น');
                e.target.value = '';  // รีการเลือกไฟล์
                e.target.nextElementSibling.textContent = 'No file chosen';
                return;
            }
        }

        // แสดงชื่อไฟล์ทั้งหมด
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        e.target.nextElementSibling.textContent = fileNames;
    });