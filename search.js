document.addEventListener("DOMContentLoaded", async function () {
    let stkp = document.getElementById("stkp");
    let search = document.getElementById("search");
    let searchButton = document.getElementById("searchButton");
    let noInputMessage = document.getElementById("noInputMessage");

    fullData = await fetchAllData();

    stkp.addEventListener("change", function () {
        let isDisabled = !stkp.value;
        search.disabled = isDisabled;
        searchButton.disabled = isDisabled;
        noInputMessage.style.display = isDisabled ? "block" : "none";
    });

    searchButton.addEventListener("click", filterTable);
});

let fullData = [];

async function fetchAllData() {
    let apiURL = "https://for-search-a92vwma9h-rays-projects-a6349016.vercel.app/api/data";

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
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
        Disetujui: row.c[5]?.v || '-',
        Layanan: row.c[6]?.v || '-',
        Jabatan: row.c[7]?.v || '-',
        NIP: row.c[8]?.v || '-'
    };
}

async function filterTable() {
    let input = document.getElementById("search").value.toLowerCase().trim();
    let stkp = document.getElementById("stkp").value;
    let table = document.getElementById("dataTable");
    let tbody = table.querySelector("tbody");
    let noDataMessage = document.getElementById("noDataMessage");

    if (!stkp) {
        noDataMessage.innerText = "Pilih status kepegawaian terlebih dahulu!";
        noDataMessage.style.display = "block";
        table.style.display = "none";
        return;
    }

    if (!fullData || fullData.length === 0) {
        noDataMessage.innerText = "Data belum siap, coba lagi nanti!";
        noDataMessage.style.display = "block";
        table.style.display = "none";
        return;
    }

    let filteredData = fullData.filter(row => 
        row.NIP?.toLowerCase().includes(input) || row.Nama?.toLowerCase().includes(input)
    );

    if (filteredData.length === 0) {
        noDataMessage.innerText = "Data tidak ditemukan";
        noDataMessage.style.display = "block";
        table.style.display = "none";
        return;
    }

    noDataMessage.style.display = "none";
    table.style.display = "table";
    populateTable(filteredData);
}

function populateTable(data) {
    let tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

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
            <td>${row.NIP ? `<button onclick="viewProfile('${row.NIP}')">Lihat Profil</button>` : '-'}</td>
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
