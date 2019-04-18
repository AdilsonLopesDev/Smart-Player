var SO_LoadFile = (function() {

    function SO_LoadFile(_play_list, _array_list_files, _extensionsArray, lastPath, actualPath) {
        this._init();
        this._play_list = [];
        this._extensionsArray = _extensionsArray;
        this._array_list_files = [];
        this.lastPath = ["E:/"];
        this.actualPath = [];
    };

    SO_LoadFile.prototype._auto_change_background = (i) => {
        $('body').css('background', `url(${background[i]}) no-repeat center center fixed`);
        $('body').css('margin', ' 0');
        $('body').css('padding', '0');
        $('body').css('background-size', 'cover');
        $ //('body').css('font-family', 'century ghotic');
    }
    SO_LoadFile.prototype._init = function() {
            var THAT = this;
            this._auto_change_background(0)
            setInterval(function() {
                    var i = Math.floor(Math.random() * (background.length - 1) + 0)
                    THAT._auto_change_background(i)

                }, 9000)
                // $('body').css('background', `url(${background[2]}) no-repeat center center fixed`)
            this._load_all_file('/so_build', '')
        }
        /**
         * Summary => read all the file in SO
         * @param {*} url url to load as the fault /folder url
         */
    SO_LoadFile.prototype._load_all_file = function(url, callback) {

        const THAT = this,
            FOLDER_LIST = $('#folderList');
        master_config.server_access({ url: url, type: 'get', headerType: {} }, {
            onProcess: function() {},
            success: function(e) {
                console.log(e)
                var model = null;
                if (e.extensions != null ||
                    !e.extensions != 'null' ||
                    !e.extensions != 'undefinded') {
                    master_config.Extensions = e.extensions;
                }

                FOLDER_LIST.empty();
                e.directories.map(item => {
                    FOLDER_LIST.append(THAT._files_list_template(item));
                    if (master_config.is_extensions_of(item.fullPath, 'audioOrvideo')) {
                        THAT._array_list_files.push(item.full_path)
                    } else if (master_config.is_extensions_of(item.fullPath, 'audio')) {
                        THAT._play_list.push(item.fullPath)
                    }
                })
                THAT._on_file_click()
            },
            error: function(e) {
                console.log(e)
            },
            complete: function(e) {
                console.log(e)
                typeof callback === 'string' ? '' : typeof callback === 'function' ? callback() : '';
            }
        });
    }

    SO_LoadFile.prototype._on_open_file = function(_dir, _target, _this) {
            var index = 0;
            if (this.is_dir(_dir) == true) {
                let path = btoa(`${_dir}/`)
                this._load_all_file('/so_build/' + path, '');
                return true;
            } else {
                let _path = btoa(_dir);
                let src = `${_path}`;
                if (master_config.is_extensions_of(_dir, 'video')) {
                    this._video(src, parseInt(_this.index()))
                } else if (master_config.is_extensions_of(_dir, 'audio')) {
                    this._audio(src, parseInt(_this.index()))
                }
                return false;
            }
        }
        /**
         * Sumamy => open directory or files
         */
    SO_LoadFile.prototype._on_file_click = function() {
            const CARD = $('.card'), // card selector
                THAT = this; // this element (this to refer the class)
            CARD.click(function() { // on click event
                let src = $(this).attr('src'), // src
                    _target = $(this).attr('play-target');
                if (THAT._on_open_file(src, _target, $(this)) === true) {
                    THAT.lastPath.push(src);
                    $('.arrow.left.back-forward').css('opacity', '1')
                }; // call _on_open method
            })
        }
        /**
         * Summary => check if is a dir or another file
         * @param {*} _dir string value
         */
    SO_LoadFile.prototype.is_dir = (_dir) => {
        let flag = true;
        //chech if the file is a directory or not looping to the extensions array
        master_config.Extensions.allfiles.map(i => {
            if (_dir.toString().toLowerCase().endsWith(i.trim())) {
                flag = false;
            }
        })
        return flag;
    }

    SO_LoadFile.prototype._files_list_template = (item) => {
        const result = ` <a href="#${item.fullPath}" class="red card" title="${item.dirname}" src="${item.fullPath}" play-target="${item.contentType}">
                            <div class="image">
                            <img src="${item.icon}"/>
                            </div>
                            <div class="extra no-padding">
                            ${item.dirname.substr(0,8)}
                                <div class="ui star rating"></div>
                            </div>
                        </a>`;
        return result;
    }
    SO_LoadFile.prototype._audio = function(audioFile, list_index = 0) {
        const THAT = this,
            music_list_count = THAT._play_list.length;

        var supportsAudio = !!document.createElement('audio').canPlayType;
        if (supportsAudio) {
            // initialize plyr
            var player = new Plyr('audio', {
                    controls: [
                        'restart',
                        'play',
                        'progress',
                        'current-time',
                        'duration',
                        'mute',
                        'volume'
                    ]
                }),
                audio = $('audio'),
                isPlaying = false;

            audio.on('play', function() {
                isPlaying = true;
            }).on('pause', function() {
                isPlaying = false;
                audio[0].pause();
            }).on('ended', function() { //on the music finish
                //check if the index is more then length of the play list 
                if ((list_index + 1) < music_list_count) {
                    list_index++; // increment the index
                    _load_Track(list_index);
                    _play();
                } else {
                    _load_Track(0);
                    _play();
                }
            })
            _load_Track(audioFile)
            _play()
        } else {

        }

        function _play() {
            audio[0].play();
            $('.audio-container').fadeIn();
            // $('#spectrum').attr('src', '/images/after-effects-round-audio-spectrum.gif')
        }

        function _load_Track(index) {
            var src;
            if (typeof index == 'string') {
                src = index;
            } else if (typeof index === 'number') {
                if (!THAT._play_list[index].endsWith('.mp3')) {
                    index++;
                    _load_Track(index);
                } else if (index < music_list_count) {
                    _load_Track(0)
                } else {
                    src = btoa(THAT._play_list[index]);
                }

            }

            audio.attr('src', `${master_config.musicUrl}${src}`);
        }
    }

    SO_LoadFile.prototype._video = function(videoFile, list_index = 0) {
        // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
        const player = new Plyr('#player', {
            controls: [
                'restart',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume'
            ]
        });
        var video = $('video'),
            isPlaying = false,
            THAT = this,
            totalInArray = this._array_list_files.length;

        // Expose
        window.player = player;

        // Bind event listener
        function on(selector, type, callback) {
            // document.querySelector(selector).addEventListener(type, callback, false);
        }
        video.on('play', function() {
            isPlaying = true;
        }).on('pause', function() {
            player.pause();
            isPlaying = false;
        }).on('ended', function() {
            if ((list_index + 1) < totalInArray) {
                list_index++; // increment the index
                _load_Track(list_index);
                _play();
            } else {
                _load_Track(0);
                _play();
            }
        })
        _load_Track(videoFile)
        _play()
            // Play
        on('.js-play', 'click', () => {
            player.play();
        });

        // // Pause
        // on('.js-pause', 'click', () => {
        //     player.pause();
        // });

        // Stop
        on('.js-stop', 'click', () => {
            player.stop();
        });

        // Rewind
        on('.js-rewind', 'click', () => {
            player.rewind();
        });

        // Forward
        on('.js-forward', 'click', () => {
            player.forward();
        });

        function _play() {
            player.play();
        }

        function _load_Track(index) {
            var src;
            if (typeof index == 'string') {
                src = index;
            } else if (typeof index === 'number') {
                src = btoa(THAT._array_list_files[index]);
            }
            video.attr('src', `${master_config.videoUrl}${src}`).css('display', 'block');
        }
    }
    return SO_LoadFile;
}());

$(document).ready(function() {
    var SO_Load = new SO_LoadFile();

    $('.back-forward.right').click(function() {

        if ((SO_Load.actualPath.length) > 0) {
            let index = SO_Load.actualPath.length - 1,
                _src = SO_Load.actualPath[index];
            console.log(index)
            console.log(SO_Load.actualPath)
            console.log(_src)
            let path = btoa(`${_src}/`)
            SO_Load._load_all_file('/folders/' + path, e => {
                SO_Load.actualPath.pop()
                SO_Load.lastPath.push(_src);
                $('.back-forward.left').css('opacity', '1');
                if (SO_Load.actualPath.length === 0) {
                    $(this).css('opacity', '0')
                }
            });

        }

    })
    $('.back-forward.left').click(function() {

        if ((SO_Load.lastPath.length) > 0) {
            console.log(SO_Load.lastPath)
            let index = SO_Load.lastPath.length - 1,
                _src = SO_Load.lastPath[index - 1];
            let path = btoa(`${_src}/`)
            SO_Load._load_all_file('/folders/' + path, e => {
                SO_Load.lastPath.pop()
                SO_Load.actualPath.push(_src);
                $('.back-forward.right').css('opacity', '1');
                if (SO_Load.lastPath.length === 0) {
                    $(this).css('opacity', '0')
                }
            });
            //SO_Load._load_all_file('/folders/' + btoa(`${_src}/`))

        }

    })

    $('.sidebar-nav-link').click(function() {
        let _src = $(this).attr('src');
        let path = btoa(`${_src}/`)
        SO_Load._load_all_file('/folders/' + path, '')
    })
})