const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { Room, Package } = require('../db/db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/room'); // Specify the destination directory
    },
    filename: function (req, file, cb) {
        // Use the MongoDB document ID as part of the filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const packageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/package'); // Specify the destination directory
    },
    filename: function (req, file, cb) {
        // Use the MongoDB document ID as part of the filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const packageUpload = multer({ storage: packageStorage });

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/dashboard', async function (req, res) {
    try {
        const rooms = await Room.find({});
        const packages = await Package.find({});
        res.render('admin/admin', { user: req.session.user, rooms, packages });
    } catch (error) {
        console.error("Error fetching dashboard data", error);
        res.status(500).send("Error fetching dashboard data");
    }
});

router.get('/add-room', async function (req, res) {
    res.render('admin/room');
});

router.post('/add-room', upload.array('roomImages', 5), async function (req, res) {
    const roomName = req.body.roomName;
    const roomImages = req.files.map(file => file.filename);
    const price = req.body.price;
    const description = req.body.description;
    const facilities = req.body.facilities;

    try {
        const newRoom = new Room({
            name: roomName,
            images: roomImages,
            price: price,
            description: description,
            facilities: facilities
        });
        await newRoom.save();
        console.log('Room added:', newRoom);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).send('Error adding room');
    }
});

router.get('/add-package', async function (req, res) {
    res.render('admin/add-package');
});

router.post('/add-package', packageUpload.single('packageImage'), async function (req, res) {
    const packageName = req.body.packageName;
    const location = req.body.location;
    const packageImage = req.file.filename;
    try {
        const newPackage = new Package({
            packageName: packageName,
            location: location,
            images: packageImage
        });
        await newPackage.save();
        console.log('New package added:', newPackage);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error adding package:', error);
        res.status(500).send('Error adding package');
    }
});

router.get('/edit-room/:id', async function (req, res) {
    const roomId = req.params.id;
  
    try {
        const room = await Room.findById(roomId);


        res.render('admin/edit-room', { room: room});
    } catch (error) {
        console.error('Error fetching room for editing:', error);
        res.status(500).send('Error fetching room for editing');
    }
});

router.post('/update-room/:id', upload.single('roomImages'), async function (req, res) {
    const roomId = req.params.id;
    const updatedName = req.body.roomName;
    const updatedPrice = req.body.price;
    const updatedFacilities = req.body.facilities;
    const updatedDescription = req.body.description;

    try {
        let updatedRoomData = {
            name: updatedName,
            price: updatedPrice,
            facilities: updatedFacilities,
            description: updatedDescription
        };

        // Check if a file was uploaded
        if (req.file) {
            // If a file was uploaded, add its filename to the updated room data
            updatedRoomData.images = req.file.filename;
        }

        // Update the room data in the database
        await Room.findByIdAndUpdate(roomId, updatedRoomData);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).send('Error updating room');
    }
});


router.post('/delete-room/:id', async function (req, res) {
    const roomId = req.params.id;
    try {
        await Room.findByIdAndDelete(roomId);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).send('Error deleting room');
    }
});



router.post('/delete-package/:id', async function (req, res) {
    const packageId = req.params.id;
    try {
        await Package.findByIdAndDelete(packageId);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).send('Error deleting package');
    }
});

router.get('/logout', function (req, res) {
    res.clearCookie('authenticated');
    req.session.destroy(function (err) {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/auth/login');
        }
    });
});

module.exports = router;
