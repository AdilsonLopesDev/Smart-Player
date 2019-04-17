// Mythium Archive: https://archive.org/details/mythium/

var tracks = [{
    name: "05. U Cry.mp3",
    "track": 1,
    "duration": "2:46",
    "file": "05. U Cry.mp3"
}];
// app.get('/download', function(req,res){
// 	var fileId = req.query.id;
// 	var file = __dirname + '/music/' + fileId;
// 	fs.exists(file,function(exists){
// 		if(exists)
// 		{
// 			res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
// 			res.setHeader('Content-Type', 'application/audio/mpeg3')
// 			var rstream = fs.createReadStream(file);
// 			rstream.pipe(res);
// 		}
// 		else
// 		{
// 			res.send("Its a 404");
// 			res.end();
// 		}
// 	});
// });
jQuery(function($) {
    'use strict'
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
        });

        // initialize playlist and controls
        var index = 0,
            playing = false,
            mediaPath = 'C:/WebProject/MyOwnRepo/Test/Tyga - Kyoto (2018)/',
            extension = '',

            buildPlaylist = $(tracks).each(function(key, value) {
                var trackNumber = value.track,
                    trackName = value.name,
                    trackDuration = value.duration;
                if (trackNumber.toString().length === 1) {
                    trackNumber = '0' + trackNumber;
                }

            }),
            trackCount = tracks.length,
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            audio = $('#audio1').on('play', function() {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function() {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function() {
                npAction.text('Paused...');
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);

                    //add shuffle logic here
                    audio.play();
                }
            }).get(0),
            btnPrev = $('#btnPrev').on('click', function() {

                if ((index - 1) > -1) {
                    index--;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            btnNext = $('#btnNext').on('click', function() {
                trackCount = tracks.length;
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }

                $('#plList li').on('click', function() {
                    var id = parseInt($(this).index());
                    if (id !== index) {
                        playTrack(id);
                    }
                })
            }),
            li = $('#plList li').on('click', function() {
                var id = parseInt($(this).index());
                if (id !== index) {
                    playTrack(id);
                }
            }),
            loadTrack = function(id) {

                $('.plSel').removeClass('plSel');
                $('#plList li:eq(' + id + ')').addClass('plSel');
                npTitle.text(tracks[id].name);
                index = id;
                // audio.src = "/javascripts/Tyga - Kyoto (2018)/" + tracks[id].name;
            },
            playTrack = function(id) {
                loadTrack(id);
                audio.play();
            };
        extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
        loadTrack(index);
    } else {
        // boo hoo
        $('.column').addClass('hidden');
        var noSupport = $('#audio1').text();
        $('.container').append('<p class="no-support">' + noSupport + '</p>');
    }
    //playTrack(0);
});