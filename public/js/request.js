const fileUpload = document.getElementById('fileInput');

document.getElementById("petitionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const selectedPetitionType = formData.getAll("petitionType");
    const petitionDefault = {
        phone_no: formData.get("phone_no"),
        advisor: formData.get("advisor"),
        location: {
            houseNumber: formData.get("houseNumber"),
            village: formData.get("village"),
            subDistrict: formData.get("subDistrict"),
            district: formData.get("district"),
            province: formData.get("province"),
            postal_code: formData.get("postal_code"),
        },
        topic: formData.get("topic"),
        reason: formData.get("reason"),
    };
    
    // Helper function to mark a field as invalid
    const markInvalid = (fieldName) => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add("error-border");
        }
    };

    const petitionType = selectedPetitionType[0];
    
    let isValid = true;
    
    // Ensure only one petition type is checked
    if (selectedPetitionType.length !== 1) {
        alert("กรุณาเลือกประเภทคำร้องเพียงหนึ่งประเภท");
        markPetitionTypeError();
    }

    if (petitionType === "add/remove" || petitionType === "drop") {
        // Validate add/remove or drop-specific fields
        const year = formData.get("year");
        const semester = formData.get("semester");
        const courseId = formData.get("course_id");
        const section = formData.get("section");
        const courseName = formData.get("courseName");

        if (!year) {
            isValid = false;
            markInvalid("year");
        }
        if (!semester) {
            isValid = false;
            markInvalid("semester");
        }
        if (!courseId) {
            isValid = false;
            markInvalid("course_id");
        }
        if (!section) {
            isValid = false;
            markInvalid("section");
        }
        if (!courseName) {
            isValid = false;
            markInvalid("courseName");
        }
        if (!isValid) {
            alert("กรุณากรอกข้อมูลที่จำเป็นสำหรับการเพิ่มหรือถอนรายวิชา");
        }
    } else if (petitionType === "resign") {
        // Validate resign-specific fields
        const year = formData.get("Year");
        const semester = formData.get("semester");

        if (!year) {
            isValid = false;
            markInvalid("Year");
        }
        if (!semester) {
            isValid = false;
            markInvalid("semester");
        }
        if (!isValid) {
            alert("กรุณากรอกข้อมูลที่จำเป็นสำหรับการลาออก");
        }
    }

    // Validate petition default fields
    for (const [key, value] of Object.entries(petitionDefault)) {
        if (key === "location") {
            // Check each property inside location object
            for (const [locationKey, locationValue] of Object.entries(value)) {
                if (!locationValue) {
                    isValid = false;
                    markInvalid(locationKey);
                }
            }
        } else if (!value) {
            isValid = false;
            markInvalid(key);
        }
    }

    // If validation passes, proceed with form submission
    if (isValid) {
        console.log("Form is valid, proceeding with submission...");
        submitPetition(formData);
    }
});

//reset error borders
const resetErrorBorders = () => {
    document.querySelectorAll(".error-border").forEach((element) => {
        element.classList.remove("error-border");
    });
};

// Helper function to mark petition type as invalid
const markPetitionTypeError = () => {
    const petitionTypeInputs = document.querySelectorAll('input[name="petitionType"]');
    petitionTypeInputs.forEach((input) => {
            input.classList.add("error-border");
    });
};

// Apply event listeners to form fields and checkboxes for real-time reset
const applyResetListeners = () => {
    // Add listeners to all input fields
    document.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("focus", () => {
            field.classList.remove("error-border");
        });
    });

    petitionTypeCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            // Remove error border on this checkbox
            checkbox.classList.remove("error-border");

            if (checkbox.checked) {
                // Uncheck all other checkboxes
                petitionTypeCheckboxes.forEach((otherCheckbox) => {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                        otherCheckbox.classList.remove("error-border");
                    }
                });
            }
        });

        checkbox.addEventListener("click", function (event) {
            if (this.getAttribute("data-disabled") === "true") {
                event.preventDefault(); // Prevent the checkbox from being checked
                this.classList.add("error-border");

                // Optional: Flash red border briefly
                setTimeout(() => this.classList.remove("error-border"), 500);
            }
        });
    });
};


// Get all the petition type checkboxes
const petitionTypeCheckboxes = document.querySelectorAll('.petition-type-checkbox');

petitionTypeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Disable all other checkboxes
            petitionTypeCheckboxes.forEach(otherCheckbox => {
                if (otherCheckbox !== this) {
                    otherCheckbox.classList.add('disabled-checkbox'); // Add disabled style
                    otherCheckbox.setAttribute('data-disabled', 'true'); // Mark as disabled
                }
            });

            // Add a checked style to the selected checkbox
            this.classList.add('checked-checkbox');
        } else {
            // If this checkbox is unchecked, re-enable all checkboxes if no other is selected
            const anyChecked = Array.from(petitionTypeCheckboxes).some(cb => cb.checked);

            if (!anyChecked) {
                petitionTypeCheckboxes.forEach(otherCheckbox => {
                    otherCheckbox.classList.remove('disabled-checkbox'); // Remove disabled style
                    otherCheckbox.removeAttribute('data-disabled'); // Remove disabled marker
                });
            }

            // Remove the checked style
            this.classList.remove('checked-checkbox');
        }
    });

    // Handle clicks on disabled checkboxes
    checkbox.addEventListener('click', function (event) {
        if (this.getAttribute('data-disabled') === 'true') {
            event.preventDefault(); // Prevent the checkbox from being checked

            // Add a red border to indicate an error
            this.classList.add('error-border');

            // Remove the red border after a short delay (optional)
            setTimeout(() => {
                this.classList.remove('error-border');
            }, 500);
        }
    });
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

        // Send petition data to the server
        const petitionResponse = await fetch('/api/petition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: petitionData.type,
                content: petitionData
            })
        });

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

// Get the file input and button elements
const fileInput = document.getElementById('fileInput');
const attachFileBtn = document.getElementById('attachFileBtn');
const fileNameSpan = document.getElementById('fileName');

attachFileBtn.addEventListener('click', () => {
    fileInput.click();
});



// อ้างอิงปุ่มและ Popup ใช้เพื่อดูสำหรับตกแต่งCss
const saveDraftButton = document.getElementById('btnSaveDraft');
const cancelButton = document.getElementById('btnCancel');
const saveRequestButton = document.getElementById('btnSaveRequest');

const saveDraftPopup = document.getElementById('saveDraftPopup');
const cancelPopup = document.getElementById('cancelPopup');
const saveRequestPopup = document.getElementById('saveRequestPopup');

// ฟังก์ชันเปิดและปิด Popup
function showPopup(popup) {
    popup.classList.add('active'); // เพิ่มคลาส active เพื่อแสดง Popup
    setTimeout(() => {
        popup.classList.remove('active'); // ลบคลาส active เพื่อซ่อน Popup หลัง 3 วินาที
    }, 3000);
}

// กดปุ่ม "บันทึกแบบร่าง"
saveDraftButton.addEventListener('click', () => {
    showPopup(saveDraftPopup);
});

// กดปุ่ม "ยกเลิกสำเร็จ"
cancelButton.addEventListener('click', () => {
    showPopup(cancelPopup);
});

// กดปุ่ม "ส่งคำร้อง"
saveRequestButton.addEventListener('click', () => {
    showPopup(saveRequestPopup);
});

document.addEventListener("DOMContentLoaded", () => {
    applyResetListeners();
    displayUserInformation();
});