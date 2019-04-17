const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    so_access = require('../settings/setting');

//#region Load all folder and files in SO
router.get('/', (req, res, next) => {
    const listOfDirectories = so_access.readDirectories('E:/'),
        data = { directories: listOfDirectories, extensions: so_access.init().extensions };
    console.log(listOfDirectories)
    res.json(data)
});



router.get('/:path', (req, res, next) => {
    const values = new Buffer(req.params.path, 'base64'),
        text = values.toString('ascii'),
        fullPath = text,
        listOfDirectories = so_access.readDirectories(fullPath),
        data = { directories: listOfDirectories, extensions: so_access.init().extensions };
    res.json(data)
});

//#endregion
module.exports = router;

/*Fetch all file from the SO */
router.get('/', (res, req, next) => {

})