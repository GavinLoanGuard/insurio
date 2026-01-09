# Google Sheets Form Integration Setup

## What This Does

✅ Client inquiries → "Insurio - Client Inquiries" Google Sheet  
✅ Partner applications → "Insurio - Partner Applications" Google Sheet  
✅ Instant email notifications for every submission  
✅ 100% free, unlimited submissions, no monthly fees  
✅ Full control of your data  

---

## Part 1: Set Up Client Inquiry Form (15 minutes)

### Step 1: Create the Google Sheet

1. Go to https://sheets.google.com
2. Click "+ Blank" to create new sheet
3. Rename it to: **"Insurio - Client Inquiries"**
4. Don't add any headers - the script will do this automatically

### Step 2: Add the Script

1. In your sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with some default code
3. **Delete all the default code**
4. Open the file `CLIENT-FORM-SCRIPT.js` from the zip
5. Copy ALL the code
6. Paste it into the Apps Script editor
7. **IMPORTANT:** On line 18, change `"your-email@example.com"` to your actual email
   ```javascript
   const NOTIFICATION_EMAIL = "gavin@yourcompany.com"; // ← YOUR EMAIL HERE
   ```

### Step 3: Deploy as Web App

1. Click the **Deploy** button (top right) → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** "Client Form Handler"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. You may need to authorize the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Insurio Client Form (unsafe)" - this is normal!
   - Click "Allow"
7. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABC123.../exec
   ```
8. Save this URL somewhere - you need it for the next step!

### Step 4: Update Your Contact Form

1. Open `contact/index.html` from the zip
2. Find line ~87 (search for `PLACEHOLDER`)
3. Replace the entire form tag:

**BEFORE:**
```html
<form id="quoteForm" action="https://formspree.io/f/PLACEHOLDER" method="POST">
```

**AFTER:**
```html
<form id="quoteForm" action="YOUR_WEB_APP_URL_HERE" method="POST">
```

4. Paste your actual Web App URL from Step 3
5. Save the file

### Step 5: Test It!

1. Upload your website files
2. Go to your contact page
3. Fill out the form and submit
4. Check:
   - ✅ Your Google Sheet - should have a new row
   - ✅ Your email - should have a notification
   - ✅ Browser shows success message

**If it doesn't work:** Check the script execution log in Apps Script (View → Executions)

---

## Part 2: Set Up Partner Application Form (10 minutes)

### Step 1: Create Second Google Sheet

1. Go to https://sheets.google.com
2. Click "+ Blank" to create new sheet
3. Rename it to: **"Insurio - Partner Applications"**

### Step 2: Add the Script

1. In your sheet, click **Extensions** → **Apps Script**
2. Delete all the default code
3. Open the file `PARTNER-FORM-SCRIPT.js` from the zip
4. Copy ALL the code and paste it
5. **IMPORTANT:** Change line 18 to your email:
   ```javascript
   const NOTIFICATION_EMAIL = "gavin@yourcompany.com"; // ← YOUR EMAIL HERE
   ```

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click gear icon → **Web app**
3. Configure:
   - **Description:** "Partner Form Handler"
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** (you may need to authorize again)
5. **COPY THE WEB APP URL**
6. Save it!

### Step 4: Update Your Partner Form

1. Open `partners/index.html`
2. Find line ~248 (search for `PLACEHOLDER`)
3. Replace:

**BEFORE:**
```html
<form id="partnerForm" action="https://formspree.io/f/PLACEHOLDER" method="POST">
```

**AFTER:**
```html
<form id="partnerForm" action="YOUR_PARTNER_FORM_WEB_APP_URL" method="POST">
```

4. Save the file

### Step 5: Test It!

1. Upload updated files
2. Go to /partners/ page
3. Fill out the form and submit
4. Check your sheet and email

---

## Bonus: Enhance Your Sheets

### For Client Inquiries Sheet:

**Add Status Column:**
1. Click on column J (after "Notes")
2. Right-click → Insert 1 column left
3. Name it "Status"
4. Create dropdown: Data → Data validation
5. Options: "New", "Contacted", "Quoted", "Won", "Lost"

**Add Follow-Up Date:**
1. Add column K: "Follow-Up Date"
2. Use formula in K2: `=A2+1` (next day)
3. Conditional formatting: Highlight overdue dates in red

**Add Lead Score:**
1. Add column L: "Lead Score"
2. Formula: Higher score for larger mortgages + urgent coverage

### For Partner Applications Sheet:

**Auto-Highlight Priority Partners:**
The script already highlights mortgage/insurance brokers in the email!

**Add Tracking Columns:**
- "Date Contacted"
- "Agreement Sent"
- "First Referral Date"
- "Total Referrals"
- "Commission Paid"

---

## Email Notification Details

### What You'll Get - Client Inquiry:

```
Subject: 🏠 New Client Inquiry - John Doe

New client inquiry received from insurio.ca

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: John Doe
Email: john@example.com
Phone: (403) 123-4567
Age: 35

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVERAGE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mortgage Amount: $500,000 - $750,000
Coverage Interest: Life + Critical Illness
Referred By: Sarah Smith - Calgary Mortgage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADDITIONAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking to finalize before renewal in 3 weeks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Follow up within 24 hours for best conversion rate!
```

### What You'll Get - Partner Application:

```
Subject: 🤝 New Partner Application - Jane Smith

⚡ HIGH PRIORITY

New partner application received from insurio.ca

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPLICANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: Jane Smith
Company: Calgary Home Loans
Email: jane@calgaryhomes.ca
Phone: (403) 987-6543

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Role: Mortgage Broker
💡 This is a mortgage broker - high conversion potential!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS:
1. Review application within 24 hours
2. Call to discuss partnership structure
3. Send partnership agreement if qualified
```

---

## Troubleshooting

### "Authorization required" error
→ You need to authorize the script in Apps Script
→ Click the link, choose your account, click "Allow"

### Form submits but nothing happens
→ Check the script deployment URL is correct in your HTML
→ Check Apps Script Executions log for errors (View → Executions)

### Not receiving emails
→ Check spam folder
→ Verify NOTIFICATION_EMAIL is correct in the script
→ Make sure you authorized Gmail permissions

### Sheet columns are wrong
→ Delete row 1 and resubmit a form - headers will be added automatically

### Getting CORS errors
→ Make sure "Who has access" is set to "Anyone" in deployment settings
→ Redeploy the script if you changed this

---

## Mobile Notifications (Optional)

### Get Push Notifications on Your Phone:

**Option 1: Gmail App**
- Install Gmail app on phone
- Enable push notifications
- You'll get instant alerts

**Option 2: Google Sheets App**
- Install Google Sheets app
- Set up notifications for sheet edits
- Get alerts when new rows added

**Option 3: Zapier (Free tier)**
- Connect Google Sheets to Slack/SMS
- Get notifications wherever you want
- 100 free tasks/month

---

## Privacy & Security

✅ **Data Ownership:** You own the data - it's in YOUR Google account  
✅ **Access Control:** Only you can see the sheets (unless you share them)  
✅ **PIPEDA Compliant:** You control data storage and access  
✅ **No Third Parties:** Data goes directly from form → your sheets  
✅ **Encrypted:** All data transmitted over HTTPS  

**Important:** Your Web App URL is public. Don't share it publicly or spammers could submit fake forms. The URL is only in your website form code.

---

## Backup Strategy

**Weekly Backup:**
1. File → Download → Microsoft Excel (.xlsx)
2. Save to computer or Dropbox

**Auto-Backup (Advanced):**
Use Apps Script to auto-email you weekly backup:
```javascript
function weeklyBackup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const blob = sheet.getAs('application/pdf');
  MailApp.sendEmail({
    to: "your-email@example.com",
    subject: "Weekly Insurio Leads Backup",
    body: "Attached is your weekly backup",
    attachments: [blob]
  });
}
// Set trigger: Edit → Current project's triggers → Add weekly
```

---

## Next Steps After Setup

1. ✅ Test both forms thoroughly
2. ✅ Set up email filters to label "Insurio Lead" automatically
3. ✅ Add your CRM email to forward lead notifications
4. ✅ Create response templates for quick follow-up
5. ✅ Set calendar reminder to check sheets daily

---

## Questions?

**Script Issues:** Check Apps Script execution log (View → Executions)  
**Form Issues:** Check browser console for errors (F12)  
**Email Issues:** Check spam folder first  

**Need Help?** Email the details of what's not working and any error messages you see.

---

**Estimated Setup Time:** 25-30 minutes total for both forms

**Cost:** $0/month forever

**Submission Limit:** Unlimited

✅ You're ready to capture leads directly to your own spreadsheets!
