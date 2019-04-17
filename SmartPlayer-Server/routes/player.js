const fs = require('fs');
const path = require('path');
var _files = [];
class Players {

    constructor() {

    }

    getFiles(dir, callback) {
        let files = fs.readdirSync(dir);
        _files = [];

        files.filter(file => {
            let next = path.join(dir, file); //Juntar o pasta com o ficheiro ou seja o direitorio e o ficheiro
            let __FILES = { title: null, file: null, duration: null }
            __FILES.title = file
            __FILES.file = dir + '/' + file;
            //Verificar se é um diretorio            => recrusividade   => Imprimir o diretorio com o ficheiro
            fs.lstatSync(next).isDirectory() == true ? getFiles(next) : _files.push(__FILES);
        })
        callback(_files)
    }
}
var plr = new Players();

module.exports = plr;