import multer from 'multer'
import fs from 'node:fs'

const destination = './src/uploads/'

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})


const upload = multer({ storage: storage }).single('image')

export default upload