
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    updateDateTime();
    setInterval(updateDateTime, 1000);
    generateCustomerID();
    setupCalculations();
    setupSignaturePad();
    setupSameAddressCheckbox();
});

/* ===========================
   1. Auto-generated Fields
   =========================== */
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-IN');
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-IN');
}

function generateCustomerID() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const customerId = `UBI${randomNum}`;
    document.getElementById('customer-id').textContent = customerId;
    return customerId;
}

/* ===========================
   2. Billing Calculation
   =========================== */
function setupCalculations() {
    const baseAmountInput = document.getElementById('baseAmount');
    baseAmountInput.addEventListener('input', calculateTotal);
}

function calculateTotal() {
    const baseAmount = parseFloat(document.getElementById('baseAmount').value) || 0;
    const gstRate = 0.18;
    const gstAmount = baseAmount * gstRate;
    const totalAmount = baseAmount + gstAmount;

    document.getElementById('gstAmount').value = `₹${gstAmount.toFixed(2)}`;
    document.getElementById('totalAmount').value = `₹${totalAmount.toFixed(2)}`;
}

/* ===========================
   3. Camera & File Handling
   =========================== */
const streams = {}; // Store media streams to stop them later

async function startCamera(type) {
    try {
        const video = document.getElementById(`${type}-video`);
        const previewArea = document.getElementById(`${type}-preview`);

        // Hide other elements
        previewArea.querySelector('.placeholder-icon').classList.add('hidden');
        document.getElementById(`${type}-output`).classList.add('hidden');
        document.getElementById(`${type}-canvas`).classList.add('hidden');
        video.classList.remove('hidden');

        // Show buttons
        document.getElementById(`snap-${type}`).classList.remove('hidden');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        streams[type] = stream;

    } catch (err) {
        alert("Could not access camera: " + err.message);
    }
}

function capturePhoto(type) {
    const video = document.getElementById(`${type}-video`);
    const canvas = document.getElementById(`${type}-canvas`);
    const output = document.getElementById(`${type}-output`);

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Stop video stream
    const stream = streams[type];
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // Hide video, Show image
    video.classList.add('hidden');
    output.src = canvas.toDataURL('image/png');
    output.classList.remove('hidden');

    // Toggle buttons
    document.getElementById(`snap-${type}`).classList.add('hidden');
    document.getElementById(`retake-${type}`).classList.remove('hidden');
}

function retakePhoto(type) {
    startCamera(type);
    document.getElementById(`retake-${type}`).classList.add('hidden');
}

function handleFileUpload(input, type) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const output = document.getElementById(`${type}-output`);
            const video = document.getElementById(`${type}-video`);
            const placeholder = document.getElementById(`${type}-preview`).querySelector('.placeholder-icon');

            video.classList.add('hidden');
            placeholder.classList.add('hidden');
            output.src = e.target.result;
            output.classList.remove('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

/* ===========================
   4. Signature Pad
   =========================== */
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function setupSignaturePad() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill parent
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call

    // Event Listeners
    canvas.addEventListener('mousedown', (e) => startDrawing(e, canvas));
    canvas.addEventListener('mousemove', (e) => draw(e, canvas));
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0], canvas);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0], canvas);
    });
}

function startDrawing(e, canvas) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e, canvas) {
    if (!isDrawing) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function clearSignature() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ===========================
   5. Helper Functions
   =========================== */
function setupSameAddressCheckbox() {
    const checkbox = document.getElementById('sameAddress');
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('permAddress').value = document.getElementById('installAddress').value;
        } else {
            document.getElementById('permAddress').value = '';
        }
    });
}

/* ===========================
   6. OTP System
   =========================== */
let generatedOTP = null;

function sendOTP() {
    const mobile = document.getElementById('mobile').value;
    if (mobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number first.");
        return;
    }

    // Determine the OTP
    generatedOTP = Math.floor(1000 + Math.random() * 9000);

    // Simulate sending SMS (Keep alert for desktop)
    alert(`OTP sent to ${mobile}: ${generatedOTP}`);

    // Show Modal
    const modal = document.getElementById('otp-modal');
    modal.classList.remove('hidden');

    // For Demo/Testing: Show OTP inside the modal
    let demoMsg = document.getElementById('demo-otp-msg');
    if (!demoMsg) {
        demoMsg = document.createElement('p');
        demoMsg.id = 'demo-otp-msg';
        demoMsg.style.color = '#10b981'; // Success color
        demoMsg.style.fontWeight = 'bold';
        demoMsg.style.marginTop = '-10px';
        demoMsg.style.marginBottom = '10px';
        // Insert before the input field
        const inputField = document.getElementById('otp-input');
        inputField.parentNode.insertBefore(demoMsg, inputField);
    }
    demoMsg.textContent = `(Demo OTP Code: ${generatedOTP})`;
}

function closeModal() {
    document.getElementById('otp-modal').classList.add('hidden');
}

function verifyOTP() {
    const inputOTP = document.getElementById('otp-input').value;
    if (inputOTP == generatedOTP) {
        alert("Verified Successfully!");
        closeModal();
        document.getElementById('verify-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        alert("Invalid OTP. Please try again.");
    }
}

/* ===========================
   7. PDF Generation (Professional Version)
   =========================== */
document.getElementById('caf-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!document.getElementById('terms').checked) {
        alert("Please accept the Terms & Conditions.");
        return;
    }

    // Check Photos
    if (document.getElementById('photo-output').classList.contains('hidden')) {
        alert("Please capture or upload the Customer Photo.");
        return;
    }
    if (document.getElementById('id-output').classList.contains('hidden')) {
        alert("Please capture or upload the ID Proof.");
        return;
    }
    if (document.getElementById('address-output').classList.contains('hidden')) {
        alert("Please capture or upload the Address Proof.");
        return;
    }

    // Check Signature (Simple check: is the canvas empty?)
    const signaturePad = document.getElementById('signature-pad');
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = signaturePad.width;
    emptyCanvas.height = signaturePad.height;
    if (signaturePad.toDataURL() === emptyCanvas.toDataURL()) {
        alert("Please sign the application form.");
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
    submitBtn.disabled = true;

    try {
        // 1. Gather Data
        const formData = {
            customerId: document.getElementById('customer-id').textContent,
            date: document.getElementById('current-date').textContent,
            time: document.getElementById('current-time').textContent,
            fullName: document.getElementById('fullName').value,
            relativeName: document.getElementById('relativeName').value,
            mobile: document.getElementById('mobile').value,
            altMobile: document.getElementById('altMobile').value || "N/A",
            email: document.getElementById('email').value,
            installAddress: document.getElementById('installAddress').value,
            permAddress: document.getElementById('permAddress').value,
            planName: document.getElementById('planName').value,
            baseAmount: document.getElementById('baseAmount').value,
            gstAmount: document.getElementById('gstAmount').value,
            totalAmount: document.getElementById('totalAmount').value,
            photo: document.getElementById('photo-output').src,
            idProof: document.getElementById('id-output').src,
            addressProof: document.getElementById('address-output').src,
            signature: document.getElementById('signature-pad').toDataURL()
        };

        // 2. Build PDF Layout HTML
        const pdfContainer = document.getElementById('pdf-container');
        pdfContainer.innerHTML = `
            <div class="pdf-header" style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="pdf-logo" style="width: 100px;">
                        <img src="assets/logo.png" alt="Logo" style="width: 100%; max-height: 80px; object-fit: contain;">
                    </div>
                    <div class="pdf-company-details" style="text-align: center; flex: 1;">
                        <h1 style="color: #1e293b; font-size: 22px; margin: 0; text-transform: uppercase;">Uzaina Business India Pvt. Ltd.</h1>
                        <p style="margin: 5px 0 0; color: #475569; font-size: 10px;">
                            H.no:-41/40, Piller No BS/13, Sailaini chauraha old city bareilly, Pin code :- 243005
                        </p>
                        <p style="margin: 2px 0 0; color: #475569; font-size: 10px;">
                            <strong>Email:</strong> uzbinternet@gmaiil.com | <strong>Website:</strong> www.uzbinternet.com
                        </p>
                        <p style="margin: 2px 0 0; color: #475569; font-size: 10px;">
                            <strong>Mobile:</strong> 9027950075 | <strong>GSTIN:</strong> 09AABCU9685R1Z3
                        </p>
                    </div>
                     <div class="pdf-meta" style="text-align: right; font-size: 11px; min-width: 100px;">
                        <div><strong>CAF No:</strong> ${formData.customerId}</div>
                        <div><strong>Date:</strong> ${formData.date}</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                     <h2 style="font-size: 16px; margin: 0; color: #2563eb; letter-spacing: 1px;">CUSTOMER APPLICATION FORM</h2>
                </div>
            </div>

            <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">

            <div class="pdf-grid" style="display: flex; gap: 20px;">
                <div style="flex: 2;">
                    <h3 style="background: #f1f5f9; padding: 5px 10px; font-size: 14px; border-bottom: 2px solid #2563eb; margin-top: 0;">SUBSCRIBER INFORMATION</h3>
                    <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px; color: #64748b;">Full Name:</td>
                            <td style="padding: 5px; font-weight: bold;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; color: #64748b;">Father/Husband Name:</td>
                            <td style="padding: 5px; font-weight: bold;">${formData.relativeName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; color: #64748b;">Mobile Number:</td>
                            <td style="padding: 5px; font-weight: bold;">${formData.mobile}</td>
                        </tr>
                         <tr>
                            <td style="padding: 5px; color: #64748b;">Email ID:</td>
                            <td style="padding: 5px; font-weight: bold;">${formData.email}</td>
                        </tr>
                    </table>

                    <h3 style="background: #f1f5f9; padding: 5px 10px; font-size: 14px; border-bottom: 2px solid #2563eb; margin-top: 20px;">ADDRESS DETAILS</h3>
                    <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px; color: #64748b; vertical-align: top;">Installation Address:</td>
                            <td style="padding: 5px; font-weight: bold;">${formData.installAddress}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; color: #64748b; vertical-align: top;">Permanent Address:</td>
                            <td style="padding: 5px;">${formData.permAddress}</td>
                        </tr>
                    </table>
                </div>

                <div style="flex: 1; text-align: center;">
                   <div style="border: 1px solid #cbd5e1; height: 160px; width: 140px; margin: 0 auto; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc;">
                        ${formData.photo && formData.photo !== document.location.href ? `<img src="${formData.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : '<span style="color: #cbd5e1;">Photo</span>'}
                   </div>
                   <p style="font-size: 10px; margin-top: 5px;">Subscriber Photo</p>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <h3 style="background: #f1f5f9; padding: 5px 10px; font-size: 14px; border-bottom: 2px solid #2563eb; margin-top: 0;">PLAN & PAYMENT DETAILS</h3>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse; border: 1px solid #e2e8f0;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">Plan Name</th>
                        <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">Monthly Rental</th>
                        <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">GST (18%)</th>
                        <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">Total Amount</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #e2e8f0;">${formData.planName}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">₹${formData.baseAmount}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${formData.gstAmount}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${formData.totalAmount}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 20px; page-break-inside: avoid;">
                 <h3 style="background: #f1f5f9; padding: 5px 10px; font-size: 14px; border-bottom: 2px solid #2563eb; margin-top: 0;">DOCUMENTS SUBMITTED</h3>
                 <div style="display: flex; gap: 20px; margin-top: 10px;">
                    <div style="flex: 1; border: 1px dashed #cbd5e1; padding: 10px; text-align: center;">
                         <div style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; margin-bottom: 5px;">
                            ${formData.idProof && formData.idProof !== document.location.href ? `<img src="${formData.idProof}" style="max-width: 100%; max-height: 100%;">` : 'No ID Proof'}
                         </div>
                         <div style="font-size: 10px; font-weight: bold;">Identity Proof</div>
                    </div>
                    <div style="flex: 1; border: 1px dashed #cbd5e1; padding: 10px; text-align: center;">
                         <div style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; margin-bottom: 5px;">
                            ${formData.addressProof && formData.addressProof !== document.location.href ? `<img src="${formData.addressProof}" style="max-width: 100%; max-height: 100%;">` : 'No Address Proof'}
                         </div>
                         <div style="font-size: 10px; font-weight: bold;">Address Proof</div>
                    </div>
                 </div>
            </div>

            <div style="margin-top: 30px; page-break-inside: avoid;">
                <p style="font-size: 10px; text-align: justify; color: #64748b;">
                    <strong>Declaration:</strong> I hereby declare that the information provided above is true and correct. I have read and accepted the Terms & Conditions of Uzaina Business India Pvt Ltd.
                </p>
                
                <div style="display: flex; justify-content: space-between; margin-top: 40px; align-items: flex-end;">
                     <div style="text-align: center;">
                        <div style="border-bottom: 1px solid #000; width: 200px; padding-bottom: 5px;">
                            <img src="${formData.signature}" style="height: 40px;">
                        </div>
                        <div style="font-size: 11px; margin-top: 5px;">Signature of Subscriber</div>
                    </div>
                    
                    <div style="text-align: center;">
                        <div style="border-bottom: 1px solid #000; width: 200px; padding-bottom: 30px;">
                            <!-- Authorized Signatory Placeholder -->
                        </div>
                        <div style="font-size: 11px; margin-top: 5px;">Authorized Signatory<br>Uzaina Business India Pvt Ltd</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 9px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                This is a computer generated document. No physical signature required if digitally signed. | Generated on ${new Date().toLocaleString()}
            </div>
        `;

        // 3. Generate PDF
        const { jsPDF } = window.jspdf;

        // Wait for images to render in the hidden div (optional but safer)
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Page 1: The Form
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        // Page 2: Terms & Conditions
        pdf.addPage();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("TERMS AND CONDITIONS OF INTERNET SERVICE", pdfWidth / 2, 10, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        const margin = 10;
        const textWidth = pdfWidth - (margin * 2);
        let yPos = 20;
        const lineHeight = 3.5;

        const termsText = [
            "Uzaina Business India Pvt Ltd – DIGITEL Broadband Services",
            "1. The customer agrees to use DIGITEL broadband services only for lawful purposes and in compliance with Government of India regulations.",
            "2. The connection is provided for the registered address only and cannot be shifted without written request and approval.",
            "3. Monthly rental charges must be paid in advance before the due date. Delay in payment may result in suspension or disconnection of services.",
            "4. Installation charges, security deposit, and device charges (if any) are non-refundable unless otherwise specified in writing.",
            "5. In case of non-payment beyond 15 days of due date, DIGITEL reserves the right to terminate the connection without prior notice.",
            "6. The customer is responsible for safety and proper usage of ONU/Router and other equipment provided by DIGITEL.",
            "7. Any physical damage to company equipment will be charged to the customer.",
            "8. Speed may vary depending on network conditions, technical limitations, and external factors.",
            "9. DIGITEL shall not be responsible for service interruptions due to power failure, fiber cut, natural disasters, or technical issues beyond control.",
            "10. Shifting of connection is subject to feasibility and may attract shifting charges.",
            "11. Refund of security deposit (if applicable) will be processed after return of company equipment in good condition.",
            "12. The customer agrees to allow authorized company representatives for maintenance or inspection if required.",
            "13. The connection cannot be resold or shared commercially without written permission.",
            "14. Customer KYC documents must be genuine. Providing false documents may lead to legal action and immediate termination.",
            "15. All disputes shall be subject to jurisdiction of local courts.",
            "16. The customer confirms that all information provided in this CAF is true and correct."
        ];

        termsText.forEach(paragraph => {
            const splitText = pdf.splitTextToSize(paragraph, textWidth);
            pdf.text(splitText, margin, yPos);
            yPos += (splitText.length * lineHeight) + 2; // Add spacing between paragraphs
        });

        // Footer on Page 2
        pdf.setFontSize(8);
        pdf.text("I have read and understood the terms and conditions.", margin, pdfHeight - 20);

        // Add Signature to Page 2
        if (formData.signature) {
            pdf.addImage(formData.signature, 'PNG', margin, pdfHeight - 15, 40, 10);
            pdf.text("Subscriber Signature", margin, pdfHeight - 3);
        }

        // Generate Filename: CAF_Name_Date.pdf
        const sanitizedName = formData.fullName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
        const sanitizedDate = formData.date.replace(/\//g, "-"); // 11/02/2026 -> 11-02-2026
        const fileName = `CAF_${sanitizedName}_${sanitizedDate}.pdf`;
        // Save locally
        try {
            pdf.save(fileName);
        } catch (e) {
            console.error("Local save failed", e);
        }

        // Upload to Google Drive
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> Uploading to Drive...';

        const pdfBlob = pdf.output('blob');

        // Add timeout to the upload process (e.g., 30 seconds)
        const uploadPromise = uploadToGoogleDrive(pdfBlob, fileName);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Upload timed out (30s)")), 30000)
        );

        await Promise.race([uploadPromise, timeoutPromise]);

        alert("CAF Generated & Downloaded Successfully!");

    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Configuration: User must replace this URL after deploying the script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6i-1ozUMHuQIwCryEgiDjKhzH4Rgx1_Gv-B9eLjcQZAJJmT3fUQKkJJJgLh6W0NRt/exec";

async function uploadToGoogleDrive(blob, fileName) {
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
        console.warn("Google Drive upload skipped: Script URL not configured.");
        return; // Skip if not configured
    }

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
        reader.onloadend = async function () {
            const base64Data = reader.result.split(',')[1];

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // 'no-cors' is required for Google Apps Script simple triggers
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileData: base64Data,
                        fileName: fileName,
                        mimeType: 'application/pdf'
                    })
                });

                // Note: with 'no-cors', we can't read the response status, 
                // but if it doesn't throw network error, it likely worked.
                console.log("Upload request sent to Google Drive.");
                resolve();
            } catch (e) {
                console.error("Upload failed", e);
                alert("Failed to upload to Google Drive: " + e.message);
                resolve(); // Don't block the UI
            }
        };
    });
}
