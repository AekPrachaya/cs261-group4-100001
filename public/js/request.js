const fileUpload = document.getElementById("fileInput");

document
	.getElementById("petitionForm")
	.addEventListener("submit", async function (event) {
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

		// Mark a field as invalid
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
			markPetitionTypeError();
		}

		if (petitionType === "add/remove" || petitionType === "drop") {
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
			// TODO: change button color darker
			// disable
			await submitPetition(formData);
			// TODO: change button color back to normal
		}
	});

const resetErrorBorders = () => {
	for (const element of document.querySelectorAll(".error-border")) {
		element.classList.remove("error-border");
	}
};

// mark petitiontype as invalid
const markPetitionTypeError = () => {
	const petitionTypeInputs = document.querySelectorAll(
		'input[name="petitionType"]',
	);

	for (const input of petitionTypeInputs) {
		input.classList.add("error-border");
	}
};

// Apply event listeners to form fields and checkboxes for real-time reset
const applyResetListeners = () => {
	for (const field of document.querySelectorAll("input, textarea, select")) {
		field.addEventListener("focus", () => {
			field.classList.remove("error-border");
		});
	}

	for (const checkbox of petitionTypeCheckboxes) {
		checkbox.addEventListener("change", () => {
			checkbox.classList.remove("error-border");

			if (checkbox.checked) {
				// Uncheck all other checkboxes

				for (const otherCheckbox of petitionTypeCheckboxes) {
					if (otherCheckbox !== checkbox) {
						otherCheckbox.checked = false;
						otherCheckbox.classList.remove("error-border");
					}
				}
			}
		});

		checkbox.addEventListener("click", function (event) {
			if (this.getAttribute("data-disabled") === "true") {
				event.preventDefault();
				this.classList.add("error-border");
			}
		});
	}
};

// Get all the petitiontype checkboxes
const petitionTypeCheckboxes = document.querySelectorAll(
	".petition-type-checkbox",
);

for (checkbox of petitionTypeCheckboxes) {
	checkbox.addEventListener("change", function () {
		if (this.checked) {
			// Disable all other checkboxes

			for (const otherCheckbox of petitionTypeCheckboxes) {
				if (otherCheckbox !== this) {
					otherCheckbox.classList.add("disabled-checkbox");
					otherCheckbox.setAttribute("data-disabled", "true");
				}
			}

			this.classList.add("checked-checkbox");
		} else {
			const anyChecked = Array.from(petitionTypeCheckboxes).some(
				(cb) => cb.checked,
			);

			if (!anyChecked) {
				for (const otherCheckbox of petitionTypeCheckboxes) {
					otherCheckbox.classList.remove("disabled-checkbox");
					otherCheckbox.removeAttribute("data-disabled");
				}
			}

			this.classList.remove("checked-checkbox");
		}
	});

	checkbox.addEventListener("click", function (event) {
		if (this.getAttribute("data-disabled") === "true") {
			event.preventDefault();

			this.classList.add("error-border");

			setTimeout(() => {
				this.classList.remove("error-border");
			}, 500);
		}
	});
}

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
		const petitionResponse = await fetch("/api/petition", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: petitionData.type,
				content: petitionData,
			}),
		});

		if (petitionResponse.ok) {
			const responseData = await petitionResponse.json();
			const petitionId = responseData.data.id;

			// Check if there's a file to upload
			if (fileInput.files.length > 0) {
				const fileData = new FormData();
				fileData.append("files", fileInput.files[0]); // File from file input
				fileData.append("petition_id", petitionId);

				const fileResponse = await fetch("/api/files", {
					method: "POST",
					body: fileData,
				});
				if (fileResponse.ok) {
					const fileDataResponse = await fileResponse.json();
					console.log("Files submitted successfully:", fileDataResponse);
				} else {
					console.error("Failed to submit files:", await fileResponse.json());
				}
			}
			showPopup(saveRequestPopup);
		} else {
			const errorData = await petitionResponse.json();
			console.error("Failed to submit petition:", errorData);
		}
	} catch (error) {
		console.error("Error occurred:", error);
		alert(
			"There was an error submitting your petition. Please try again later.",
		);
	}
}

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

const fileInput = document.getElementById("fileInput");
const attachFileBtn = document.getElementById("attachFileBtn");
const fileNameSpan = document.getElementById("fileName");
const clearFileBtn = document.getElementById("clearFileBtn");
const previewButton = document.getElementById("previewFileBtn");
const previewFrame = document.getElementById("previewFrame");
const filePreview = document.getElementById("filePreview");
const overlay = document.getElementById("overlay");
const closePreviewBtn = document.getElementById("closePreviewBtn");

attachFileBtn.addEventListener("click", () => {
	fileInput.click();
});

fileInput.addEventListener("change", () => {
	if (fileInput.files.length > 0) {
		fileNameSpan.textContent = fileInput.files[0].name;
		clearFileBtn.style.display = "inline-block";
	} else {
		resetFileInput();
	}
});

clearFileBtn.addEventListener("click", () => {
	resetFileInput();
});

function resetFileInput() {
	fileInput.value = "";
	fileNameSpan.textContent = "";
	clearFileBtn.style.display = "none";
	filePreview.classList.remove("show");
	overlay.classList.remove("show");
}

previewButton.addEventListener("click", () => {
	if (fileInput.files.length > 0) {
		const file = fileInput.files[0];
		if (
			file.type.includes("pdf") ||
			file.type.includes("image") ||
			file.type.includes("text")
		) {
			const fileURL = URL.createObjectURL(file);
			previewFrame.src = fileURL;
			filePreview.classList.add("show");
			overlay.classList.add("show");
		} else {
			alert("This file type cannot be previewed.");
		}
	} else {
		alert("No file selected for preview.");
	}
});

closePreviewBtn.addEventListener("click", () => {
	filePreview.classList.remove("show");
	overlay.classList.remove("show");
});

const saveDraftPopup = document.getElementById("saveDraftPopup");
const cancelPopup = document.getElementById("cancelPopup");
const saveRequestPopup = document.getElementById("saveRequestPopup");

function hideAllPopups() {
	const popups = [saveDraftPopup, cancelPopup, saveRequestPopup];

	for (const popup of popups) {
		popup.style.display = "none";
	}
}

function showPopup(popup) {
	hideAllPopups();
	popup.style.display = "block";
	setTimeout(() => {
		popup.style.display = "none";
	}, 3000); // Hide the popup after 3 seconds
}

async function getUserInformation() {
	const userInfo = await fetch("/api/session", {
		headers: {},
	});
	return userInfo.json();
}

document.addEventListener("DOMContentLoaded", () => {
	applyResetListeners();
	displayUserInformation();

	// Handle other actions like save draft or cancel
	const btnSaveDraft = document.getElementById("btnSaveDraft");
	const btnCancel = document.getElementById("btnCancel");
	const form = document.getElementById("petitionForm");

	if (btnSaveDraft) {
		btnSaveDraft.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			showPopup(saveDraftPopup);
		});
	}

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
			resetFileInput();
			showPopup(cancelPopup);
		});
	}

	// Prevent popups from closing when clicked inside
	for (popup of [saveDraftPopup, cancelPopup, saveRequestPopup]) {
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
