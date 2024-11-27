async function fetchAndUpdate() {
	const userInfo = await getUserInformation();
	const id = Number.parseInt(userInfo.username);
	console.log(userInfo);

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
				const awaitingAction = [];
				const awaitingDocuments = [];
				const denied = [];

				for (const petition of data.data) {
					console.log("Processing petition:", petition); // Log each petition
					switch (petition.status) {
						case "approved":
							approved.push(petition);
							break;
						case "pending":
							inProgress.push(petition);
							break;
						case "awaiting_action":
							awaitingAction.push(petition);
							break;
						case "awaiting_documents":
							awaitingDocuments.push(petition);
							break;
						case "rejected":
							denied.push(petition);
							break;
						default:
							console.warn(`Unknown petition status: ${petition.status}`);
					}
				}

				// Store petition status globally
				window.petitionStatus = {
					approved,
					inProgress,
					awaitingAction,
					awaitingDocuments,
					denied,
					all: data.data,
				};

				// Display all petitions by default
				updatePetitionStatus("ทั้งหมด", data.data);
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
		for (const petition of petitions) {
			const petitionCard = document.createElement("div");
			petitionCard.classList.add("request-card");

			petitionCard.innerHTML = `
                <div class="request-content">
                    <p class="request-title">${petition.content.topic}</p>
                    <p class="request-status">สาเหตุ: ${petition.content.reason}</p>
                </div>
                <div class="request-actions">
                    <button class="delete-btn">ลบคำร้อง</button>
                    <button class="edit-btn">แก้ไข</button>
                </div>
            `;

			petitionCard.querySelector(".edit-btn").addEventListener("click", () => {
				// function ปุ่มแก้คำร้อง
				sessionStorage.setItem("editID", petition.id); //เก็บ id ของคำร้องไว้นำไปใช้ต่อที่หน้าแก้คำร้อง
				window.location.href = "/edit"; //ส่งไปหน้าแก้คำร้อง
			});
			petitionCard
				.querySelector(".delete-btn")
				.addEventListener("click", async () => {
					//function ปุ่มลบคำร้อง
					try {
						const deleteRes = await fetch(`api/petition/${petition.id}`, {
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								id: petition.id,
							}),
						});
						console.log(deleteRes.json());
						window.location.reload();
					} catch (e) {
						console.log(e);
					}
				});
			container.appendChild(petitionCard);
		}
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
			case "all":
				updatePetitionStatus("ทั้งหมด", window.petitionStatus.all);
				break;
			case "in-progress":
				updatePetitionStatus(
					"อยู่ระหว่างดำเนินการ",
					window.petitionStatus.inProgress,
				);
				break;
			case "waiting":
				updatePetitionStatus(
					"รอดำเนินการ",
					window.petitionStatus.awaitingAction,
				);
				break;
			case "documents":
				updatePetitionStatus(
					"รอเอกสาร",
					window.petitionStatus.awaitingDocuments,
				);
				break;
			case "rejected":
				updatePetitionStatus("ปฏิเสธคำร้อง", window.petitionStatus.denied);
				break;
			case "completed":
				updatePetitionStatus("อนุมัติแล้ว", window.petitionStatus.approved);
				break;
			default:
				console.warn("Unknown tab selected");
		}
	});
}

// Fetch data when the page loads
document.addEventListener("DOMContentLoaded", fetchAndUpdate);
