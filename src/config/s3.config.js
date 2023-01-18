require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require('fs');

const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_KEY;
const secretAccessKey = process.env.AWS_SC_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  s3.getObject(downloadParams).createReadStream();
}


module.exports = {
  uploadFile,
  getFileStream
}