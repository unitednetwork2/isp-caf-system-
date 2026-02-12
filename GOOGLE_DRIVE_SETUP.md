# Google Drive Integration Setup Guide

Since this is a static website (HTML/JS), it cannot directly login to your Google Drive for security reasons. To allow **anyone** (customers) to upload files to **your** Google Drive, we will use a free **Google Apps Script** as a bridge.

## Step 1: Create the Google Apps Script
1.  Go to [script.google.com](https://script.google.com/) and sign in with your Google Account.
2.  Click **"New Project"**.
3.  Name the project "ISP CAF Uploader".
4.  Delete any code in the `Code.gs` file and paste the following code:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var folderName = "CAF - Uzaina Business India Pvt Ltd";
    
    // 1. Find or Create Folder
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // 2. Decode File Data (Base64)
    var contentType = data.mimeType || "application/pdf";
    var blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), contentType, data.fileName);
    
    // 3. Save File
    var file = folder.createFile(blob);
    
    // 4. Return Success
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "fileUrl": file.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 2: Deploy as a Web App
1.  Click the **Deploy** button (top right) > **New deployment**.
2.  Click the **Select type** gear icon > **Web app**.
3.  Fill in the details:
    *   **Description**: CAF Uploader
    *   **Execute as**: **Me** (your email) -> *Important! means it uses YOUR Drive storage.*
    *   **Who has access**: **Anyone** -> *Important! allows customers to use it without logging in.*
4.  Click **Deploy**.
5.  **Authorize Access**: It will ask for permission to access your Drive. Click "Review permissions", choose your account, and if you see "Google hasn't verified this app", click "Advanced" > "Go to ISP CAF Uploader (unsafe)" -> "Allow".

## Step 3: Copy the URL
Once deployed, copy the **Web App URL** (it starts with `https://script.google.com/macros/s/...`).

## Step 4: Update Your Website
1.  Open the `script.js` file in your project.
2.  Find the variable `const GOOGLE_SCRIPT_URL = "";` (or I will add it for you).
3.  Paste your Web App URL inside the quotes.
4.  Save and Push to GitHub.
