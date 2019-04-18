var Master_config = (function() {
    function Master_config(musicUrl, videoUrl, Extensions) {
        this.musicUrl = `http://${window.location.hostname}:8000/play/`;
        this.videoUrl = `http://${window.location.hostname}:8000/play/`;
        this.Extensions = [];
    }

    Master_config.prototype.server_access = function(symbl = {
            url: '',
            type: '',
            data: '',
            headerType: { mimetype: '', dataType: '', contentType: '', cache: false, processData: false },
        },
        functions = {
            onProcess: null,
            success: null,
            error: null,
            complete: null
        }) {

        symbl.url = symbl.url || null;
        symbl.type = symbl.type || 'post';
        symbl.data = symbl.data || null;
        symbl.headerType.length > 0 ? symbl.headerType.mimetype = symbl.headerType.mimetype || 'multipart/form-data' : '';
        symbl.headerType.dataType = symbl.headerType.dataType || 'json';
        symbl.headerType.contentType = symbl.headerType.contentType || 'application/json';
        symbl.headerType.cache = symbl.headerType.cache || false;
        symbl.headerType.processData = symbl.headerType.processData || false;
        functions.onProcess = functions.onProcess || null;

        try {
            $.ajax({
                url: symbl.url,
                type: symbl.type,
                data: symbl.data,
                //mimetype: symbl.headerType.mimetype,
                dataType: symbl.headerType.dataType,
                cache: symbl.headerType.cache,
                contentType: symbl.headerType.contentType,
                processData: symbl.headerType.processData,
                beforeSend: () => {
                    functions.onProcess == null ? console.log('is not callback function') : functions.onProcess()
                },
                success: (response) => {
                    typeof response == 'string' ? response = JSON.parse(response) : response = response;
                    functions.success == null ? console.log('successfuly') : functions.success(response)
                },
                error: (response) => {
                    typeof response == 'string' ? response = JSON.parse(response) : response = response;
                    functions.error == null ? console.log('error') : functions.error(response)
                },
                complete: (response) => {
                    typeof response == 'string' ? response = JSON.parse(response) : response = response;
                    functions.complete == null ? console.log('Completed with : ', response) : functions.complete(response)
                }
            })
        } catch (e) {
            $.error('Erro: ', e);
        }

    };

    Master_config.prototype.is_extensions_of = (file, type) => {

        if (typeof type === 'string' && type.toLowerCase() === 'audio') {
            let flag = false;
            master_config.Extensions.audio.map(i => {
                if (file.toString().toLowerCase().endsWith(i.trim())) {
                    flag = true;
                }
            })
            return flag;
        } else
        if (typeof type === 'string' && type.toLowerCase() === 'video') {
            let flag = false;
            master_config.Extensions.video.map(i => {
                if (file.toString().toLowerCase().endsWith(i.trim())) {
                    flag = true;
                }
            })
            return flag;
        } else
        if (typeof type === 'string' && type.toLowerCase() === 'audioorvideo') {
            let flag = false;
            //chech if the file is a directory or not looping to the extensions array
            master_config.Extensions.audioorvideo.map(i => {
                if (file.toString().toLowerCase().endsWith(i.trim())) {
                    flag = true;
                }
            })
            return flag;
        } else {
            $.error(`The type: ${type} is no valiable , the type avaliable is {audio, video, text}`);
        }

    }

    return Master_config;
}());
var master_config = new Master_config();