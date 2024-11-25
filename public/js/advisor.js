async function fetchAndUpdate() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
        console.error("User not logged in or missing username");
        return;
    }
    const id = parseInt(user.username);

    await fetch(`/api/petitions/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetched petition data:", data);

            if (Array.isArray(data.data)) {
                // Arrays to hold petitions based on status
                const approved = [];
                const inProgress = [];
                const denied = [];

                data.data.forEach(petition => {
                    console.log("Processing petition:", petition);
                    switch (petition.status) {
                        case "approved":
                            approved.push(petition);
                            break;
                        case "pending":
                            inProgress.push(petition);
                            break;
                        case "rejected":
                            denied.push(petition);
                            break;
                        default:
                            console.warn(`Unknown petition status: ${petition.status}`);
                    }
                });

                // Store petition status globally
                window.petitionStatus = {
                    denied,
                    inProgress,
                    approved
                };

                // Display all petitions by default
                updatePetitionStatus("รอดำเนินการ", inProgress);
            } else {
                console.error("No petitions found or incorrect data format");
            }
        })
        .catch((error) => console.error("Error fetching petition data:", error));
}

function updatePetitionStatus(statusLabel, petitions) {
    const container = document.querySelector(".requests-container");
    if (!container) {
        console.warn("No requests container found!");
        return;
    }
    container.innerHTML = ""; // Clear the container

    if (petitions.length > 0) {
        petitions.forEach(petition => {
            const petitionCard = document.createElement('div');
            petitionCard.classList.add('request-card');

            petitionCard.innerHTML = `
                <div class="request-content">
                    <p class="request-title">${petition.content.topic}</p>
                    <p class="request-status">สาเหตุ: ${petition.content.reason}</p>
                </div>
                <div class="request-actions">
                    <button class="check-advisor-btn">เช็คคำร้อง</button>
                </div>
            `;
            petitionCard.querySelector(".check-advisor-btn").addEventListener("click", async function () {
                try {
                    const response = await fetch(`/api/approval/:${petition.id}`, {
                        method: "GET", 
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error fetching approval: ${response.statusText}`);
                    }
            
                    const data = await response.json();
                    console.log("Approval data:", data);
                    alert(
                        JSON.stringify(data.data, null, 2) 
                    );
                } catch (e) {
                    console.error(e);
                }
            });
            petitionCard.querySelector(".edit-btn").addEventListener("click", function () {// function ปุ่มแก้คำร้อง
                sessionStorage.setItem("editID", petition.id); //เก็บ id ของคำร้องไว้นำไปใช้ต่อที่หน้าแก้คำร้อง
                window.location.href = "/check"; //ส่งไปหน้าแก้คำร้อง
            });
            petitionCard.querySelector(".delete-btn").addEventListener("click", async function () {//function ปุ่มลบคำร้อง
                try {
                    const deleteRes = await fetch(`api/petition/${petition.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: petition.id, 
                        })                            
                    }); 
                    console.log(deleteRes.json());
                    window.location.reload();
                } catch (e) {
                    console.log(e);
                }
            });
            container.appendChild(petitionCard);
        });
    } else {
        container.innerHTML = "<p>ไม่มีคำร้องในสถานะนี้</p>";
    }
}

// Tab switching logic
for (const tab of document.querySelectorAll(".tab-btn")) {
    tab.addEventListener("click", () => {
        const status = tab.dataset.tab;

        // Clear active state for tabs

        for (const t of document.querySelectorAll(".tab-btn")) {
            t.classList.remove("active");
        }

        tab.classList.add("active");

        // Update title
        const title = document.querySelector(".requests-title");
        title.textContent = tab.textContent;

        // Update petitions based on selected tab
        switch (status) {
            case "in-progress":
                updatePetitionStatus(
                    "อยู่ระหว่างดำเนินการ",
                    window.petitionStatus.inProgress,
                );
                break;
            case "denied":
                updatePetitionStatus("ปฏิเสธคำร้อง", window.petitionStatus.denied);
                break;
            case "approved":
                updatePetitionStatus("อนุมัติแล้ว", window.petitionStatus.approved);
                break;
            default:
                console.warn("Unknown tab selected");
        }
    });
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndUpdate);