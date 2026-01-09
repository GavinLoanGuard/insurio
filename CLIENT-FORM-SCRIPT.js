/**
 * INSURIO - CLIENT INQUIRY FORM HANDLER
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "Insurio - Client Inquiries"
 * 2. Go to Extensions > Apps Script
 * 3. Delete any code and paste this entire script
 * 4. Click Deploy > New Deployment > Web App
 * 5. Set "Execute as" = Me
 * 6. Set "Who has access" = Anyone
 * 7. Click Deploy and copy the Web App URL
 * 8. Paste that URL into your contact/index.html form action
 */

// YOUR EMAIL - CHANGE THIS TO YOUR EMAIL ADDRESS
const NOTIFICATION_EMAIL = "your-email@example.com"; // ← CHANGE THIS!

// Column headers for the spreadsheet
const HEADERS = [
  "Timestamp",
  "Name", 
  "Email",
  "Phone",
  "Age",
  "Mortgage Amount",
  "Coverage Interest",
  "Referrer",
  "Notes"
];

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if this is first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Parse form data
    const formData = parseFormData(e);
    
    // Prepare row data matching headers
    const rowData = [
      new Date(), // Timestamp
      formData.name || "",
      formData.email || "",
      formData.phone || "",
      formData.age || "",
      formData.mortgage_amount || "",
      formData.coverage_interest || "",
      formData.referrer || "",
      formData.notes || ""
    ];
    
    // Add to spreadsheet
    sheet.appendRow(rowData);
    
    // Format the timestamp cell
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    
    // Send email notification
    sendEmailNotification(formData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Form submitted successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error and return failure response
    console.error("Error:", error);
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseFormData(e) {
  const params = e.parameter;
  return {
    name: params.name,
    email: params.email,
    phone: params.phone,
    age: params.age,
    mortgage_amount: params.mortgage_amount,
    coverage_interest: params.coverage_interest,
    referrer: params.referrer,
    notes: params.notes
  };
}

function sendEmailNotification(formData) {
  const subject = `🏠 New Client Inquiry - ${formData.name}`;
  
  const body = `
New client inquiry received from insurio.ca

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${formData.name || "Not provided"}
Email: ${formData.email || "Not provided"}
Phone: ${formData.phone || "Not provided"}
Age: ${formData.age || "Not provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVERAGE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mortgage Amount: ${formData.mortgage_amount || "Not provided"}
Coverage Interest: ${formData.coverage_interest || "Not provided"}
Referred By: ${formData.referrer || "Direct"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADDITIONAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.notes || "No additional notes provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all inquiries: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

⚡ Follow up within 24 hours for best conversion rate!
`;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

// For testing in Apps Script editor
function testDoPost() {
  const testEvent = {
    parameter: {
      name: "Test User",
      email: "test@example.com",
      phone: "(403) 555-1234",
      age: "35",
      mortgage_amount: "500k-750k",
      coverage_interest: "Life",
      referrer: "Jane Smith",
      notes: "This is a test submission"
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
