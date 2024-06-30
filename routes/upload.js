const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , { BlockBlobClient } = require('@azure/storage-blob')
    // , getStream = require('into-stream')
    , containerName = 'filesupload'
;

const handleError = (err, res) => {
    res.status(500);
    res.render('error', { error: err });
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

router.post('/', uploadStrategy, (req, res) => {

    const
          blobName = getBlobName(req.file.originalname)
        , blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING,containerName,blobName)
        , streamLength = req.file.buffer.length
    ;

    blobService.uploadStream(streamLength)
    .then(
        ()=>{
            res.render('success', { 
                message: 'File uploaded to Azure Blob storage.' 
            });
        }
    ).catch(
        (err)=>{
        if(err) {
            handleError(err,res);
            return;
        }
    })
});

module.exports = router;