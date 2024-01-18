const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { getDatabase, ref, child, get } = require('firebase/database');
const { initializeApp } = require('firebase/app');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyBtbZTgxZ-0VYsdEfIvlkHwmk5Ak4d2XyM",
  authDomain: "kurudhi-6135d.firebaseapp.com",
  databaseURL: "https://kurudhi-6135d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kurudhi-6135d",
  storageBucket: "kurudhi-6135d.appspot.com",
  messagingSenderId: "78326000398",
  appId: "1:78326000398:web:1953cb2b173b882d87455f",
  measurementId: "G-3VRSYK6VLF"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const usersRef = ref(db, 'users'); // Adjust this if your data is stored in a different node

// Send bulk emails route
app.post('/send-bulk-emails', async (req, res) => {

  const {
    AttenderName,
    patentName,
    AttePhoneNumber,
   
    Unit,
    bloodRequiredDate,
    inputValue,
  } = req.body;

  try {
    const { city, bloodGroup } = req.body;
    const snapshot = await get(usersRef);
    const users = snapshot.val();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kurudhiofficial@gmail.com',
        pass: 'vutf jrjw bnpc jire',
      },
    });

    for (const userId in users) {
      const user = users[userId];
      const { fullName, city: userCity, bloodGroup: userBloodGroup, email } = user;

      if (userCity === city && userBloodGroup === bloodGroup) {
        const mailOptions = {
          from: 'noreply@kurudhi.com', // Replace with your Gmail email
          to: email,
          subject: 'Blood Request Notification From Kurudhi.com',
          html: `<!DOCTYPE html>
          <html lang="en">
          
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
              }
          
              .container {
                max-width: 600px;
                margin: 0 auto;
              }
          
              header {
                background-color: #222222;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
          
              header img {
                max-width: 100%;
                height: auto;
              }
          
              footer {
                background-color: #f6f6f6;
                padding: 20px;
                text-align: center;
              }
          
              footer p {
                margin: 0;
              }
          
              .content {
                padding: 20px;
              }
          
              .content p {
                margin-bottom: 15px;
              }
          
              ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
              }
          
              ul li {
                margin-bottom: 10px;
              }
            </style>
          </head>
          
          <body>
            <div class="container">
              <header>
                <img src="https://mcolfw.stripocdn.email/content/guids/CABINET_39254364a214f8068da04f2ed695900b7184bdb10d1b1fcfa5d66b206aab1e38/images/untitled2.png" alt="Logo">
              </header>
          
              <div class="content">
               
                <p>Dear ${fullName},</p>
                <p>You are requested to donate blood. Please consider helping.</p>
                
                <ul>
                  <li><strong>Patient Name:</strong> ${patentName}</li>
                  <li><strong>Attender Name:</strong> ${AttenderName}</li>
                  <li><strong>Attender Phone Number:</strong> ${AttePhoneNumber}</li>
                  <li><strong>Blood Group:</strong> ${bloodGroup}</li>
                  <li><strong>Units Required:</strong> ${Unit}</li>
                  <li><strong>Required Date:</strong> ${bloodRequiredDate}</li>
                </ul>
                <p>Best regards,<br>The Team of kurudhi.com</p>
              </div>
          
              <footer>
                <p>This message was sent from Bumble Bees IT Solutions, Chennai</p>
              </footer>
            </div>
          </body>
          
          </html>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    res.status(200).send('Blood request notifications sent successfully');
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).send('Internal server error');
  }
});


app.post('/sendMail', async (req, res) => {
  try {
    const { userEmail, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kurudhiofficial@gmail.com',
        pass: 'vutf jrjw bnpc jire',
      },
    });

    const mailOptions = {
      from: 'noreply@kurudhi.com',
      to: userEmail,
      subject: subject || 'Login Successful', // Using provided subject or a default one
      html: message,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

