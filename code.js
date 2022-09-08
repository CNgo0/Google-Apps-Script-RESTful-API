// This would be hosted on Google Apps Script side

function doGet(e) {
  let response = {
    code: 200,
    message: "Hello from Google Apps Script!"
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}