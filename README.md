# ISP Customer Application Form (CAF) System

This is a responsive, web-based Customer Application Form for Uzaina Business India Pvt Ltd (DIGITEL).

## Features
- **Auto-generated Fields**: Customer ID and Date/Time.
- **Camera Integration**: Capture Photo, ID Proof, and Address Proof.
- **Digital Signature**: Touch-friendly signature pad.
- **Billing Calculation**: Automatic GST (18%) and Total calculation.
- **OTP Verification**: Simulated OTP flow.
- **PDF Generation**: Generates a professional PDF with all details and images.

## ⚠️ Important Note on Camera Access
To use the Camera features, the browser requires the site to be served over **HTTPS** or **localhost**. 
Opening the `index.html` file directly (file:// protocol) usually **blocks camera access** in modern browsers like Chrome.

### How to Run
1.  **Using VS Code Live Server (Recommended)**:
    - Open the project folder in VS Code.
    - Install the "Live Server" extension.
    - Right-click `index.html` and select "Open with Live Server".

2.  **Using Python**:
    - Open a terminal in the project directory.
    - Run: `python -m http.server 8000`
    - Open browser at: `http://localhost:8000`

3.  **Using Node.js**:
    - Run: `npx serve .`
    - Open the URL shown (usually `http://localhost:3000`).

## Google Drive Integration
The system is configured to **Auto Download** the generated PDF. You can then drag and drop this PDF into your designated "CAF - Uzaina Business India Pvt Ltd" Google Drive folder. Direct automated saving to Google Drive requires a backend server with OAuth authentication, which is outside the scope of this client-side application.
