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
  } else if (category === "Surat Pindah Keluar") {
    const match = text.match(/Nomor\:\s*422\/SDN-003\/02\/(.+)/)?.[1];
    const [year, numberLatter] = match.split("/");
    number = `Nomor ${numberLatter}Tahun ${year}`;
  } else {
    const match = text.match(/Nomor\s*:\s*422\/SDN-003\/05\/(.+)/i)?.[1];
    const [year, numberLatter] = match.split("/");
    number = `Nomor ${numberLatter}Tahun ${year}`;
  }

  if (category === "Surat Keputusan") {
    title = text.match(/TENTANG\s*([\s\S]*?)(?=\n)/)?.[1] || "not found";
    matchDate = text.match(/Pada Tanggal :\s*(.*)/)?.[1];
  } else if (category === "Surat Permohonan") {
    title = text.match(/Perihal\s+\t*:\s*(.+?)(?=\s*Kepada)/)?.[1] || "not found";
  } else {
    title = text.match(/SURAT\s*(.+)/)?.[1] || "not found";
    matchDate = text.match(/Bagan Batu Kota,\s*(\d{1,2}\s+\w+\s+\d{4})/)?.[1];
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

const removeStarsAndSpace = (input) => {
  return input.replace(/^\*\*\s*/, '');
};

const convertToDate = (input) => {
  const cleanedInput = removeStarsAndSpace(input);

  const monthMap = {
    "Januari": "January",
    "Februari": "February",
    "Febuari": "February",
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

  const parts = cleanedInput.trim().split(/\s+/);
  if (parts.length !== 3) {
    return null;
  }

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  const monthEnglish = monthMap[monthName];
  if (!monthEnglish || isNaN(day) || isNaN(year)) {
    return null;
  }

  const month = new Date(Date.parse(monthEnglish + " 1, 2021")).getMonth();
  return new Date(year, month, day);
};

module.exports = {
  extractFromPDF,
  removeStarsAndSpace,
  convertToDate
};
