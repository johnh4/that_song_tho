jQuery.ajaxSettings.traditional = true; 
var apiKey = 'EUFISR9P2AYE4J2ZN';
var curSong = null;
var maxTimeForSkip = 3000;


function info(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-info");
    }
    $("#info").text(s);
}

function tinfo(s) {
    info(s);
    setTimeout( function() { info(""); }, 5000);
}

function error(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-error");
    }
    $("#info").text(s);
}

function terror(s) {
    error(s);
    setTimeout( function() { error(""); }, 5000);
}

function getRdioID(song) {
    var id = song.tracks[0].foreign_id;
    var rawID = id.split(':')[2]
    return rawID;
}

function playSong(song) {
    var rdioID = getRdioID(song);
    curSong = song;
    R.player.play({
        source: rdioID
    });
    $("#rp-song-title").text(song.title);
    $("#rp-artist-name").text(song.artist_name);
    document.title = song.artist_name;
}

function playNextSong() {
    fetchNextTrack();
}


function fetchNextTrack() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/next';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        results: 1,
        lookahead: 5,
    };

    $.getJSON(url, args,
        function(data) {
            console.log('fnt', data);
            playSong(data.response.songs[0]);

            $("#up-next").empty();
            var names = [];

            $.each(data.response.lookahead, 
                function(index, song) {
                    names.push(song.artist_name);
                }
            );
            var all = names.join(', ');
            $("#up-next").append(all);
        },
        function() {
            error("Trouble creating playlist session for " + artist);
        }
    );
}

function fetchUpNext() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/next';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        results: 0,
        lookahead: 5,
    };

    $.getJSON(url, args,
        function(data) {
            $("#up-next").empty();
            var names = [];

            $.each(data.response.lookahead, 
                function(index, song) {
                    names.push(song.artist_name);
                }
            );
            var all = names.join(', ');
            $("#up-next").append(all);
        },
        function() {
            error("Trouble getting next artists in the playlist");
        }
    );
}

function createDynamicPlaylist(artist) {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/create';
    tinfo("Creating the playlist ...");

    var args = {
        'artist': artist, 
        'api_key' : apiKey,
        'bucket': [ 'id:rdio-US', 'tracks'], 'limit' : true,
        'type':'artist-radio',
        'dmca': false
    };

    $.getJSON(url, args,
        function(data) {
            console.log(data);
            if (data.response.status.code == 0) {
                session_id = data.response.session_id;
                $("#the-player").show();
                fetchNextTrack();
            } else {
                error("Trouble creating playlist for artist " + artist);
            }
        },
        function() {
            console.log('error');
            error("Trouble creating playlist session for " + artist);
        }
    );
}

function badSong() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        ban_artist: curSong.artist_id,
    };

    terror("banning songs by " + curSong.artist_name);
    $.getJSON(url, args,
        function(data) {
            terror("banned songs by " + curSong.artist_name);
            playNextSong();
        },
        function() {
            error("Trouble creating playlist session for " + artist);
        }
    );
}

function skipSong() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        skip_song: curSong.id
    };

    tinfo("skipping " + curSong.title);
    $.getJSON(url, args,
        function(data) {
            tinfo("skipped " + curSong.title);
            playNextSong();
        },
        function() {
            error("Trouble creating playlist session for " + artist);
        }
    );
}

function goodSong() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        favorite_artist: 'last',
        favorite_song: 'last'
    };

    tinfo("favoriting " + curSong.artist_name);
    $.getJSON(url, args,
        function(data) {
            fetchUpNext();
            tinfo("favorited " + curSong.artist_name);
        },
        function() {
            error("Trouble creating playlist session for " + artist);
        }
    );
}



function now() {
    return new Date().getTime();
}

function go() {
    var artist = $("#artist").val();
    if (artist.length > 0) {
        createDynamicPlaylist(artist);
    } else {
        error("Type an artist first");
    }
}

function initUI() {
    $("#the-player").hide();
    $("#artist").keydown(
        function(){
            if (event.keyCode == 13) {
                go();
            }
        });
    $("#go").click(go);

    $("#bad-song").click(badSong);
    $("#good-song").click(goodSong);
}

$(document).ready(function() {
    var trackStartTime = now();

    $.ajaxSetup( {cache: false});
    // fetchApiKey will fetch the Echo Nest demo key for demos
    // hosted on The Echo Nest, otherwise it fetch an empty key
    fetchApiKey( function(api_key, isLoggedIn) {
        if (!api_key) {
            api_key = 'EUFISR9P2AYE4J2ZN';
        }
        apiKey = api_key;
        initUI();
        R.ready(function() {
            R.player.on("change:playingTrack", function(track) {
                if (track) {
                    var image = track.attributes.icon;
                    $("#rp-album-art").attr('src', image);
                    trackStartTime = now();
                } else {
                    playNextSong();
                }
            });

            R.player.on("change:playState", function(state) {
                if (state == R.player.PLAYSTATE_PAUSED) {
                    $("#rp-pause-play i").removeClass("icon-pause");
                    $("#rp-pause-play i").addClass("icon-play");
                }
                if (state == R.player.PLAYSTATE_PLAYING) {
                    $("#rp-pause-play i").removeClass("icon-play");
                    $("#rp-pause-play i").addClass("icon-pause");
                }
            });

            R.player.on("change:playingSource", function(track) {});

            $("#rp-pause-play").click(function() {
                R.player.togglePause();
            });

            $("#rp-next").click(function() {
                var delta = now() - trackStartTime;
                var likeButton = $('#like');
                console.log('likeButton: ' + likeButton);
                $('#like').submit();
                if (delta < maxTimeForSkip) {
                    skipSong();
                } else {
                    playNextSong();
                }
            });

            console.log('rdio ready');
        });
    });
});
