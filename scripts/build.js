require('dotenv').config();
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const express = require("express");
const chokidar = require("chokidar");

const MODE = process.argv[2] || "json";

let loadSheet = null;
if (MODE === "sheet") {
  loadSheet = require("./sheets");
}

const VALID_TYPES = [
  "hero",
  "grid",
  "row",
  "single"
];

let CURRENT_FILE = "email";

function registerPartials() {
  const baseDir = path.join(__dirname, "../src");

  function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);

      if (fs.statSync(full).isDirectory()) return walk(full);

      if (file.endsWith(".hbs")) {
        const name = file.replace(".hbs", "");
        const content = fs.readFileSync(full, "utf8");
        Handlebars.registerPartial(name, content);
      }
    });
  }

  walk(baseDir);
}

function validate(data) {
  const warnings = [];
  const errors = [];

  if (!data.brand || !data.brand.logo) {
    errors.push("Missing brand logo (required for header)");
  }
  if (!data.brand || !data.brand.name) {
    warnings.push("Missing brand name (used as alt text for logo)");
  }
  if (!data.meta || !data.meta.preheader) {
    warnings.push("Missing preheader (important for email open rates)");
  }

  if (!data.sections || !Array.isArray(data.sections) || data.sections.length === 0) {
    errors.push("The campaign must have at least one section.");
  } else {
    data.sections.forEach((s, index) => {
      const sectionID = `Section #${index + 1} (${s.type})`;

      if (!VALID_TYPES.includes(s.type)) {
        errors.push(`Invalid type "${s.type}" at ${sectionID}`);
        return;
      }

      if (s.type === "hero") {
        if (!s.image && !s.image_url) errors.push(`${sectionID}: Hero image is missing.`);
      }

      if (["single", "row"].includes(s.type)) {
        if (!s.image_url) warnings.push(`${sectionID}: No image provided.`);
        if (!s.name) warnings.push(`${sectionID}: Title is missing.`);
      }

      if (s.type === "grid") {
        if (!s.items || s.items.length < 2) {
          warnings.push(`${sectionID}: Grid works best with at least 2 items.`);
        }
        if (s.items) {
          s.items.forEach((item, i) => {
            if (!item.image_url) warnings.push(`${sectionID} - Item ${i+1}: Missing image.`);
            if (!item.name) warnings.push(`${sectionID} - Item ${i+1}: Missing product name.`);
          });
        }
      }
    });
  }

  if (warnings.length > 0) {
    console.log("\n🟡 VALIDATION WARNINGS:");
    warnings.forEach(w => console.warn(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.log("\n🔴 VALIDATION ERRORS:");
    errors.forEach(e => console.error(`   - ${e}`));
    throw new Error("Build failed due to critical data errors.");
  }

  if (warnings.length === 0 && errors.length === 0) {
    console.log("🟢 Data validation passed!");
  }
}

function mapImage(item = {}) {
  return {
    url: item.image_url || item.image || "",
    alt: item.image_alt || item.name || ""
  };
}

function mapCTA(item = {}) {
  return {
    label: item.cta_label || "See more",
    url: item.cta_url || item.url || "#"
  };
}

function mapItem(item = {}) {
  return {
    name: item.name || item.title,
    url: item.url,
    image: mapImage(item),
    description: item.description,
    price: {
      current: item.price_current,
      old: item.price_old
    },
    cta: mapCTA(item)
  };
}

function mapHero(section) {
  return {
    image: {
      url: section.image,
      alt: section.image_alt || ""
    },
    url: section.link || "#"
  };
}

function renderPartial(name, data) {
  const template = Handlebars.compile(Handlebars.partials[name]);
  return template(data);
}

function renderSections(sections) {
  let html = "";

  sections.forEach(section => {

    switch (section.type) {

      case "hero":
        html += renderPartial("hero", mapHero(section));
        break;

      case "grid":
        for (let i = 0; i < (section.items || []).length; i += 2) {
          html += renderPartial("grid", {
            c1: mapItem(section.items[i]),
            c2: mapItem(section.items[i + 1] || {})
          });
        }
        break;

      case "row":
        html += renderPartial("row", {
          item: mapItem(section)
        });
        break;

      case "single":
        html += renderPartial("single", {
          item: mapItem(section)
        });
        break;
    }
  });

  return html;
}

async function getData() {
  if (MODE === "sheet") {
    return await loadSheet();
  }

  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/campaign.json"), "utf8")
  );
}

function minify(html) {
  return html.replace(/\n/g, "").replace(/\s+/g, " ").trim();
}

async function build() {
  try {
    registerPartials();

    const data = await getData();
    validate(data);

    const content = renderSections(data.sections);

    const template = Handlebars.compile(
      fs.readFileSync(
        path.join(__dirname, "../src/templates/main.hbs"),
        "utf8"
      )
    );

    const finalHTML = template({
      ...data,
      content
    });

    const output = minify(finalHTML);

    CURRENT_FILE = data.newsletter_id || "email";

    fs.writeFileSync(
      path.join(__dirname, `../dist/${CURRENT_FILE}.html`),
      output
    );

    console.log(`✅ Build complete: ${CURRENT_FILE}.html`);
  } catch (err) {
    console.error("❌ Build error:", err.message);
  }
}

function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;
    const url = `http://localhost:${PORT}`;

    app.use(express.static(path.join(__dirname, "../dist")));

    app.get("/", async (req, res) => {
        if (MODE === "sheet") {
            console.log(`[${new Date().toLocaleTimeString()}] Fetching latest data from Google Sheets...`);
            await build(); 
        }
        
        const filePath = path.join(__dirname, `../dist/${CURRENT_FILE}.html`);
        if (!fs.existsSync(filePath)) return res.send("⚠️ No build file found. Run build first.");
        res.sendFile(filePath);
    });

    app.listen(PORT, () => {
        console.log(`NEWSLETTER GENERATOR ACTIVE`);
        console.log(`Mode: ${MODE.toUpperCase()}`);
        console.log(`Preview: ${url}`);
        console.log(`\nInstructions:`);
        console.log(`- [Ctrl + Click] the link above to open in browser`);
        console.log(`- [F5] in browser to fetch latest data from Sheet`);
    });

    chokidar.watch([path.join(__dirname, "../src/**/*.hbs")]).on("change", async (path) => {
        console.log(`[${new Date().toLocaleTimeString()}] 🔄 Template change detected. Rebuilding...`);
        await build();
    });
}

(async () => {
    console.log("Building...");
    await build();
    startServer();
})();