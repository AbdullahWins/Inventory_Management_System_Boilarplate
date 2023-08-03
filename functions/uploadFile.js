// file uploader
const { generateUniqueFilename } = require("./generateUniqueFilename");
const { storage } = require("../storage/firebase.config");

const uploadFile = (files, folderName) => {
  return new Promise((resolve, reject) => {
    const bucketName = process.env.FIRE_STORAGE_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const uploadPromises = [];

    files.forEach((file) => {
      const uniqueFilename = generateUniqueFilename(file.originalname);
      const options = {
        destination: `${folderName}/${uniqueFilename}`,
        public: true,
      };

      const uploadPromise = new Promise((resolve, reject) => {
        bucket.upload(file.path, options, (err, uploadedFile) => {
          if (err) {
            reject(err);
          } else {
            const fileUrl = uploadedFile.publicUrl();
            resolve(fileUrl);
          }
        });
      });

      uploadPromises.push(uploadPromise);
    });

    Promise.all(uploadPromises)
      .then((urls) => {
        resolve(urls);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const uploadCategories = (file, folderName) => {
  return new Promise((resolve, reject) => {
    const bucketName = process.env.FIRE_STORAGE_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const uniqueFilename = generateUniqueFilename(file.originalname);
    const options = {
      destination: `${folderName}/${uniqueFilename}`,
      public: true,
    };
    bucket.upload(file.path, options, (err, uploadedFile) => {
      if (err) {
        reject(err);
      } else {
        const fileUrl = uploadedFile.publicUrl();
        resolve(fileUrl);
      }
    });
  });
};

module.exports = {
  uploadFile,
  uploadCategories,
};
