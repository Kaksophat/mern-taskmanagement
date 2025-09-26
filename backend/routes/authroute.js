const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddleware'); // Import the upload middleware


const {registerUser, loginUser, getUserProfile, updateUserProfile} = require('../controller/authcontroller');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect,getUserProfile);
router.put('/profile', protect,updateUserProfile);

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({ imageUrl });
});

module.exports = router;