import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));

const sheetId = "164L2UMb-T9noESkielSMdyBj3izEg2bDcv6oMysEZ9I";

app.get("/api/data", async (req, res) => {
    const sheetName = req.query.sheet;
    if (!sheetName) {
        return res.status(400).json({ error: "Sheet tidak dipilih" });
    }

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        const text = await response.text();

        // Pastikan string cukup panjang untuk di-parse
        if (text.length < 47) {
            throw new Error("Format data tidak valid");
        }

        const json = JSON.parse(text.substring(47, text.length - 2));
        res.json(json.table.rows);
    } catch (error) {
        console.error("❌ Error mengambil data:", error);
        res.status(500).json({ error: "Gagal mengambil data dari Google Sheets" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
