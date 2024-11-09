// import { language } from "./language";

function changeLoginLang(lang = language.en){ //เปลี่ยนภาษาหน้า login
    const loginInfo = document.querySelector(".login-info");
    const loginHeader= document.querySelector(".login-form").children[1];

    loginInfo.children[0].textContent = lang.login.welcome.header;
    loginInfo.children[1].textContent = lang.login.welcome.paragrraph;

    loginHeader.textContent = lang.login.form.header;
}

function changeSidebarLang(lang = language.en){ //เปลี่ยนภาษาหน้า sidebar
    const sidebarHeader = document.querySelector(".logo-text");
    const navLink = document.querySelectorAll(".nav-links")[1].children;

    sidebarHeader.textContent = lang.sidebar.header;
    for(let i=0; i<navLink.length; i++){
        navLink[i].children[0].textContent = Object.values(lang.sidebar.link)[i];
    }
}

function changeRequestLang(lang = language.en){ //เปลี่ยนภาษาหน้า request
    const langF = lang.request.form;

    const header = document.querySelector(".form-header h1");
    const formPersonalInfo = document.querySelectorAll(".form-section")[0];
    const formPersonalInfoHeader = formPersonalInfo.children[0];
    const formPersonalinfoFirstName = formPersonalInfo.childNodes[3].childNodes[3].childNodes[1];
    const formPersonalinfoLastname = formPersonalInfo.childNodes[3].childNodes[5].childNodes[1];
    const formStudentId = formPersonalInfo.childNodes[5].childNodes[5].children[0];
    const formPersonalInfoPhone = formPersonalInfo.childNodes[7].childNodes[1].children[0];

    const formSelect = document.querySelectorAll(".form-group select");

    header.textContent = langF.personalInfo.header; //เปลี่ยนภาษาส่วนหัวข้อ
    //personal information section
    formPersonalInfoHeader.textContent = langF.personalInfo.header;
    for(let i=0; i<formSelect[0].length; i++){ // เปลี่ยนภาษาในส่วนเลือกคำนำหน้า
        form[0][i].textContent = Object.values(langF.personalInfo.title)[i];
    }

    formPersonalinfoFirstName.placeholder = langF.personalInfo.firstName;// เปลี่ยนภาษาในส่วนชื่อ
    formPersonalinfoLastname.placeholder = langF.personalInfo.LastName;// เปลี่ยนภาษาในส่วนนามสกุล

    formSelect[1][0].textContent = langF.personalInfo.educationYear // เปลี่ยนภาษาในส่วนเลือกปีการศึกษา
    
    for(let i=0; i<formSelect[2].length; i++){ // เปลี่ยนภาษาในส่วนเลือกคณะ
        formSelect[2][i].textContent = Object.values(langF.personalInfo.faculty.chocice)[i];
    }

    formStudentId.placeholder = langF.personalInfo.id;// เปลี่ยนภาษาในส่วนรหัสนักศึกษา
    formPersonalInfoPhone.placeholder = langF.personalInfo.phone// เปลี่ยนภาษาในส่วนเบอร์โทร

    //location section
    const formLocation = document.querySelectorAll(".form-section")[1];
    const formLocationHeader = formLocation.children[0];
    const formLocationHouseNum = formLocation.children[1].children[0].children[0];
    const formLocationVillage = formLocation.children[1].children[1].children[0];
    const formLocationSubdistrict = formLocation.children[1].children[2].children[0];
    const formLocationDistrict = formLocation.children[1].children[3].children[0];
    const formLocationProvince = formLocation.children[2].children[0].children[0];
    const formLocationPostal = formLocation.children[2].children[1].children[0];

    formLocationHeader.textContent = langF.location.header;
    formLocationHouseNum.placeholder = langF.location.houseNo;
    formLocationVillage.placeholder = langF.location.villageNo;
    formLocationSubdistrict.placeholder = langF.location.subDistrict;
    formLocationDistrict.placeholder = langF.location.district;
    formLocationProvince.placeholder = langF.location.province;
    formLocationPostal.placeholder = langF.location.postolCode;

    //course add/remove section
    const formCourses = document.querySelectorAll(".form-section")[2];
    const formCoursesHeader = formCourses.children[0];
    const formCoursesId = formCourses.children[1].children[0].children[0];
    const formCoursesName = formCourses.children[1].children[1].children[0];
    const formCoursesSection = formCourses.children[1].children[2].children[0];
    const formCoursesAdvisor = formCourses.children[2].children[0].children[0];
    const formCoursesReason = formCourses.children[3].children[0].children[0];

    formCoursesHeader.textContent = langF.courses.header;
    formCoursesId.placeholder = langF.courses.courseId;
    formCoursesName.placeholder = langF.courses.courseName;
    formCoursesSection.placeholder = langF.courses.section;
    formCoursesAdvisor.placeholder = langF.courses.adivisor;
    formCoursesReason.placeholder = langF.courses.reason;

    //button section
    const buttons = document.querySelector(".button-group");
    const buttonDraft = buttons.children[0];
    const buttonCancel = buttons.children[1];
    const buttonNext = buttons.children[2];

    buttonDraft.textContent = langF.button.draft;
    buttonCancel.textContent = langF.button.cancel;
    buttonNext.textContent = langF.button.next;
}

function changePetitionLang(lang = language.en){
    const langP = lang.pettition;
    const header = document.querySelector(".form-header").children[0];
    const status = document.querySelectorAll(".status-container");

    header.textContent = langP.header;

    for(let i=0; i<status.length; i++){
        status[i].children[0].textContent = Object.values(langP.status)[i];
    }
}

function changeUserProfileLang(lang = language.en){
    const langU = lang.profile;
    const userHeader = document.querySelector(".header").children[0];
    const userMenu = document.querySelector(".info");
    const userRequestHeader = document.querySelector(".requests").children[0];

    userHeader.textContent = langU.header;

    for(let i=0; i<userMenu.children.length-1; i++){
        userMenu.children[i].children[0].textContent = Object.values(langU.personalInfo)[i];
    }

    userRequestHeader.textContent = langU.requestInfo.header;
}