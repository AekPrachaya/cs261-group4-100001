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
			submitPetition(formData);
		}
	});

//reset error borders
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
	// Add listeners to all input fields

	for (const field of document.querySelectorAll("input, textarea, select")) {
		field.addEventListener("focus", () => {
			field.classList.remove("error-border");
		});
	}
	for (const checkbox of petitionTypeCheckboxes) {
		checkbox.addEventListener("change", () => {
			// Remove error border on this checkbox
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

			checkbox.addEventListener("click", function (event) {
				if (this.getAttribute("data-disabled") === "true") {
					event.preventDefault();
					this.classList.add("error-border");
				}
			});
		});
	}
};

// Get all the petitiontype checkboxes
const petitionTypeCheckboxes = document.querySelectorAll(
	".petition-type-checkbox",
);

for (const checkbox of petitionTypeCheckboxes) {
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

		console.log(sessionStorage.getItem("editID"));
		// Send petition data to the server
		const petitionResponse = await fetch("/api/petition", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: sessionStorage.getItem("editID"),
				petition: petitionData,
			}),
		});

		sessionStorage.removeItem("editID");

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
			return petitionResponse;
		}
		const errorData = await petitionResponse.json();
		console.error("Failed to submit petition:", errorData);
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

attachFileBtn.addEventListener("click", () => {
	fileInput.click();
});

// อ้างอิงปุ่มและ Popup ใช้เพื่อดูสำหรับตกแต่งCss
const saveDraftPopup = document.getElementById("saveDraftPopup");
const cancelPopup = document.getElementById("cancelPopup");
const saveRequestPopup = document.getElementById("saveRequestPopup");

function hideAllPopups() {
	const popups = [saveDraftPopup, cancelPopup, saveRequestPopup];

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

// ERROR: metadata
async function createFile(url) {
	const response = await fetch(url);
	const data = await response.blob();
	// FIX
	const metadata = {
		type: "image/png",
	};
	// FIX
	return new File([data], "input.png", metadata);
}

//function ดึงข้อมูลคำร้องด้วย uuid
async function getPetitionData(id) {
	const response = await fetch(`api/petition/${id}`);
	console.log(response);
	const petition = await response.json(); //แปลงข้อมูลที่รับมาเป็น JSON
	console.log(petition); //ใช้ test
	return petition; //return ข้อมูลของคำร้อง ประกอบไปด้วย id, type, content
}

//function ดึงข้อมูลไฟล์ของคำร้องด้วย uuid
async function getPetitionFile(id) {
	const response = await fetch(`api/files/${id}`);
	const petitionFile = await response.json(); //แปลงข้อมูลที่รับมาเป็น JSON
	console.log("GET FILE", petitionFile); //ใช้ test
	const file = await createFile(petitionFile.data[0].url);
	return file; // return เป็น file obj
}

async function displayPetitionDataInForm() {
	//text input form
	const phoneInput = document.querySelector("#form-phone_no");
	const advisorInput = document.querySelector("#form-advisor");
	const houseNumberInput = document.querySelector("#form-houseNumber");
	const villageInput = document.querySelector("#form-village");
	const subDistrictInput = document.querySelector("#form-subDistrict");
	const districtInput = document.querySelector("#form-district");
	const provinceInput = document.querySelector("#form-province");
	const postalCodeInput = document.querySelector("#form-postal_code");
	const courseIdInput = document.querySelector("#form-course_id");
	const sectionInput = document.querySelector("#form-section");
	const courseNameInput = document.querySelector("#form-courseName");
	const topicInput = document.querySelector("#form-topic");
	const reasonTextarea = document.querySelector("#form-reason");

	//select form
	const yearSelect = document.querySelector("#form-year");
	const semesterSelect = document.querySelector("#form-semester"); //ไม่มีใน response
	const resignYearSelect = document.querySelector("#form-resign-year"); //ไม่มีใน response
	const resignSemesterSelect = document.querySelector("#form-resign-semester"); //ไม่มีใน response

	//checkbox form
	const addRemoveCheck = document.querySelector("#form-check-add-remove");
	const dropCheck = document.querySelector("#form-check-drop");
	const resignCheck = document.querySelector("#form-check-resign"); //ไม่มีใน response
	const otherCheck = document.querySelector("#form-check-other"); //ไม่มีใน response

	//file input
	const fileInput = document.querySelector("#fileInput"); //ไม่เจอใน response

	const petition = await getPetitionData(sessionStorage.getItem("editID"));
	console.log(petition.data.content);

	const content = petition.data.content; //ใช้เฉพาะรายละเอียดของคำร้อง

	// ใส่ข้อมูลในแต่ละ input เรียงตาม content ในคำร้อง
	advisorInput.value = content.advisor;

	//courses
	courseIdInput.value = content.courses[0].course_id;
	sectionInput.value = content.courses[0].section;
	courseNameInput.value = content.courses[0].course_name;

	//location
	districtInput.value = content.location.district;
	houseNumberInput.value = content.location.house_no;
	postalCodeInput.value = content.location.postal_code;
	provinceInput.value = content.location.province;
	subDistrictInput.value = content.location.sub_district;
	villageInput.value = content.location.village_no;

	//student info
	yearSelect.value = content.student_info.year;

	phoneInput.value = content.phone_no;
	topicInput.value = content.topic;
	reasonTextarea.value = content.reason;

	//set file input from cloudinary
	const dt = new DataTransfer();
	const file = await getPetitionFile(sessionStorage.getItem("editID"));
	dt.items.add(file);
	fileInput.files = dt.files;
	updateFilename();
}
document.addEventListener("DOMContentLoaded", displayPetitionDataInForm);

/******************************************/

//function สำหรับอัพเดตชื่อไฟล์ข้างปุ่มอัพโหลดไฟล์
function updateFilename() {
	const fileInput = document.querySelector("#fileInput");
	const fileName = document.querySelector("#file-name");
	if (fileInput.files.length >= 1) {
		fileName.textContent = fileInput.files[0].name;
		fileName.href = window.URL.createObjectURL(fileInput.files[0]);
		fileName.target = "_blank";
		fileName.style.cursor = "grab";
		fileName.style.textDecoration = "underline";
		fileName.style.pointerEvents = "auto";
	} else {
		fileName.textContent = "No file choosen";
		fileName.href = "";
		fileName.style.cursor = "not-allowed";
		fileName.style.textDecoration = "none";
		fileName.style.pointerEvents = "none";
	}
}
fileUpload.addEventListener("change", updateFilename);
