const fileUpload = document.getElementById('fileUpload');

document.getElementById("requestForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const formData = new FormData(this);
/*     formData.append('files', File);
  formData.append('petition_id', petitionId); */

  const petitionData = {
    student_id: 123, 
    type: "add/remove",  
    advisor: formData.get("advisor"), 
    status: "pending", 
    content: {
      topic: formData.get("topic"), 
      date: new Date().toISOString(),  
      person_in_charge: formData.get("firstName" + "lastName"), 
      student_info: {
        name_title: formData.get("title"), 
        student_id: formData.get("student_id"), 
        year: formData.get("year"),
        major: formData.get("major"), 
      },
      location: {
        house_no: formData.get("houseNumber"), 
        village_no: formData.get("village"), 
        sub_district: formData.get("subDistrict"), 
        district: formData.get("district"), 
        province: formData.get("province"), 
        postal_code: formData.get("postal_code") 
      },
      phone_no: formData.get("phone_no"), 
      telephone_no: formData.get("telephone_no"),  
      advisor: formData.get("advisor"), 
      is_add: formData.get("is_add") === "true",  
      courses: [
        {
          course_id: formData.get("course_id"), 
          course_name: formData.get("courseName"), 
          section: formData.get("section"),  
          date: new Date().toISOString(),  
          credit: formData.get("credit"), 
          lecturer: formData.get("lecturer"), 
          approve_by: formData.get("approve_by") 
        }
      ],
      reason: formData.get("reason"),
/*         files: []  // Placeholder for file data
*/      }
  };
  // Submit data in field to the server
  const uploadResponse = await fetch('/api/petition/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: petitionData.type,
        content: petitionData
      })
  });
    
  if (uploadResponse.ok) {
      const responseData = await uploadResponse.json();      
      // Assign it to petitionId
      const petitionId = responseData.id;
      console.log('Petition submitted successfully:', responseData);
      console.log(petitionId);
      
  const fileData = new FormData();
  fileData.append('files', File);
  fileData.append('petition_id', petitionId);
  // send file to server
  const fileResponse = await fetch('/api/petition/files', {
      method: 'POST',
      body: fileData
    });
  
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      console.log('Files submitted successfully:', fileData);
    } else {
      console.error('Failed to submit files:', fileResponse);
    }
  } else {
    console.error('Failed to submit petition.');
  }


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

//ส่วนปุ่มเปลี่ยนภาษา
const languageButton = document.querySelector(".language-switch");

function switchLanguage() {// เปลี่่ยน hash ที่ url เพื่อใช้กำหนดภาษา
    if(location.hash === "#th"){
        location.hash = "en";
        location.reload();
    }else if(location.hash ==="#en"){
        location.hash = "th";
        location.reload();
    }else{
        location.hash = "en";
        location.reload();
    }
}

languageButton.addEventListener("click", switchLanguage)//เพิ่ม event ที่ปุ่มเปลี่ยนภาษาด้วย function switchlanguage()

//หลัง reload ให้เช็คค่า hash และเปลี่ยนภาษาตาม
if (location.hash) {
    if (location.hash == "#en") {
        changeRequestLang();
        changeSidebarLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changeRequestLang(language.th);
        changeSidebarLang(language.th);
        languageButton.textContent = "EN";
    }
}