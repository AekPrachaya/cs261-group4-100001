const fileUpload = document.getElementById('fileInput');

document.getElementById("petitionForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
});

async function submitPetition(formData) {
    try {
        const info = await getUserInformation();

        // Construct petition data
        const petitionData = {
            student_id: info.username,
            type: formData.get("petitionType"),
            advisor: formData.get("advisor"),
            status: "pending",
            content: {
                topic: formData.get("topic"),
                date: new Date().toISOString(),
                person_in_charge: info.displayname_th,
                student_info: {
                    name_title: formData.get("title"),
                    student_id: info.username,
                    year: formData.get("year"),
                    major: formData.get("department"),
                },
                location: {
                    house_no: formData.get("houseNumber"),
                    village_no: formData.get("village"),
                    sub_district: formData.get("subDistrict"),
                    district: formData.get("district"),
                    province: formData.get("province"),
                    postal_code: formData.get("postal_code"),
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
                        approve_by: formData.get("approve_by"),
                    },
                ],
                reason: formData.get("reason"),
            },
        };

        console.log(sessionStorage.getItem("editID"));
        // Send petition data to the server
        const petitionResponse = await fetch('/api/petition', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: sessionStorage.getItem("editID"),
                petition: petitionData
            })
        });

        sessionStorage.removeItem("editID");

        if (petitionResponse.ok) {
            const responseData = await petitionResponse.json();
            const petitionId = responseData.data.id;

            // Check if there's a file to upload
            if (fileInput.files.length > 0) {
                const fileData = new FormData();
                fileData.append('files', fileInput.files[0]); // File from file input
                fileData.append('petition_id', petitionId);

                const fileResponse = await fetch('/api/files', {
                    method: 'POST',
                    body: fileData
                });
                if (fileResponse.ok) {
                    const fileDataResponse = await fileResponse.json();
                    console.log('Files submitted successfully:', fileDataResponse);
                } else {
                    console.error('Failed to submit files:', await fileResponse.json());
                }
            }
            showPopup(saveRequestPopup);
            return petitionResponse;

        } else {
            const errorData = await petitionResponse.json();
            console.error('Failed to submit petition:', errorData);
        }

    } catch (error) {
        console.error('Error occurred:', error);
        alert('There was an error submitting your petition. Please try again later.');
    }
};

async function displayUserInformation() {
    const id = document.querySelector("#student-info-id");

    try {
        const info = await getUserInformation();
        id.textContent = `${info.displayname_th} รหัสนักศึกษา ${info.username} ${info.faculty} ${info.department}`;
    } catch (e) {
        console.error(e);
        id.textContent = "เกิดข้อผิดพลาด";
    }

}

async function fetchAndUpdate() {
/*     const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
        console.error("User not logged in or missing username");
        return;
    }
    const id = parseInt(user.username); */
    const petitionId = sessionStorage.getItem("editID")
    console.log(petitionId);

    await fetch(`/api/petitions/${petitionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.data && data.data.length > 0) {
            const petitionData = data.data[0];  // Get the first petition object
            console.log('Petition Data:', petitionData);
    
            // Fill form with fetched petition data
            document.querySelector('input[name="phone_no"]').value = petitionData.content.phone_no;
            document.querySelector('input[name="advisor"]').value = petitionData.content.advisor;
            document.querySelector('input[name="houseNumber"]').value = petitionData.content.location.house_no;
            document.querySelector('input[name="village"]').value = petitionData.content.location.village_no;
            document.querySelector('input[name="subDistrict"]').value = petitionData.content.location.sub_district;
            document.querySelector('input[name="district"]').value = petitionData.content.location.district;
            document.querySelector('input[name="province"]').value = petitionData.content.location.province;
            document.querySelector('input[name="postal_code"]').value = petitionData.content.location.postal_code;
            document.querySelector('input[name="topic"]').value = petitionData.content.topic;
            document.querySelector('textarea[name="reason"]').value = petitionData.content.reason;
            // Continue mapping other fields similarly...
        } else {
            console.log('No petition data found.');
        }
    })
    .catch((error) => {
        console.error('Error fetching petition data:', error);
    });
    
}

function populateForm(data) {
    const form = document.getElementById("petitionForm");

    if (form) {
        form.querySelector('[name="phone_no"]').value = data.content?.phone_no || "";
        form.querySelector('[name="advisor"]').value = data.content?.advisor || "";
        form.querySelector('[name="houseNumber"]').value = data.content?.location?.house_no || "";
        form.querySelector('[name="village"]').value = data.content?.location?.village_no || "";
        form.querySelector('[name="subDistrict"]').value = data.content?.location?.sub_district || "";
        form.querySelector('[name="district"]').value = data.content?.location?.district || "";
        form.querySelector('[name="province"]').value = data.content?.location?.province || "";
        form.querySelector('[name="postal_code"]').value = data.content?.location?.postal_code || "";
        form.querySelector('[name="topic"]').value = data.content?.topic || "";
        form.querySelector('[name="reason"]').value = data.content?.reason || "";
        form.querySelector('[name="course_id"]').value = data.content?.courses?.[0]?.course_id || "";
        form.querySelector('[name="section"]').value = data.content?.courses?.[0]?.section || "";
        form.querySelector('[name="courseName"]').value = data.content?.courses?.[0]?.course_name || "";

        // Handle select fields
        form.querySelector('[name="year"]').value = data.content?.student_info?.year || "";

        // Handle checkboxes
        const petitionTypeCheckboxes = form.querySelectorAll('[name="petitionType"]');
        petitionTypeCheckboxes.forEach((checkbox) => {
            if (checkbox.value === data.type) {
                checkbox.checked = true;
            }
        });
    }
}

const fileInput = document.getElementById('fileInput');
const attachFileBtn = document.getElementById('attachFileBtn');
const fileNameSpan = document.getElementById('fileName');

attachFileBtn.addEventListener('click', () => {
    fileInput.click();
});


// อ้างอิงปุ่มและ Popup ใช้เพื่อดูสำหรับตกแต่งCss
const cancelPopup = document.getElementById('cancelPopup');
const saveRequestPopup = document.getElementById('saveRequestPopup');

function hideAllPopups() {
    const popups = [cancelPopup, saveRequestPopup];

    for (const popup of popups) {
        popup.style.display = "none";
    }
}

// ฟังก์ชันเปิดและปิด Popup
function showPopup(popup) {
    hideAllPopups();
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000); // Hide the popup after 3 seconds
}

document.addEventListener("DOMContentLoaded", () => {
    displayUserInformation();
    fetchAndUpdate();
    // Handle other actions like save draft or cancel
        const btnCancel = document.getElementById("btnCancel");
        const form = document.getElementById("petitionForm");
    
        if (btnCancel && form) {
            btnCancel.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                form.reset();
                const clearError = () => {
                    const invalidFields = document.querySelectorAll(".error-border");
    
                    for (const invalidField of invalidFields) {
                        invalidField.classList.remove("error-border");
                    }
                };
                clearError();
                const checkboxes = form.querySelectorAll(
                    'input[type="checkbox"], input[type="radio"]',
                );
    
                for (const checkbox of checkboxes) {
                    checkbox.checked = false;
                }
    
                for (const checkbox of petitionTypeCheckboxes) {
                    checkbox.checked = false;
                    checkbox.classList.remove("checked-checkbox");
                    checkbox.classList.remove("disabled-checkbox");
                    checkbox.removeAttribute("data-disabled");
                }
                showPopup(cancelPopup);
            });
        }
    
        // Prevent popups from closing when clicked inside
        for (popup of [cancelPopup, saveRequestPopup]) {
            popup.addEventListener("click", (event) => {
                event.stopPropagation();
            });
        }
    
        document.addEventListener("click", hideAllPopups);
    
        const viewStatusButton = document.getElementById("viewStatus");
    
        if (viewStatusButton) {
            viewStatusButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                hideAllPopups();
    
                // Redirect
                window.location.href = "/petition";
            });
        }
});