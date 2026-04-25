# Newsletter Generator

Μια εφαρμογή αυτοματισμού για τη δυναμική δημιουργία και διαχείριση Email Newsletters. Το εργαλείο υποστηρίζει Google Sheets API ή τοπικά JSON δεδομένα και τα μετατρέπει σε production-ready HTML, χρησιμοποιώντας modular Handlebars components.

## Περιγραφή

Η εφαρμογή παρέχει:

- Δυναμική τροφοδοσία δεδομένων: Σύνδεση με Google Sheets (Real-time) ή τοπικό αρχείο JSON.
- Component-Based Architecture: Διαχωρισμός λογικής και παρουσίασης με χρήση .hbs αρχείων.
- Automated Validation: Σύστημα ελέγχου ορθότητας δεδομένων.
- Fallback Logic: Αυτόματη συμπλήρωση στοιχείων για καλύτερη προσβασιμότητα (Accessibility).
- Live Preview Server: Ενσωματωμένος Express server για άμεση προεπισκόπηση του email στον browser.
- Hot Reloading: Αυτόματη ανακατασκευή (rebuild) του HTML με τη χρήση Chokidar μόλις ανιχνευθεί αλλαγή στο template.
- Production-Ready Output: Παραγωγή minified HTML κώδικα στον φάκελο dist, βελτιστοποιημένου για email clients.

## Τεχνολογίες που χρησιμοποιήθηκαν

- Node.js
- Handlebars.js
- Express.js
- Google Sheets API v4
- Chokidar
- Dotenv

## Δομή φακέλων
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

## Τοπική εκτέλεση

1. Κλωνοποιήστε το repository.  
2. Εκτελέστε ```npm install``` για να εγκαταστήσετε τα απαραίτητα dependencies.  
3. Δημιουργήστε ένα αρχείο ```.env``` στο root και προσθέστε το ```SPREADSHEET_ID``` (το ID του Google Sheet από το URL).  
4. Τοποθετήστε το αρχείο ```credentials.json``` του Google Cloud στον αρχικό φάκελο.
5. (Google Sheets) Κάντε share το Google Sheet με το email του Service Account (Viewer).
6. Για Live Preview (Browser): Τρέξτε τον τοπικό server στο http://localhost:3000:
- Με τοπικά δεδομένα (JSON): ```npm run dev```
- Με δεδομένα από Google Sheets: ```node scripts/build.js sheet```
7. Για δημιουργία τελικού αρχείου (Build): Για να παραχθεί το στατικό HTML αρχείο στον φάκελο /dist:
- Με τοπικά δεδομένα: ```npm run build```
- Με δεδομένα Google Sheets: ```npm run build:sheet```
8. Χρήση: Μόλις ολοκληρωθεί το build, ανοίξτε το παραγόμενο αρχείο ```.html``` από τον φάκελο ```dist```, αντιγράψτε τον κώδικα και επικολλήστε τον στον HTML editor της πλατφόρμας αποστολής σας (π.χ. Contact Pigeon).
