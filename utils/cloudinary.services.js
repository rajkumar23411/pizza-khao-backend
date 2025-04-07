const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});

const deleteLocalFile = async (localFilePath) => {
    if (!localFilePath) {
        throw new Error("Please provide the local file path");
    }

    try {
        await unlinkAsync(localFilePath);
    } catch (err) {
        console.error("Error unlinking file:", err);
        throw new Error("Problem while unlinking file");
    }
};

const cloudinaryServices = {
    async upload(localFilePath) {
        try {
            if (!localFilePath) {
                throw new Error("File path is required to upload");
            }

            const res = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            });

            if (!res) {
                throw new Error("Could not upload file to cloudinary");
            }

            return res.url;
        } catch (error) {
            console.log("Error while uploading file", error);
            throw new Error(error.message);
        } finally {
            await deleteLocalFile(localFilePath);
        }
    },
};

module.exports = cloudinaryServices;
