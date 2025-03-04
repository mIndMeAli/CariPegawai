const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const sheetId = "164L2UMb-T9noESkielSMdyBj3izEg2bDcv6oMysEZ9I";

app.get("/data", async (req, res) => {
    const sheetName = req.query.sheet;
    if (!sheetName) return res.status(400).json({ error: "Sheet tidak dipilih" });

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));

        res.json(json.table.rows);
    } catch (error) {
        console.error("❌ Error mengambil data:", error);
        res.status(500).json({ error: "Gagal mengambil data" });
    }
});

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
