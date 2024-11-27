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

				data.data.forEach((petition) => {
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
					approved,
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
		petitions.forEach((petition) => {
			const petitionCard = document.createElement("div");
			petitionCard.classList.add("request-card");

			petitionCard.innerHTML = `
            <div class="request-content">
                <p class="request-title">${petition.content.topic}</p>
                <p class="request-status">สาเหตุ: ${petition.content.reason}</p>
            </div>
            <div class="request-actions">
                <button class="check-advisor-btn">เช็คคำร้อง</button>
            </div>`;
			petitionCard
				.querySelector(".check-advisor-btn")
				.addEventListener("click", async function () {
					try {
						const response = await fetch(`/api/approval/${petition.id}`, {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						});

						if (!response.ok) {
							throw new Error(
								`Error fetching approval: ${response.statusText}`,
							);
						}

						const data = await response.json();
						console.log("Approval data:", data);

						// edit
						sessionStorage.setItem("checkID", petition.id);
						window.location.href = "/check";
					} catch (e) {
						console.error(e);
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

		tab.setAttribute("aria-selected", "true");
		document
			.querySelectorAll(".tab-btn:not([aria-selected='true'])")
			.forEach((t) => t.setAttribute("aria-selected", "false"));

		// Update title
		const title = document.querySelector(".requests-title");
		title.textContent = tab.textContent;

		// Update petitions based on selected tab
		const statusMap = {
			"in-progress": {
				label: "อยู่ระหว่างดำเนินการ",
				data: window.petitionStatus.inProgress,
			},
			denied: { label: "ปฏิเสธคำร้อง", data: window.petitionStatus.denied },
			approved: { label: "อนุมัติแล้ว", data: window.petitionStatus.approved },
		};

		if (statusMap[status]) {
			updatePetitionStatus(statusMap[status].label, statusMap[status].data);
		} else {
			console.warn("Unknown tab selected");
		}
	});
}

// Fetch data when the page loads
document.addEventListener("DOMContentLoaded", fetchAndUpdate);
