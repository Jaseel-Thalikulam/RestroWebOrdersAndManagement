const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const s3 = require("./s3config");
const _ = require("lodash");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const uploadToCloud = async (req, ...rest) => {
    try {
        let [value, folderName] = rest;
        if (value === 2) {
            const params = _.get(req, "files", []).map((res) => {
                return {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${folderName}/${
                        uuidv4().toUpperCase().split("-").join("") +
                        Date.now() +
                        "." +
                        file.mimetype.split("/")[1]
                    }`,
                    ACL: "public-read",
                    Body: fs.createReadStream(res.path),
                };
            });
            const uploadCommand = new PutObjectCommand(params);
            await s3.send(uploadCommand);
            return params;
        } else {
            const file = req.file;
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${folderName}/${
                    Date.now() + "." + file.mimetype.split("/")[1]
                }`,
                ACL: "public-read",
                Body: fs.createReadStream(file.path),
            };
            const uploadFile = new PutObjectCommand(params);

            await s3.send(uploadFile);

            return params.Key;
        }
    } catch (err) {
        console.log(err);
    }
};

const deleteFileInLocal = (req, value = 1) => {
    try {
        if (value === 2) {
            _.get(req, "file.files", []).map((res) => {
                fs.unlinkSync(res.path);
            });
        } else {
            fs.unlinkSync(req.file.path);
            console.log("deleted");
        }
    } catch (err) {
        return err;
    }
};

const deleteFileInCloud = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
        };
        const deleteFile = new DeleteObjectCommand(params);
        await s3.send(deleteFile);
    } catch (err) {
        return err;
    }
};

const getUrl = (key) => {
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = {
    uploadToCloud,
    deleteFileInLocal,
    deleteFileInCloud,
    getUrl,
};
