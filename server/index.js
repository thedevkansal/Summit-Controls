// --- This MUST be the very first line of the file ---
require('dotenv').config();

// Import necessary packages
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import Google Sheets packages
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./credentials.json');

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

if (!JWT_SECRET || !GOOGLE_SHEET_ID) {
  console.error('FATAL ERROR: JWT_SECRET or GOOGLE_SHEET_ID is not defined in .env file.');
  process.exit(1);
}

// --- Mock Data (for login only) ---
const authorizedUsers = {
  'arav': 'password123',
  'priya': 'ecell@iiitr',
  'dev': 'hello123',
};

// --- Middleware ---
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// --- Helper Function to Access Sheet ---
async function getSheet() {
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadHeaderRow(); 
  return sheet;
}


// --- API Routes ---

// 1. Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (authorizedUsers[username] && authorizedUsers[username] === password) {
    const userPayload = { name: username };
    const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });
    res.json({ accessToken: accessToken, user: userPayload });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// 2. Get Participant by ID (Protected) - UPDATED
app.get('/api/participant/:id', authenticateToken, async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const participantId = req.params.id.trim().toLowerCase();
    
    const row = rows.find(r => r.get('Payment ID') && r.get('Payment ID').trim().toLowerCase() === participantId);

    if (row) {
      // **THE CHANGE**: Send back all the new fields
      res.json({
        id: row.get('Payment ID'),
        name: row.get('Name'),
        college: row.get('College'),
        gender: row.get('Gender'),
        contact: row.get('Contact No.'),
        accommodation: row.get('Accomodation'),
        passType: row.get('Pass type'),
        checkInStatus: row.get('Check-in Status') || 'Not Printed',
      });
    } else {
      res.status(404).json({ message: 'Participant not found' });
    }
  } catch (error) {
    console.error('Error in /api/participant/:id route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 3. Update Participant Check-in Status
app.put('/api/participant/:id/checkin', authenticateToken, async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const participantId = req.params.id.trim().toLowerCase();

    const row = rows.find(r => r.get('Payment ID') && r.get('Payment ID').trim().toLowerCase() === participantId);

    if (row) {
      row.set('Check-in Status', 'Printed');
      row.set('Checked-In By', req.user.name);
      row.set('Timestamp', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
      
      await row.save();
      
      res.json({ message: 'Check-in successful', name: row.get('Name') });
    } else {
      res.status(404).json({ message: 'Participant not found for check-in' });
    }
  } catch (error) {
    console.error('Error in /api/participant/:id/checkin route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 4. Get Check-in History
app.get('/api/participants', authenticateToken, async (req, res) => {
    try {
        const sheet = await getSheet();
        const rows = await sheet.getRows();
        
        const history = rows
          .filter(row => row.get('Check-in Status') === 'Printed')
          .map(row => ({
            id: row.get('Payment ID'),
            name: row.get('Name'),
            college: row.get('College'),
            checkedInBy: row.get('Checked-In By'),
            timestamp: row.get('Timestamp'),
          }));
          
        res.json(history);
    } catch (error) {
        console.error('Error in /api/participants route:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 5. Get Dashboard Stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    const total = rows.length;
    let checkedIn = 0;

    for (const row of rows) {
      if (row.get('Check-in Status') === 'Printed') {
        checkedIn++;
      }
    }

    const pending = total - checkedIn;

    res.json({
      total,
      checkedIn,
      pending,
    });
  } catch (error) {
    console.error('Error in /api/stats route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
