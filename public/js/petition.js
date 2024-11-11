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
        changePetitionLang();
        changeSidebarLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changePetitionLang(language.th);
        changeSidebarLang(language.th);
        languageButton.textContent = "EN";
    }
}

const studentId = "123";

fetch('/api/petition/get_all', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    student_id: studentId
  }),
})
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data)) {

      const approved = [];
      const inProgress = [];
      const awaitingAction = [];
      const awaitingDocuments = [];
      const denied = [];

      data.forEach(petition => {
        switch (petition.type) {
          case 'อนุมัติแล้ว':
            approved.push(petition);
            break;
          case 'อยู่ในระหว่างพิจารณา':
            inProgress.push(petition);
            break;
          case 'รอดำเนินการ':
            awaitingAction.push(petition);
            break;
          case 'รอเอกสาร':
            awaitingDocuments.push(petition);
            break;
          case 'ปฎิเสธคำร้อง': 
            denied.push(petition);
            break;
        }
      });

      updatePetitionStatus('อนุมัติแล้ว', approved);
      updatePetitionStatus('อยู่ในระหว่างพิจารณา', inProgress);
      updatePetitionStatus('รอดำเนินการ', awaitingAction);
      updatePetitionStatus('รอเอกสาร', awaitingDocuments);
      updatePetitionStatus('ปฎิเสธคำร้อง', denied);
    } else {
      console.error('No petitions found or incorrect data format');
    }
  })
  .catch(error => console.error('Error fetching petition data:', error));

function updatePetitionStatus(status, petitions) {
  const statusContainer = document.querySelector(`.status-container h1:contains(${status})`).parentElement;
  const petitionContainer = statusContainer.querySelector('.petition-container');
  
  petitionContainer.innerHTML = '';
  
  if (petitions.length > 0) {
    petitions.forEach(petition => {
      const petitionElement = document.createElement('p');
      petitionElement.textContent = petition.name;
      petitionContainer.appendChild(petitionElement);
    });
  }
}

