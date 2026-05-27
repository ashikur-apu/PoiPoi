// browser local to previous memory read
let priyojonList = JSON.parse(localStorage.getItem('priyojonList')) || [];
let eidiRecords = JSON.parse(localStorage.getItem('eidiRecords')) || [];

// Jegula run hobe
document.addEventListener("DOMContentLoaded", () => {
    initTheme();       // Theme set
    populateYears();   // dynamicaly make
    updateDropdowns(); // priyojon dropdown load
    setupDropdownListeners(); // dropdown load
    setupHeaderDropdowns();   // ক্লিক টু টগল লজিক লোড
    renderAll();       // single screen data
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

// drown automation update
function setupDropdownListeners() {
    const dropdowns = [
        document.getElementById('entry-name-select'),
        document.getElementById('entry-year'),
        document.getElementById('entry-eid'),
        document.getElementById('filter-diyeche-year'),
        document.getElementById('filter-diyeche-eid'),
        document.getElementById('filter-deyni-year'),
        document.getElementById('filter-deyni-eid')
    ];

    dropdowns.forEach(select => {
        if (!select) return;
        select.addEventListener('change', () => {
            select.blur(); 
            renderAll();   
        });
    });
}

// মোবাইল এবং পিসিতে ক্লিক করে Hisab/Setting মেনু ওপেন-ক্লোজ করার লজিক
function setupHeaderDropdowns() {
    const dropbtns = document.querySelectorAll('.dropbtn');
    
    dropbtns.forEach(btn => {
        // আগের কোনো ইভেন্ট লিসেনার থাকলে তা রিমুভ করার জন্য এই ট্রিক
        btn.onclick = (e) => {
            toggleDropdown(e);
        };
    });

    document.onclick = () => {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('show-dropdown');
        });
        document.querySelectorAll('.dropbtn').forEach(btn => {
            btn.classList.remove('active-btn');
        });
    };
}

// HTML এবং JS উভয় জায়গা থেকে আসা ক্লিক হ্যান্ডেল করার মেইন ফাংশন
function toggleDropdown(event) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const currentContent = btn.nextElementSibling;
    
    // বাকি সব খোলা ড্রপডাউন বন্ধ করা
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content !== currentContent) content.classList.remove('show-dropdown');
    });
    document.querySelectorAll('.dropbtn').forEach(b => {
        if (b !== btn) b.classList.remove('active-btn');
    });

    // কারেন্ট মেনু টগল করা
    currentContent.classList.toggle('show-dropdown');
    btn.classList.toggle('active-btn');
}

// audio auto playback logic
function showSection(sectionId) {
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('show-dropdown');
    });
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active-btn');
    });

    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(sectionId).classList.add('active-section');
    
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0; 
    });

    if (sectionId === 'dashboard') {
        let dashboardAudio = document.getElementById('dashboard-audio');
        if (dashboardAudio) {
            dashboardAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    if (sectionId === 'priyojon') {
        let priyojonAudio = document.getElementById('priyojon-audio');
        if (priyojonAudio) {
            priyojonAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    if (sectionId === 'data-entry') {
        let dataEntryAudio = document.getElementById('data-entry-audio');
        if (dataEntryAudio) {
            dataEntryAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    if (sectionId === 'diyeche') {
        let diyecheAudio = document.getElementById('diyeche-audio');
        if (diyecheAudio) {
            diyecheAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    if (sectionId === 'dey-ni') {
        let deyniAudio = document.getElementById('deyni-audio');
        if (deyniAudio) {
            deyniAudio.play().catch(error => console.log("অটো-প্লে ব্লকড:", error));
        }
    }

    renderAll(); 
}

// Proyojon name entry
function addPriyojon() {
    let nameInput = document.getElementById('priyojon-name').value.trim();
    if(nameInput === "") return alert("দয়া করে একটি নাম লিখুন!");
    
    if(!priyojonList.includes(nameInput)) {
        priyojonList.push(nameInput);
        localStorage.setItem('priyojonList', JSON.stringify(priyojonList));
        document.getElementById('priyojon-name').value = "";
        updateDropdowns();
        renderAll();
    } else {
        alert("এই নাম অলরেডি তালিকায় আছে!");
    }
}

// data entry update
function updateDropdowns() {
    let select = document.getElementById('entry-name-select');
    if(!select) return;
    select.innerHTML = "";
    
    let defaultOpt = document.createElement('option');
    defaultOpt.value = "";
    defaultOpt.innerText = "-- নাম সিলেক্ট করুন --";
    select.appendChild(defaultOpt);

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

    if(!name) return alert("দয়া করে একজন প্রিয়জনের নাম সিলেক্ট করুন!");
    if(isNaN(amount) || amount <= 0) return alert("দয়া করে সঠিক টাকার পরিমাণ লিখুন!");

    let existingIndex = eidiRecords.findIndex(r => r.name === name && r.year === year && r.eid === eid);
    if(existingIndex > -1) {
        eidiRecords[existingIndex].amount = amount;
    } else {
        eidiRecords.push({ name, year, eid, amount });
    }

    localStorage.setItem('eidiRecords', JSON.stringify(eidiRecords));
    document.getElementById('entry-amount').value = "";
    document.getElementById('entry-name-select').value = ""; 
    alert("পইপই করে হিসাব খাতায় তোলা হলো! 📝");
    renderAll();
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
    let yearSelect = document.getElementById('filter-diyeche-year');
    let eidSelect = document.getElementById('filter-diyeche-eid');
    let tbody = document.getElementById('diyeche-table-body');
    
    if(!yearSelect || !eidSelect || !tbody) return;
    
    let year = yearSelect.value;
    let eid = eidSelect.value;
    tbody.innerHTML = "";

    let filtered = eidiRecords.filter(r => r.year === year && r.eid === eid);
    filtered.forEach(r => {
        tbody.innerHTML += `<tr><td>${r.name}</td><td>${r.amount} টাকা</td></tr>`;
    });
}

// jara tk dey nai tader alada kora
function renderDeyNi() {
    let yearSelect = document.getElementById('filter-deyni-year');
    let eidSelect = document.getElementById('filter-deyni-eid');
    let tbody = document.getElementById('deyni-table-body');
    
    if(!yearSelect || !eidSelect || !tbody) return;
    
    let year = yearSelect.value;
    let eid = eidSelect.value;
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
        alert("সব খাতা সাফ করা হয়েছে!");
        location.reload();
    }
}