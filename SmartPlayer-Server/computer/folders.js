const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    __SOACCESS = require('./accessDir');

//#region Load all folder and files in SO
router.get('/', (req, res, next) => {
    const folderList = __SOACCESS.__read_SO_Files('E:/')
    const data = { folder: folderList, extensions: __SOACCESS._extensions };
    res.json(data)
});

//#endregion

router.get('/:path', (req, res, next) => {
    var values = new Buffer(req.params.path, 'base64')
    var text = values.toString('ascii')
    const __full_path = text;
    const folderList = __SOACCESS.__read_SO_Files(__full_path)
    const data = { folder: folderList, extensions: __SOACCESS._extensions };
    res.json(data)
});
module.exports = router;