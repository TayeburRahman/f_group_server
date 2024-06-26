const multer = require("multer")
const path = require("path")


 


const UPLOADS_FOLDER = "./uploads/"



var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER)
  },
  filename: function (req, file, cb) {  
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext)
  }
})



var upload = multer({
  storage : storage,
  limits : {
    fileSize : 1024 * 1024 * 5
  },
  fileFilter: (req, file, callback) =>{ 
    console.log(file)
    if(
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" || 
      file.mimetype == "image/svg+xml" ||
      file.mimetype == "image/svg" ||
      file.mimetype == "image/icon" 
    ){
      callback(null, true);
    }else{
      callback(null, false);
    }
  },
  limits:{
      fileSize: 1024 * 1024 * 2
  }
}) 
 
  module.exports= upload 