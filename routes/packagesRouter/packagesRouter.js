var express = require('express');
var router = express.Router();
const { Package } = require('../../db/db')

router.get('/', async function (req, res, next) {
  try {
    const package = await Package.find({})
    console.log("package ", package);

    res.render('packages/packages', { packages: package });

  } catch {

  }
});


router.get('/categories/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await Package.findById(packageId);
    if (!package) {
        // If package with the provided ID is not found, handle accordingly
        return res.status(404).send('Package not found');
    }
      
      res.render('packages/category/category',{package});
  } catch (error) {
      console.error('Error fetching package details:', error);
      res.status(500).send('Error fetching package details');
  }
});

router.get('/categories/:id/:category', async (req, res) => {
  try {
    const packageId = req.params.id;
    const category = req.params.category;

    const package = await Package.findById(packageId);
    console.log("detals",package,"detals", packageId,"detals", category);
    if (!package) {
      return res.status(404).send('Package not found');
    }

    res.render('packages/details/packageDetails', { package, category });
  } catch (error) {
    console.error('Error fetching package details:', error);
    res.status(500).send('Error fetching package details');
  }
});

module.exports = router;

module.exports = router;
