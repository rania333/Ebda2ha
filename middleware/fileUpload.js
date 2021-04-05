const multer = require('multer');
exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        (cb(null, `uploads`)); //null y3ni no errors and uploads the name of folder which store in it
    },
    filename: (req, file, cb) => {
        //console.log(new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
        cb(null,new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
    }
});
exports.fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true); //y3nii accept l file da
    } else {
        cb(null, false);
    }
}
