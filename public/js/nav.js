//ใช้รับข้อมูล user ใน session
async function getUserInformation() {
	const userInfo = await fetch("/api/session", {
		headers: {},
	});
	return userInfo.json(); // return promise ของข้อมูล session ใน รูปแบบ JSON
}

// แสดงชื่อ user ข้างใต้ sidebar
async function displayUserInfomation() {
	const name = document.querySelector("#user-info-name span");
	const id = document.querySelector("#user-info-id");

	try {
		const info = await getUserInformation(); // เก็บข้อมูล user ที่ดึงมาจาก api/session

		name.textContent = info["displayname_th"];
		id.textContent = info["username"];
	} catch (e) {
		console.error(e);
		name.textContent = "เกิดข้อผิดพลาด";
		id.textContent = "เกิดข้อผิดพลาด";
	}
}

document.addEventListener("DOMContentLoaded", displayUserInfomation);
