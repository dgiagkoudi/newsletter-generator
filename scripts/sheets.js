require('dotenv').config();
const { google } = require("googleapis");
const path = require("path");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

async function loadSheet() {

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:Z1000`
  });

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    throw new Error("Sheet is empty");
  }

  const headers = rows[0];

  const data = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });

  return transformToCampaign(data);
}

module.exports = loadSheet;

function transformToCampaign(rows) {

  const campaign = {
    newsletter_id: "March2026",
    meta: {
      preheader: "Sheet campaign",
      browser_url: "%ARCHIVEURL%",
      unsubscribe: "%UNSUBSCRIBEURL%"
    },
    brand: {
      name: "Brand",
      logo: "https://images.pexels.com/photos/5987200/pexels-photo-5987200.jpeg",
      url: "https://www.pexels.com/el-gr/photo/5987200/",
      info: "Some info about the brand"
    },
    social: {
    "facebook": "https://facebook.com/",
    "instagram": "https://instagram.com/",
    "youtube": "https://youtube.com/"
    },
    sections: []
  };

  let currentGrid = null;

  rows.forEach(row => {

    if (row.type === "hero") {
      campaign.sections.push({
        type: "hero",
        image: row.image_url,
        link: row.url
      });
    }

    if (row.type === "grid") {
      if (!currentGrid) {
        currentGrid = {
          type: "grid",
          items: []
        };
        campaign.sections.push(currentGrid);
      }

      currentGrid.items.push(mapRow(row));
    } else {
      currentGrid = null;
    }

    if (row.type === "row") {
      campaign.sections.push({
        type: "row",
        ...mapRow(row)
      });
    }

    if (row.type === "single") {
      campaign.sections.push({
        type: "single",
        ...mapRow(row)
      });
    }

  });

  return campaign;
}

function mapRow(row) {
  return {
    name: row.name,
    description: row.description,
    image_url: row.image_url,
    price_current: row.price_current,
    price_old: row.price_old,
    url: row.url,
    cta_label: row.cta_label,
    cta_url: row.cta_url
  };
}