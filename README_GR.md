# Newsletter Generator

Μια εφαρμογή αυτοματισμού για τη δυναμική δημιουργία και διαχείριση Email Newsletters. Το εργαλείο υποστηρίζει Google Sheets API ή τοπικά JSON δεδομένα και τα μετατρέπει σε production-ready HTML, χρησιμοποιώντας modular Handlebars components.

## Λειτουργίες

- Δυναμική τροφοδοσία δεδομένων μέσω: Google Sheets API (real-time) ή τοπικό αρχείο JSON
- Component-Based Architecture με Handlebars
- Automated Data Validation
- Fallback Logic για accessibility & missing fields
- Live Preview Server με Express.js
- Hot Reloading με Chokidar
- Παραγωγή production-ready & minified HTML
- Modular email sections: Hero, Grid, Row, Single
- Google Sheets → Newsletter transformation pipeline
- Responsive email layout structure

## Τεχνολογίες

Core
- Node.js
- Handlebars.js
- Express.js

APIs & Automation
- Google Sheets API v4
- Chokidar
- Dotenv

## Δομή Φακέλων
```bash
root/
├── data/
│  # Πηγές δεδομένων που τροφοδοτούν το περιεχόμενο του newsletter
│  ├── campaign.json
│  └── campaign - Sheet1.csv
│
├── dist/
│  # Το τελικό, production-ready HTML
│  └── March2026.html
│
├── scripts/
│  # Αυτοματισμοί για το build process, το validation και τη σύνδεση με εξωτερικά API
│  ├── build.js
│  └── sheets.js
│
├── src/
│  └── components/
│  │  # Επαναχρησιμοποιήσιμα UI στοιχεία
│  │  ├── button.hbs
│  │  └── card.hbs
│
│  └── sections/
│  │  # Δομικά blocks περιεχομένου
│  │  ├── grid.hbs
│  │  ├── hero.hbs
│  │  ├── row.hbs
│  │  └── single.hbs
│
│  └── shared/
│  │  # Σταθερά τμήματα του template
│  │  ├── footer.hbs
│  │  └── header.hbs
│
│  └── templates/
│  │  # O κεντρικός σκελετός του email
│  │  └── main.hbs
```

## Τοπική Εκτέλεση

1. Κλωνοποιήστε το repository

```bash
git clone https://github.com/dgiagkoudi/newsletter-generator.git
cd newsletter-generator
```

2. Εγκαταστήστε τις dependencies

```bash
npm install
```

3. Δημιουργήστε αρχείο `.env`

```env
SPREADSHEET_ID=your_google_sheet_id
SHEET_NAME=Sheet1
PORT=3000
```

4. Google Sheets Setup
- Δημιουργήστε Google Cloud Service Account
- Κατεβάστε το ```credentials.json```
- Τοποθετήστε το στο root directory
- Κάντε Share το Google Sheet με το Service Account email ως Viewer

## Εκτέλεση

Live Preview με JSON δεδομένα
```bash
npm run dev
```

Live Preview με Google Sheets
```bash
node scripts/build.js sheet
```

## Build Production HTML

Από JSON
```bash
npm run build
```

Από Google Sheets
```bash
npm run build:sheet
```

## Output

Το παραγόμενο HTML αποθηκεύεται στον φάκελο: ```/dist```.

Το αρχείο είναι:
- Minified
- Production-ready
- Optimized για email clients

## Χρήση

Μετά το build:

1. Ανοίξτε το παραγόμενο .html
2. Αντιγράψτε τον HTML κώδικα
3. Επικολλήστε τον στον email platform editor: Contact Pigeon, Mailchimp, Brevo κ.ά.

## Validation System

Το build process περιλαμβάνει validation για:

- Missing brand logo
- Missing preheader
- Invalid section types
- Missing images
- Missing titles
- Empty grids

Critical validation errors σταματούν το build process.

## Υποστηριζόμενα Section Types

| Type | Περιγραφή |
|---|---|
| hero | Large banner section |
| grid | Product grid layout |
| row | Horizontal product row |
| single | Single featured item |

## Μελλοντικές Βελτιώσεις

- MJML Support
- Drag & Drop Builder
- Multi-language newsletters
- Template Marketplace
- Image Optimization Pipeline
- Email Testing Integration
- Deployment Pipeline

## License

Το project διατίθεται με άδεια MIT License.
