async function createFile(url, filename) {
    // const url = cloudinary.url(url, {
    //     transformation: [
    //         { format: 'pdf' }, // Convert to PDF if applicable
    //     ],
    // });

    const response = await fetch(url);
    const data = await response.blob();
    // FIX
    const metadata = {
        type: "application/pdf",
    };
    // FIX
    return new File([data], filename, metadata);
}

//function ดึงข้อมูลคำร้องด้วย uuid
async function getPetitionData(id) {
    const response = await fetch(`api/petition/${id}`);
    console.log(response);
    const petition = await response.json(); //แปลงข้อมูลที่รับมาเป็น JSON
    console.log(petition); //ใช้ test
    return petition; //return ข้อมูลของคำร้อง ประกอบไปด้วย id, type, content
}

//function ดึงข้อมูลไฟล์ของคำร้องด้วย uuid
async function getPetitionFile(id) {
    const response = await fetch(`api/files/${id}`);
    const petitionFile = await response.json(); //แปลงข้อมูลที่รับมาเป็น JSON
    console.log(petitionFile); //ใช้ test
    const public_ids = petitionFile.data.map((file) => file.public_id);
    globalThis.public_id = public_ids; //ใช้ test
    if (petitionFile.data.length === 0) return null;
    const file = await createFile(
        petitionFile.data[0].url,
        petitionFile.data[0].display_name,
    );
    return file; // return เป็น file obj
}



async function displayPetitionDataInForm() {
    //studeint
    const personInfo = document.querySelector("#student-info-id");

    //text input form
    const phoneInput = document.querySelector("#form-phone_no");
    const advisorInput = document.querySelector("#form-advisor");
    const houseNumberInput = document.querySelector("#form-houseNumber");
    const villageInput = document.querySelector("#form-village");
    const subDistrictInput = document.querySelector("#form-subDistrict");
    const districtInput = document.querySelector("#form-district");
    const provinceInput = document.querySelector("#form-province");
    const postalCodeInput = document.querySelector("#form-postal_code");
    const courseIdInput = document.querySelector("#form-course_id");
    const sectionInput = document.querySelector("#form-section");
    const courseNameInput = document.querySelector("#form-courseName");
    const topicInput = document.querySelector("#form-topic");
    const reasonTextarea = document.querySelector("#form-reason");

    //select form
    const yearSelect = document.querySelector("#form-year");
    const semesterSelect = document.querySelector("#form-semester"); //ไม่มีใน response
    const resignYearSelect = document.querySelector("#form-resign-year"); //ไม่มีใน response
    const resignSemesterSelect = document.querySelector("#form-resign-semester"); //ไม่มีใน response

    //type
    const pettitionType = document.querySelector("#petition-type");

    //checkbox form
    const addRemoveCheck = document.querySelector("#form-check-add-remove");
    const dropCheck = document.querySelector("#form-check-drop");
    const resignCheck = document.querySelector("#form-check-resign"); //ไม่มีใน response
    const otherCheck = document.querySelector("#form-check-other"); //ไม่มีใน response

    const petition = await getPetitionData(sessionStorage.getItem("checkID"));
    console.log(petition.data.content);

    const content = petition.data.content; //ใช้เฉพาะรายละเอียดของคำร้อง

    // ใส่ข้อมูลในแต่ละ input เรียงตาม content ในคำร้อง
    personInfo.textContent = `${content.person_in_charge} รหัสนักศึกษา ${content.student_info.student_id}`;

    pettitionType.textContent = petition.data.type;
    advisorInput.textContent = content.advisor;

    //courses
    courseIdInput.textContent = content.courses[0].course_id;
    sectionInput.textContent = content.courses[0].section;
    courseNameInput.textContent = content.courses[0].course_name;

    //location
    districtInput.textContent = content.location.district;
    houseNumberInput.textContent = content.location.house_no;
    postalCodeInput.textContent = content.location.postal_code;
    provinceInput.textContent = content.location.province;
    subDistrictInput.textContent = content.location.sub_district;
    villageInput.textContent = content.location.village_no;

    //student info
    yearSelect.textContent = content.student_info.year;

    phoneInput.textContent = content.phone_no;
    topicInput.textContent = content.topic;
    reasonTextarea.textContent = content.reason;

    const file = await getPetitionFile(sessionStorage.getItem("checkID"));
    displayFilename(file); //ในหน้า check เรียกใช้ครั้งเดียวเนื่องจากไม่จำเป็นต้องเพิ่มไฟล์
}
document.addEventListener("DOMContentLoaded", displayPetitionDataInForm);

/******************************************/

//function สำหรับอัพเดตชื่อไฟล์ข้างปุ่มอัพโหลดไฟล์
function displayFilename(file) {
    const fileName = document.querySelector("#file-name");
    fileName.textContent = file.name;
    console.log(window.URL.createObjectURL(file));
    fileName.href = window.URL.createObjectURL(file);
    fileName.target = "_blank";
}

/*******************************************/



/* ส่วนปุ่ม preview */
const previewButton = document.getElementById("previewFileBtn");
const previewFrame = document.getElementById("previewFrame");
const filePreview = document.getElementById("filePreview");

// const dt = new DataTransfer();


previewButton.addEventListener("click", async function () {
    const dt = new DataTransfer()
    const file = await getPetitionFile(sessionStorage.getItem("checkID"));
    dt.items.add(file);
    if (dt.files[0]) {
        if (
            file.type.includes("pdf") ||
            file.type.includes("image") ||
            file.type.includes("text")
        ) {
            const fileURL = URL.createObjectURL(dt.files[0]);
            previewFrame.src = fileURL;
            filePreview.classList.add("show");
            overlay.classList.add("show");
        } else {
            alert("This file type cannot be previewed.");
        }
    } else {
        alert("No file selected for preview.");
    }
});

closePreviewBtn.addEventListener("click", () => {
    filePreview.classList.remove("show");
    overlay.classList.remove("show");
});


