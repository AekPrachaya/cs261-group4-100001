const fileUpload = document.getElementById('fileUpload');

document.getElementById("petitionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    try {
        info = await getUserInformation();        
    } catch (e) {
        console.error(e);
        id.textContent = "เกิดข้อผิดพลาด";
    }

    const petitionData = {
        student_id: info["username"],
        type: formData.get("petitionType"),
        advisor: formData.get("advisor"),
        status: "pending",
        content: {
            topic: formData.get("topic"),
            date: new Date().toISOString(),
            person_in_charge: info["displayname_th"],
            student_info: {
                name_title: formData.get("title"),
                student_id: info["username"],
                year: formData.get("year"),
                major: info["department"],
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
        const petitionId = responseData.data.id;
        const fileData = new FormData();

        fileData.append('files', formData.get('fileInput'));
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

async function getUserInformation() {
    const userInfo = await fetch("/api/session", {
        headers: {
        }
    });
    return userInfo.json() // return promise ของข้อมูล session ใน รูปแบบ JSON
}

async function displayUserInfomation() {
    const id = document.querySelector("#student-info-id")
    
    try {
        const info = await getUserInformation(); // เก็บข้อมูล user ที่ดึงมาจาก api/session
        
        id.textContent = `${info["displayname_th"]} รหัสนักศึกษา ${info["username"]} ${info["faculty"]} ${info["department"]}`;
    } catch (e) {
        console.error(e);
        id.textContent = "เกิดข้อผิดพลาด";
    }
}


document.addEventListener("DOMContentLoaded", displayUserInfomation); 
