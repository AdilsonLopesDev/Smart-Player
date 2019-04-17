var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')
    /* GET users listing. */
router.get('/:file', function(req, res) {
    var values = new Buffer(req.params.file, 'base64')
    var text = values.toString('ascii')
    const __full_path = text;
    // res.writeHead(200, {
    //     'Content-Type': 'audio/mp3',
    // });
    const stream = fs.createReadStream(__full_path);
    // só exibe quando terminar de enviar tudo
    stream.on('end', () => '');
    // faz streaming do audio 
    stream.pipe(res);
    //res.json((data))
});

module.exports = router;