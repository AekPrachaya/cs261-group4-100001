function fetchAndUpdate() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        console.error('User not logged in or missing username');
        return;
    }

    fetch('/api/petition/get_all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: user.username,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched petition data:', data);

            if (Array.isArray(data.data)) {
                // Arrays to hold petitions based on status
                const approved = [];
                const inProgress = [];
                const awaitingAction = [];
                const awaitingDocuments = [];
                const denied = [];

                data.data.forEach(petition => {
                    console.log('Processing petition:', petition); // Log each petition
                    switch (petition.status) {
                        case 'approved':
                            approved.push(petition);
                            break;
                        case 'pending':
                            inProgress.push(petition);
                            break;
                        case 'awaiting_action':
                            awaitingAction.push(petition);
                            break;
                        case 'awaiting_documents':
                            awaitingDocuments.push(petition);
                            break;
                        case 'denied':
                            denied.push(petition);
                            break;
                        default:
                            console.warn(`Unknown petition status: ${petition.status}`);
                    }
                });

                // Update tabs
                window.petitionStatus = {
                    approved,
                    inProgress,
                    awaitingAction,
                    awaitingDocuments,
                    denied,
                    all: data.data,
                };

                // Display all by default
                updatePetitionStatus('ทั้งหมด', data.data);
            } else {
                console.error('No petitions found or incorrect data format');
            }
        })
        .catch(error => console.error('Error fetching petition data:', error));
}

function updatePetitionStatus(statusLabel, petitions) {
    const container = document.querySelector('.requests-container');
    if (!container) {
        console.warn('No requests container found!');
        return;
    }
    container.innerHTML = '';
    if (petitions.length > 0) {
        petitions.forEach(petition => {
            const petitionCard = document.createElement('div');
            petitionCard.classList.add('request-card');

            petitionCard.innerHTML = `
                <div class="request-content">
                    <p class="request-title">${petition.type}</p>
                </div>
                <div class="request-actions">
                    <button class="edit-btn">แก้ไข</button>
                    <button class="delete-btn">ยกเลิก</button>
                </div>
            `;

            container.appendChild(petitionCard);
        });
    } else {
        container.innerHTML = '';
    }
}

// tab switching
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
        const status = tab.dataset.tab;

        // Clear active state for tabs
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update title
        const title = document.querySelector('.requests-title');
        title.textContent = tab.textContent;

        // Update petitions based on selected tab
        switch (status) {
            case 'all':
                updatePetitionStatus('ทั้งหมด', window.petitionStatus.all);
                break;
            case 'in-progress':
                updatePetitionStatus('อยู่ระหว่างดำเนินการ', window.petitionStatus.inProgress);
                break;
            case 'waiting':
                updatePetitionStatus('รอดำเนินการ', window.petitionStatus.awaitingAction);
                break;
            case 'documents':
                updatePetitionStatus('รอเอกสาร', window.petitionStatus.awaitingDocuments);
                break;
            case 'rejected':
                updatePetitionStatus('ปฏิเสธคำร้อง', window.petitionStatus.denied);
                break;
            case 'completed':
                updatePetitionStatus('อนุมัติแล้ว', window.petitionStatus.approved);
                break;
            default:
                console.warn('Unknown tab selected');
        }
    });
});

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndUpdate);

