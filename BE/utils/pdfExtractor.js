const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractFromPDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);

  const text = data.text;

  const number = text.match(/Nomor :\s*(.+)/i)?.[1] || "not found";
  const title = text.match(/SURAT\s*(.+)/i)?.[1] || "not found";
  const title2 = text.match(/Tentang\s*([\s\S]*?)(?=\n)/i)?.[1] || "not found";

  if(title === "not found" && title2 !== "not found") {
    title = title2;
  }

  return { number, title };
};

module.exports = extractFromPDF;
