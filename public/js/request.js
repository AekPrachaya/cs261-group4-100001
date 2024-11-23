const fileUpload = document.getElementById('fileInput');

document.getElementById("petitionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        // Get user information
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
            }
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
});

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

// When the button is clicked, trigger the file input
attachFileBtn.addEventListener('click', () => {
    fileInput.click();
});

// When a file is selected, display the file name
fileInput.addEventListener('change', () => {
    const fileName = fileInput.files[0] ? fileInput.files[0].name : '';
    fileNameSpan.textContent = fileName ? `ไฟล์ที่เลือก: ${fileName}` : '';
});

document.addEventListener("DOMContentLoaded", displayUserInformation);
