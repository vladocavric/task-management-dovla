//======================================================================================================================
//  REQUIREMENTS
const express = require('express');
const router = express.Router({mergeParams: true});

//======================================================================================================================
//  INDEX ROUTES
router.get('/', (req, res) => {
    res.render(`index`)
});

module.exports = router;