const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    user = os.userInfo(),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    INIT = require('./globalVariables');

//#region Access to SO

const SO_ACCESS = {
    //TODO: All logic to handle with System Oparation
    /**
     * Initialization 
     */
    init: () => {
        SO_ACCESS.getExtensions(e => {
            INIT.extensions = e;
        })

        return INIT;
    },

    listDrives: (callback) => {
        exec('wmic logicaldisk get name', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            var data = Buffer.from(stdout).toString('utf8');
            let contents = data.split('\r\r\n').filter(value => /[A-Za-z]:/.test(value)).map(value => value.trim());
            let drives = [];
            contents.map(i => {
                drives.push({
                    Name: i.toUpperCase()
                });
            })
            callback(drives)
        });
    },
    isDirectory: (pathname) => {
        try {
            return typeof pathname == 'string' ? fs.lstatSync(pathname).isDirectory() : false;
        } catch (error) {
            return false;
        }
    },
    readDirectories: (dirname = 'c:/') => {
        INIT.directories = [];
        /**read directories & map them */
        fs.readdirSync(dirname).map(dir => {
            const dirObject = { dirname: null, fullPath: null, icon: null, contentType: null },
                next = path.join(dirname, dir);
            if (SO_ACCESS.isDirectory()) {
                dirObject.icon = INIT.folderIcon;
                INIT.directories.push(dirObject);
            } else {
                let extension = path.extname(next);
                SO_ACCESS.fillDirectories(extension, { dir: dir, dirname: dirname })
            }
        })
        return INIT.directories;
    },
    fillDirectories: (extension, dirSet) => {
        const dirObject = { dirname: null, fullPath: null, icon: null, contentType: null };
        if (SO_ACCESS.isFileOfType(extension, 'audio')) {
            dirObject.icon = INIT.musicIcon;
            dirObject.contentType = 'audio';
        } else if (SO_ACCESS.isFileOfType(extension, 'video')) {
            dirObject.icon = INIT.videoIcon;
            dirObject.contentType = 'video';
        } else if (SO_ACCESS.isFileOfType(extension, 'img')) {
            const img = `${dirSet.dirname}${dirSet.dir}`,
                buffImage = fs.readFileSync(img),
                base64data = buffImage.toString('base64');
            dirObject.icon = `data:image/png;base64,${base64data}`;
            dirObject.contentType = 'img';
        } else if (extension === '.txt' || extension === '.css') {
            dirObject.icon = INIT.textIcon;
            dirObject.contentType = 'txt';
        } else {
            dirObject.icon = INIT.folderIcon;
            dirObject.contentType = 'folder';
        }

        dirObject.dirname = dirSet.dir; //name of the file (folder)
        dirObject.fullPath = `${dirSet.dirname}${dirSet.dir}`; //Full directory
        INIT.directories.push(dirObject);
    },
    isFileOfType: (file, type) => {
        let flag = false;
        INIT.extensions[type].map(i => {
            if (file.toString().toLowerCase().trim().endsWith(i)) {
                flag = true;
            }
        })
        return flag;
    },
    getExtensions: async(callback) => {
        let fileStream = fs.createReadStream('helpers/extensions.txt'),
            data = "";

        fileStream.on('readable', function() {
            //this functions reads chunks of data and emits newLine event when \n is found
            data += fileStream.read();
            while (data.indexOf('\n') >= 0) {
                fileStream.emit('newLine', data.substring(0, data.indexOf('\n')));
                data = data.substring(data.indexOf('\n') + 1);

            }
        });

        fileStream.on('end', function() {
            //this functions sends to newLine event the last chunk of data and tells it
            //that the file has ended
            fileStream.emit('newLine', data, true);
        });

        var statement = { allfiles: [] };

        fileStream.on('newLine', async function(line_of_text, end_of_file) {
            //this is the code where you handle each line
            // line_of_text = string which contains one line
            // end_of_file = true if the end of file has been reached

            var arrayOfExtensionType = line_of_text.split("="),
                extensions = arrayOfExtensionType[1]
                .replace('\r', '') // remove \r caracter if have
                .replace('null', '') // remove null caracter if have
                .replace("[", "") // remove [ caracter if have
                .replace("]", "") // remove ] caracter if have
                .split(','), // transform to array
                type = arrayOfExtensionType[0].trim();
            statement[type] = extensions;
            //load all extensions
            extensions.map(i => {
                statement.allfiles.push(i);
            })

            if (end_of_file) {
                statement['audioorvideo'] = statement.audio.concat(statement.video)
                callback(statement);
                INIT.extensions = statement;
                //here you have your statement object ready
            }

        });
    },
    test: () => {
        INIT.file.push(1)
        console.log(INIT)
    }
}
SO_ACCESS.init()
module.exports = SO_ACCESS;
//#endregion