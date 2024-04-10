const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/temp"),
    filename: (req, file, cb) => {
        const uniqueFileName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        cb(null, uniqueFileName);
    },
});

const upload = multer({
    storage,
    limits: { fieldSize: 1000000 * 5 },
}).single("file");

module.exports = upload;
