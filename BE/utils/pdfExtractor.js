const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractFromPDF = async (filePath, category) => {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  const text = data.text;

  let title;
  let number = "not found";
  let date;
  let matchDate;
  
  if (category === "Surat Permohonan") {
    const match = text.match(/Nomor\s*:\s*422\.5\/SDN-003\/05\/(\d{4}\/\d+)/)?.[1];
    const [year, numberLatter] = match.split("/");
    number = `Nomor ${numberLatter} Tahun ${year}`;
  } else {
    const match = text.match(/Nomor\s*:\s*422\/SDN-003\/05\/(.+)/i)?.[1];
    const [year, numberLatter] = match.split("/");
    number = `Nomor ${numberLatter}Tahun ${year}`;
  }

  if (category === "Surat Keputusan") {
    title = text.match(/Tentang\s*([\s\S]*?)(?=\n)/)?.[1] || "not found";
  } else if (category === "Surat Permohonan") {
    title = text.match(/Perihal\s+\t*:\s*(.+?)(?=\s*Kepada)/)?.[1] || "not found";
  } else {
    title = text.match(/SURAT\s*(.+)/)?.[1] || "not found";
  }

  const monthMap = {
    "Januari": "January",
    "Februari": "February",
    "Maret": "March",
    "April": "April",
    "Mei": "May",
    "Juni": "June",
    "Juli": "July",
    "Agustus": "August",
    "September": "September",
    "Oktober": "October",
    "November": "November",
    "Desember": "December"
  };

  if (category === "Surat Keputusan") {
    matchDate = text.match(/Pada Tanggal :\s*(.*)/)?.[1];
  } else {
    matchDate = text.match(/Bagan Batu Kota,\s*(\d{1,2}\s+\w+\s+\d{4})/)?.[1];
  }
  const dateParts = matchDate.split(" ");
  const day = parseInt(dateParts[0], 10);
  const monthName = dateParts[1];
  const year = parseInt(dateParts[2], 10);

  const monthEnglish = monthMap[monthName];
  const month = new Date(Date.parse(monthEnglish + " 1, 2021")).getMonth();
  date = new Date(year, month, day);
  console.log(date);

  return { number, title, date };
};

module.exports = extractFromPDF;
