document.addEventListener("DOMContentLoaded", async function () {
    let stkp = document.getElementById("stkp");
    let search = document.getElementById("search");
    let searchButton = document.getElementById("searchButton");
    let noInputMessage = document.getElementById("noInputMessage");

    fullData = await fetchAllData();

    stkp.addEventListener("change", function () {
        search.disabled = !stkp.value;
        searchButton.disabled = !stkp.value;
        noInputMessage.style.display = stkp.value ? "none" : "block";
    });

    searchButton.addEventListener("click", filterTable);
});

let fullData = [];

async function fetchAllData() {
    let apiURL = "https://for-search-a92vwma9h-rays-projects-a6349016.vercel.app/api/data";

    try {
        let responses = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        let data = await response.json();
        fullData = data;

        console.log("✅ Data Gabungan:", data);
        return data;
    } catch (error) {
        console.error("❌ Error mengambil data:", error);
        return [];
    }
}

function convertRow(row) {
    return {
        Nomor: row.c[0]?.v || '-',
        NIK: row.c[1]?.v || '-',
        Nama: row.c[2]?.v || '-',
        "Unit Kerja": row.c[3]?.v || '-',
        Status: row.c[4]?.v || '-',
        Disetujui: row.c[1]?.v || '-',
        Layanan: row.c[6]?.v || '-',
        Jabatan: row.c[7]?.v || '-',
        NIP: row.c[8]?.v || '-'
    }
}

function enableSearch() {
    let stkp = document.getElementById("stkp");
    let search = document.getElementById("search");
    let searchButton = document.getElementById("searchButton");
    let noInputMessage = document.getElementById("noInputMessage");

    if (!stkp || !search || !searchButton || !noInputMessage) {
        console.warn("❌ Elemen tidak ditemukan!");
        return;
    }

    let isDisabled = stkp.value === "";
    search.disabled = isDisabled;
    searchButton.disabled = isDisabled;

    document.getElementById("search").disabled = isDisabled;
    document.getElementById("searchButton").disabled = isDisabled;

    noInputMessage.style.display = isDisabled ? "block" : "none";
}

function populateTable(data) {
    let table = document.getElementById("dataTable");
    let tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    if (!data.length) {
        document.getElementById("noDataMessage").style.display = "block";
        table.style.display = "none";
        return;
    }

    document.getElementById("noDataMessage").style.display = "none";
    table.style.display = "table";

    data.forEach((row, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.NIK || '-'}</td>
            <td>${row.Nama || '-'}</td>
            <td>${row["Unit Kerja"] || '-'}</td>
            <td>${row.Status || '-'}</td>
            <td>${row.Disetujui || '-'}</td>
            <td>${row.Layanan || '-'}</td>
            <td>${row.Jabatan || '-'}</td>
            <td>${row.NIP || '-'}</td>
            <td>
                ${row.NIP ? `<button onclick="viewProfile('${row.NIP}')">Lihat Profil</button>` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterTable() {
    let input = document.getElementById("search").value.toLowerCase().trim();
    let stkp = document.getElementById("stkp").value;
    let tbody = document.querySelector("#dataTable tbody");
    let table = document.getElementById("dataTable");
    let noDataMessage = document.getElementById("noDataMessage");

    if (!tbody || !table || !noDataMessage) {
        console.warn("❌ Elemen tabel tidak ditemukan!");
        return;
    }

    tbody.innerHTML = "";

    if (!stkp) {
        noDataMessage.style.display = "block";
        noDataMessage.innerText = "Pilih status kepegawaian terlebih dahulu!";
        table.style.display = "none";
        return;
    }

    if (!fullData || fullData.length === 0) {
        noDataMessage.style.display = "block";
        noDataMessage.innerText = "Data belum siap, coba lagi nanti!";
        table.style.display = "none";
        return;
    }

    let filteredData = fullData.filter(row =>
        row.NIP?.toLowerCase().includes(input) || row.Nama?.toLowerCase().includes(input)
    );

    if (input) {
        filteredData = filteredData.filter(row => 
            (row.NIP && row.NIP.toLowerCase().includes(input)) || 
            (row.Nama && row.Nama.toLowerCase().includes(input))
        );
    }

    if (filteredData.length === 0) {
        noDataMessage.style.display = "block";
        noDataMessage.innerText = "Data tidak ditemukan";
        table.style.display = "none";
        return;
    }

    noDataMessage.style.display = "none";
    table.style.display = "table";

    filteredData.forEach((row, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.NIK || '-'}</td>
            <td>${row.Nama || '-'}</td>
            <td>${row["Unit Kerja"] || '-'}</td>
            <td>${row.Status || '-'}</td>
            <td>${row.Disetujui || '-'}</td>
            <td>${row.Layanan || '-'}</td>
            <td>${row.Jabatan || '-'}</td>
            <td>${row.NIP || '-'}</td>
            <td>
                ${row.NIP ? `<button onclick="viewProfile('${row.NIP}')">Lihat Profil</button>` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function viewProfile(nip) {
    let profileData = fullData.find(row => row.NIP === nip);
    if (profileData) {
        alert(`
        📌 Profil Pegawai
        ===================
        Nama     : ${profileData.Nama ?? '-'}
        NIP      : ${profileData.NIP ?? '-'}
        Jabatan  : ${profileData.Jabatan ?? '-'}
        Status   : ${profileData.Status ?? '-'}
        `);
    } else {
        alert("Profil tidak ditemukan.");
    }
}
