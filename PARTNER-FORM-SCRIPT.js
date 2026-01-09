/**
 * INSURIO - PARTNER APPLICATION FORM HANDLER
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "Insurio - Partner Applications"
 * 2. Go to Extensions > Apps Script
 * 3. Delete any code and paste this entire script
 * 4. Click Deploy > New Deployment > Web App
 * 5. Set "Execute as" = Me
 * 6. Set "Who has access" = Anyone
 * 7. Click Deploy and copy the Web App URL
 * 8. Paste that URL into your partners/index.html form action
 */

// YOUR EMAIL - CHANGE THIS TO YOUR EMAIL ADDRESS
const NOTIFICATION_EMAIL = "your-email@example.com"; // ← CHANGE THIS!

// Column headers for the spreadsheet
const HEADERS = [
  "Timestamp",
  "Name", 
  "Company",
  "Email",
  "Phone",
  "Role",
  "Notes",
  "Status"
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
      formData.company || "",
      formData.email || "",
      formData.phone || "",
      formData.role || "",
      formData.notes || "",
      "New" // Status - you can manually update this later
    ];
    
    // Add to spreadsheet
    sheet.appendRow(rowData);
    
    // Format the timestamp cell
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    
    // Highlight new applications in light yellow
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground("#fffbeb");
    
    // Send email notification
    sendEmailNotification(formData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Application submitted successfully!"
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
    company: params.company,
    email: params.email,
    phone: params.phone,
    role: params.role,
    notes: params.notes
  };
}

function sendEmailNotification(formData) {
  const subject = `🤝 New Partner Application - ${formData.name}`;
  
  // Determine if this is a high-priority application based on role
  const highPriority = ["mortgage-broker", "insurance-broker"].includes(formData.role);
  const priorityFlag = highPriority ? "⚡ HIGH PRIORITY" : "";
  
  const body = `
New partner application received from insurio.ca ${priorityFlag}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPLICANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${formData.name || "Not provided"}
Company: ${formData.company || "Not provided"}
Email: ${formData.email || "Not provided"}
Phone: ${formData.phone || "Not provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Role: ${getRoleLabel(formData.role)}
${highPriority ? "💡 This is a mortgage or insurance broker - high conversion potential!" : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADDITIONAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.notes || "No additional notes provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all applications: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

📋 NEXT STEPS:
1. Review application within 24 hours
2. Call to discuss partnership structure
3. Send partnership agreement if qualified
4. Set up in referral tracking system

⚡ Respond quickly to secure the partnership!
`;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

function getRoleLabel(role) {
  const roles = {
    "mortgage-broker": "Mortgage Broker",
    "insurance-broker": "P&C Insurance Broker",
    "realtor": "Real Estate Agent",
    "financial-planner": "Financial Planner",
    "other": "Other"
  };
  return roles[role] || role || "Not specified";
}

// For testing in Apps Script editor
function testDoPost() {
  const testEvent = {
    parameter: {
      name: "Test Broker",
      company: "Test Mortgage Co.",
      email: "broker@example.com",
      phone: "(403) 555-5678",
      role: "mortgage-broker",
      notes: "This is a test partner application"
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
