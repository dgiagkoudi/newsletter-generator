# Newsletter Generator
[🇬🇷 Read this in Ελληνικά](./README_GR.md)

A newsletter automation tool for dynamically generating and managing HTML email campaigns. The application supports both Google Sheets API and local JSON data sources, transforming them into production-ready HTML emails using modular Handlebars components.

## Features

- Dynamic data sources: Google Sheets API (real-time) or Local JSON files
- Component-Based Architecture with Handlebars
- Automated Data Validation
- Accessibility fallback logic
- Live Preview Server with Express.js
- Hot Reloading using Chokidar
- Production-ready minified HTML output
- Modular email sections: Hero, Grid, Row, Single
- Google Sheets → Newsletter transformation pipeline
- Responsive email structure

## Tech Stack

Core
- Node.js
- Handlebars.js
- Express.js

APIs & Automation
- Google Sheets API v4
- Chokidar
- Dotenv

## Project Structure
```bash
root/
├── data/
│  # Data sources used to populate newsletter content
│  ├── campaign.json
│  └── campaign - Sheet1.csv
│
├── dist/
│  # Final production-ready HTML output
│  └── March2026.html
│
├── scripts/
│  # Build process, validation and external API automation scripts
│  ├── build.js
│  └── sheets.js
│
├── src/
│  └── components/
│  │  # Reusable UI components
│  │  ├── button.hbs
│  │  └── card.hbs
│
│  └── sections/
│  │  # Content layout blocks
│  │  ├── grid.hbs
│  │  ├── hero.hbs
│  │  ├── row.hbs
│  │  └── single.hbs
│
│  └── shared/
│  │  # Shared static template parts
│  │  ├── footer.hbs
│  │  └── header.hbs
│
│  └── templates/
│  │  # Main email layout template
│  │  └── main.hbs
```

## Local Setup

1. Clone repository

```bash
git clone https://github.com/dgiagkoudi/task-manager-auth.git

cd task-manager-auth
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```env
SPREADSHEET_ID=your_google_sheet_id
SHEET_NAME=Sheet1
PORT=3000
```

4. Google Sheets Setup
- Create a Google Cloud Service Account
- Download ```credentials.json```
- Place it in the root directory
- Share the Google Sheet with the Service Account email as Viewer

## Run Project

Live Preview using JSON data
```bash
npm run dev
```

Live Preview using Google Sheets
```bash
node scripts/build.js sheet
```

## Production Build

From JSON
```bash
npm run build
```

From Google Sheets
```bash
npm run build:sheet
```

## Output

Generated HTML files are stored inside: ```/dist```.

Output is:
- Minified
- Production-ready
- Optimized for email clients

## Usage

After building:

1. Open generated ```.html```
2. Copy the HTML code
3. Paste it into your email platform editor: Contact Pigeon, Mailchimp, Brevo etc.

## Validation System

The build process validates:

- Missing brand logo
- Missing preheader
- Invalid section types
- Missing images
- Missing titles
- Empty grids

Critical validation errors stop the build process.

## Supported Section Types

| Type | Description |
|---|---|
| hero | Large banner section |
| grid | Product grid layout |
| row | Horizontal product row |
| single | Single featured item |

## Future Improvements

- MJML Support
- Drag & Drop Builder
- Multi-language newsletters
- Template Marketplace
- Image Optimization Pipeline
- Email Testing Integration
- Deployment Pipeline

## License

This project is licensed under the MIT License.
