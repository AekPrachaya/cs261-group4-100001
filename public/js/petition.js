//ส่วนปุ่มเปลี่ยนภาษา
const languageButton = document.querySelector(".language-switch");

function switchLanguage() {
	// เปลี่่ยน hash ที่ url เพื่อใช้กำหนดภาษา
	if (location.hash === "#th") {
		location.hash = "en";
		location.reload();
	} else if (location.hash === "#en") {
		location.hash = "th";
		location.reload();
	} else {
		location.hash = "en";
		location.reload();
	}
}

languageButton.addEventListener("click", switchLanguage); //เพิ่ม event ที่ปุ่มเปลี่ยนภาษาด้วย function switchlanguage()

//หลัง reload ให้เช็คค่า hash และเปลี่ยนภาษาตาม
if (location.hash) {
	if (location.hash == "#en") {
		changePetitionLang();
		changeSidebarLang();
		languageButton.textContent = "TH";
	} else if (location.hash == "#th") {
		changePetitionLang(language.th);
		changeSidebarLang(language.th);
		languageButton.textContent = "EN";
	}
}

console.log(JSON.parse(localStorage.getItem("user")).username);
fetch("/api/petition/get_all", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		student_id: JSON.parse(localStorage.getItem("user")).username,
	}),
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

			data.data.forEach((petition) => {
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
					case "denied":
						denied.push(petition);
						break;
					default:
						console.warn(`Unknown petition status: ${petition.status}`);
				}
			});

			updatePetitionStatus("อนุมัติแล้ว", approved);
			updatePetitionStatus("อยู่ในระหว่างพิจารณา", inProgress);
			updatePetitionStatus("รอดำเนินการ", awaitingAction);
			updatePetitionStatus("รอเอกสาร", awaitingDocuments);
			updatePetitionStatus("ปฎิเสธคำร้อง", denied);
		} else {
			console.error("No petitions found or incorrect data format");
		}
	})
	.catch((error) => console.error("Error fetching petition data:", error));

function updatePetitionStatus(status, petitions) {
	// Find the status container that matches the status name
	const statusContainer = Array.from(
		document.querySelectorAll(".status-container h1"),
	).find(
		(h1) => h1.textContent.trim().toLowerCase() === status.trim().toLowerCase(),
	);

	if (statusContainer) {
		const petitionContainer = statusContainer.parentElement.querySelector(
			".petition-container",
		);

		petitionContainer.innerHTML = "";

		if (petitions.length > 0) {
			petitions.forEach((petition) => {
				const petitionElement = document.createElement("p");
				petitionElement.textContent = `${petition.type}`;
				petitionContainer.appendChild(petitionElement);
			});
		}
	} else {
		console.warn(`Status container for "${status}" not found.`);
	}
}
