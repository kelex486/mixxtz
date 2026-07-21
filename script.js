// Page Navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(pageName + '-page');
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    if (pageName === 'admin') {
        displayAdminEntries();
    }
    
    return false;
}

// Load data from localStorage
function loadEntries() {
    const data = localStorage.getItem('mixxtzEntries');
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveEntries(entries) {
    localStorage.setItem('mixxtzEntries', JSON.stringify(entries));
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    
    userForm.addEventListener('submit', function(e) {
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

        const entry = {
            id: Date.now(),
            mixxName: mixxName,
            yasPin: yasPin,
            timestamp: new Date().toLocaleString('sw-TZ')
        };

        let entries = loadEntries();
        entries.push(entry);
        saveEntries(entries);

        showSuccess('Taarifa ilisambazwa kwa mafanikio!');
        userForm.reset();

        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        }, 3000);
    });
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

function displayAdminEntries() {
    const entries = loadEntries();
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
                    <button class="btn-delete" onclick="deleteEntry(${entry.id})">Delete</button>
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

function deleteEntry(id) {
    if (confirm('Hakika unataka kufuta ingizo hili?')) {
        let entries = loadEntries();
        entries = entries.filter(entry => entry.id !== id);
        saveEntries(entries);
        displayAdminEntries();
    }
}

function clearAllEntries() {
    if (confirm('Hakika unataka kufuta ingizo lote? Hatua hii haiwezi kubadilishwa!')) {
        localStorage.removeItem('mixxtzEntries');
        displayAdminEntries();
        alert('Ingizo lote limefutwa');
    }
}

function exportData() {
    const entries = loadEntries();
    
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
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.addEventListener('load', function() {
    showPage('home');
});
