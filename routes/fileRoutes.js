// const express = require('express');
// const { uploadFile, handleUpload } = require('../controller/fileController');
// const router = express.Router();

// router.post('/upload', uploadFile, handleUpload);

// module.exports = router;


const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

// Load environment variables
require('dotenv').config();

const router = express();
const upload = multer({ dest: 'uploads/' }); // Temp storage before upload to Azure

// Azure Blob Storage setup
const blobServiceClient = BlobServiceClient.fromConnectionString(`DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`);
const containerName = 'filesupload';

router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const blobName = path.basename(file.originalname);
    const filePath = file.path;

    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the file to Azure Blob Storage
        await blockBlobClient.uploadFile(filePath);

        // Remove the file from local storage
        fs.unlinkSync(filePath);

        res.send('File uploaded to Azure Blob Storage successfully');
    } catch (err) {
        console.error('Error uploading file to Azure Blob Storage:', err);
        res.status(500).send('Error uploading file');
    }
});

module.exports = router;

