

// browser local to previous memory read
let priyojonList = JSON.parse(localStorage.getItem('priyojonList')) || [];
let eidiRecords = JSON.parse(localStorage.getItem('eidiRecords')) || [];

//Jegula run hobe
document.addEventListener("DOMContentLoaded", () => {
    initTheme();       // আগের থিম (ডার্ক/লাইট) সেট করবে
    populateYears();   // বছরের ড্রপডাউন ডাইনামিকলি তৈরি করবে
    updateDropdowns(); // প্রিয়জনদের নামের ড্রপডাউন লোড করবে
    renderAll();       // সব টেবিল ও ড্যাশবোর্ডের ডাটা স্ক্রিনে দেখাবে
});

// automatic dynamic logic[10years]
function populateYears() {
    const currentYear = new Date().getFullYear(); 
    const yearSelects = [
        document.getElementById('entry-year'),
        document.getElementById('filter-diyeche-year'),
        document.getElementById('filter-deyni-year')
    ];

    yearSelects.forEach(select => {
        if (!select) return;
        select.innerHTML = ""; 
        
        for (let i = 0; i <= 10; i++) {
            const year = currentYear + i;
            let opt = document.createElement('option');
            opt.value = year;
            opt.innerText = year;
            select.appendChild(opt);
        }
    });
}

// audio auto playback logic
function showSection(sectionId) {
    // screen hide
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active-section'));
    // screen show
    document.getElementById(sectionId).classList.add('active-section');
    
    // one to another tab audio off
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0; 
    });

    // dashboard audio
    if (sectionId === 'dashboard') {
        let dashboardAudio = document.getElementById('dashboard-audio');
        if (dashboardAudio) {
            dashboardAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    // priyojon audio
    if (sectionId === 'priyojon') {
        let priyojonAudio = document.getElementById('priyojon-audio');
        if (priyojonAudio) {
            priyojonAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    // data entry audio
    if (sectionId === 'data-entry') {
        let dataEntryAudio = document.getElementById('data-entry-audio');
        if (dataEntryAudio) {
            dataEntryAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    // diyeche kara audio
    if (sectionId === 'diyeche') {
        let diyecheAudio = document.getElementById('diyeche-audio');
        if (diyecheAudio) {
            diyecheAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    // deyni kara audio
    if (sectionId === 'dey-ni') {
        let deyniAudio = document.getElementById('deyni-audio');
        if (deyniAudio) {
            deyniAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    renderAll(); // data refresh
}

// Proyojon name entry
function addPriyojon() {
    let nameInput = document.getElementById('priyojon-name').value.trim();
    if(nameInput === "") return alert("দয়া করে একটি নাম লিখুন!");
    
    if(!priyojonList.includes(nameInput)) {
        priyojonList.push(nameInput);
        localStorage.setItem('priyojonList', JSON.stringify(priyojonList));
        document.getElementById('priyojon-name').value = "";
        updateDropdowns();
        renderAll();
    } else {
        alert("এই নাম অলরেডি তালিকায় আছে!");
    }
}

// data entry update
function updateDropdowns() {
    let select = document.getElementById('entry-name-select');
    if(!select) return;
    select.innerHTML = "";
    priyojonList.forEach(name => {
        let opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        select.appendChild(opt);
    });
}

// eidi update
function submitEidiEntry() {
    let name = document.getElementById('entry-name-select').value;
    let year = document.getElementById('entry-year').value;
    let eid = document.getElementById('entry-eid').value;
    let amount = parseFloat(document.getElementById('entry-amount').value);

    if(!name) return alert("আগে প্রিয়জন সেকশনে গিয়ে নাম এন্ট্রি করুন!");
    if(isNaN(amount) || amount <= 0) return alert("দয়া করে সঠিক টাকার পরিমাণ লিখুন!");

    let existingIndex = eidiRecords.findIndex(r => r.name === name && r.year === year && r.eid === eid);
    if(existingIndex > -1) {
        eidiRecords[existingIndex].amount = amount;
    } else {
        eidiRecords.push({ name, year, eid, amount });
    }

    localStorage.setItem('eidiRecords', JSON.stringify(eidiRecords));
    document.getElementById('entry-amount').value = "";
    alert("পইপই করে হিসাব খাতায় তোলা হলো! 📝");
    // showSection('dashboard'); // auto transfer
}

// all table update
function renderAll() {
    renderDashboard();
    renderPriyojonTable();
    renderDiyeche();
    renderDeyNi();
}

// dashboard calculation
function renderDashboard() {
    if(document.getElementById('dash-total-priyojon')) {
        document.getElementById('dash-total-priyojon').innerText = priyojonList.length;
        let total = eidiRecords.reduce((sum, record) => sum + record.amount, 0);
        document.getElementById('dash-total-amount').innerText = total;
    }
}

// priyojon list add
function renderPriyojonTable() {
    let tbody = document.getElementById('priyojon-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";
    priyojonList.forEach(name => {
        let totalForHim = eidiRecords.filter(r => r.name === name).reduce((sum, r) => sum + r.amount, 0);
        tbody.innerHTML += `<tr><td>${name}</td><td>${totalForHim} টাকা</td></tr>`;
    });
}

// jara tk diyeche tader alada kora
function renderDiyeche() {
    let year = document.getElementById('filter-diyeche-year').value;
    let eid = document.getElementById('filter-diyeche-eid').value;
    let tbody = document.getElementById('diyeche-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";

    let filtered = eidiRecords.filter(r => r.year === year && r.eid === eid);
    filtered.forEach(r => {
        tbody.innerHTML += `<tr><td>${r.name}</td><td>${r.amount} টাকা</td></tr>`;
    });
}

// jara tk dey nai tader alada kora
function renderDeyNi() {
    let year = document.getElementById('filter-deyni-year').value;
    let eid = document.getElementById('filter-deyni-eid').value;
    let tbody = document.getElementById('deyni-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";

    let givenNames = eidiRecords.filter(r => r.year === year && r.eid === eid).map(r => r.name);
    let notGivenNames = priyojonList.filter(name => !givenNames.includes(name));

    notGivenNames.forEach(name => {
        tbody.innerHTML += `<tr><td>${name}</td><td style="color:#e74c3c; font-weight:bold;">বাকি আছে ❌</td></tr>`;
    });
}

// theme , setting
function initTheme() {
    if (localStorage.getItem("poiPoiTheme") === "dark") document.body.classList.add("dark-theme");
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem("poiPoiTheme", document.body.classList.contains('dark-theme') ? "dark" : "light");
}

// data reset
function resetData() {
    if(confirm("পইপই খাতার সব ডাটা ডিলিট করতে চান? এই কাজ আর ফেরত আনা যাবে না!")) {
        localStorage.clear();
        alert("সব খাতা সাফ করা হয়েছে!");
        location.reload();
    }
}