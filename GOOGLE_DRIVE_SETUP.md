# Google Drive Integration Setup Guide

## Step 1: Create the Google Apps Script
1.  Go to [script.google.com](https://script.google.com/) and sign in.
2.  Click **"New Project"**.
3.  Name it "ISP CAF Uploader".
4.  Copy the code from the file `google_apps_script.js` in your project folder.
5.  Paste it into the `Code.gs` file in the script editor (delete any existing code).
6.  Save (Ctrl+S).

## Step 2: Deploy as Web App
1.  Click **Deploy** (top right) -> **New deployment**.
2.  Click the **Select type** (gear icon) -> **Web app**.
3.  **Description**: CAF Uploader.
4.  **Execute as**: **Me** (your email).
5.  **Who has access**: **Anyone** (Important!).
6.  Click **Deploy**.
7.  **Authorize**: Click "Review permissions", select your account. If you see "Google hasn't verified this app", click **Advanced** -> **Go to ISP CAF Uploader (unsafe)** -> **Allow**.

## Step 3: Connect to Form
1.  Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).
2.  Open `script.js` in your project.
3.  Find `const GOOGLE_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";`.
4.  Paste your URL inside the quotes.
5.  Save the file.

Done! Your form will now save PDFs to a Google Drive folder named "Uzaina Business India - Customer Data".
