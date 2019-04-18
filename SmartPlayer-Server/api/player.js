var express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');
const player = {

    init_player: (set) => {
        var values = new Buffer(set.file, 'base64'),
            text = values.toString('ascii');
        const fullPath = text,
            stream = fs.createReadStream(fullPath);
        // só exibe quando terminar de enviar tudo
        stream.on('end', () => '');
        // faz streaming do audio 
        stream.pipe(set.res);
    }
}

router.get('/:file', (req, res, next) => {
    player.init_player({ file: req.params.file, res: res });
})

module.exports = router;