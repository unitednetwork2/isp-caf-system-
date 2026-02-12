function doPost(e) {
    // 1. Configuration
    var mainFolderName = "Uzaina Business India - Customer Data";
    var savePdf = true; // Set to false if you don't want to save PDFs

    // -------------------------------------------------------------

    // Default response (cors friendly)
    var response = {
        "status": "success",
        "message": "Data received"
    };

    try {
        // 2. Parse the incoming data
        if (!e.postData || !e.postData.contents) {
            throw new Error("No data found in request");
        }

        var data = JSON.parse(e.postData.contents);
        var fileName = data.fileName || "Unknown_File.pdf";
        var fileData = data.fileData; // Base64 string
        var mimeType = data.mimeType || "application/pdf";

        // 3. Get or Create Folder
        var folderId = getFolderId(mainFolderName);
        var folder = DriveApp.getFolderById(folderId);

        // 4. Create File from Base64
        if (savePdf && fileData) {
            var blob = Utilities.newBlob(Utilities.base64Decode(fileData), mimeType, fileName);
            var file = folder.createFile(blob);
            response.fileUrl = file.getUrl();
            response.fileId = file.getId();
        }

    } catch (error) {
        response.status = "error";
        response.message = error.toString();
        Logger.log(error);
    }

    // 5. Return JSON Output
    return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to find or create folder
function getFolderId(folderName) {
    var folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
        return folders.next().getId();
    } else {
        return DriveApp.createFolder(folderName).getId();
    }
}
