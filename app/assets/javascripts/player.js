jQuery.ajaxSettings.traditional = true; 
var apiKey = 'EUFISR9P2AYE4J2ZN';
var curSong = null;
var curDBsong = null;
var curFav = null;
var maxTimeForSkip = 3000;
var playCount = 0;
var challengerPlaying = null;
var reloaded = false;
var favGoTimeout;

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
    console.log("In player.js playSong()");
    playCount++;
    console.log('playCount: ' + playCount);
    var rdioID = getRdioID(song);
    curSong = song;
    R.player.play({
        source: rdioID
    });
    if(curFav != null){
        $("#fav-rp-song-title").text(song.title);
        $("#fav-rp-artist-name").text(song.artist_name);    
    }
    $("#rp-song-title").text(song.title);
    $("#rp-artist-name").text(song.artist_name);
    //document.title = song.artist_name;

    postSong(song);
}

function postSong(foundSong) {
    //create a song in the db
    var song = { song: { title: foundSong.title, artist: foundSong.artist_name } }
    console.log('song: ' + song);
    console.log('song.song.title: ' + song.song.title);
    console.log('song.song.artist: ' + song.song.artist);
    $.ajax({
        type: 'POST',
        url: '/songs', 
        data: JSON.stringify(song), 
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            console.log('postSong response: ' + response);
            console.log('postSong response.title: ' + response.title);
            console.log('postSong response.artist: ' + response.artist);
            console.log('postSong response.id: ' + response.id);
            console.log('postSong response.user_id: ' + response.user_id);
            curDBsong = response;
            if(playCount == 1){
                console.log('playCount is 1, running favoriteSong()');
                //favoriteSong();
            }
        }
    });
}

function favoriteSong() {
    //use curDBsong
    var newFavorite = { id: curDBsong.id }

    $.ajax({
        type: 'PATCH',
        url: '/songs/' + curDBsong.id + '/make_favorite',
        data: JSON.stringify(newFavorite),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            console.log('in favoriteSong success function');
            console.log('favoriteSong response: ' + response);
            curFav = response;
        }
    });
    updateFavHTML();
}

function updateRoundsWon(song){
    var songID = { id: song.id }
    var rounds = null;

    $.ajax({
        type: 'PATCH',
        url:'/songs/' + song.id + '/update_rounds',
        data: JSON.stringify(songID),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            console.log('updateRoundsWon response: ' + response);
            rounds = response[1];
            console.log('rounds: ' + rounds);
            $('#rounds-won').html(rounds);
        }
    });
}

function updateFavHTML() {
    $('#fav-title').html(curDBsong.title);
    $('#fav-artist').html(curDBsong.artist);
    //var roundsBefore = parseInt(document.getElementById('rounds-won').textContent);
    //var roundsAfter = roundsBefore + 1;
    //console.log('roundsBefore: ' + roundsBefore);
    //console.log('roundsAfter: ' + roundsAfter);
    //$('#rounds-won').html(roundsAfter);
    var favCountBefore = parseInt(document.getElementById('fav-count').textContent);
    var favCountAfter = favCountBefore + 1;
}

function playNextSong() {
    if(curFav != null) {
        updateRoundsWon(curFav);
    }
    fetchNextTrack();
}


function fetchNextTrack() {
    console.log('in fetchNextTrack()');
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
            console.log('Trouble creating playlist session');
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
                $('#the-form').fadeOut(500);
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
    console.log('in go()');
    challengerPlaying = true;
    useFavPlayer = false;
    var artist = $("#artist").val();
    if (artist.length > 0) {
        createDynamicPlaylist(artist);
    } else {
        error("Type an artist first");
    }
    if(reloaded == true){
        //$('#fav-pl-rp-pause-play').delay(4000).trigger('click');
    }
    //$('#fav-pl-rp-pause-play').delay(1500).trigger('click');
}

function initUI() {
    console.log('In player.js initUI().');
    $("#the-player").hide();
    $('#game-over').hide();
    //$('#lead-in').hide();
    $('#lead-in').delay(500).fadeIn(1000);

    $('#the-form').hide();
    $('#fav-pl-the-form').hide();
    var title;
    $('#pick-title-div').keydown(
        function(){
            if (event.keyCode == 13) {
                title = $('#pick-title-input').val();
                $('#pick-title-div').fadeOut(500, function(){
                    console.log('lead-in title: ' + title);
                    $('#pick-artist-div p').prepend(title);
                    $('#pick-artist-div').fadeIn(500);
                });
            }
        });
    $('#pick-artist-div').keydown(
        function(){
            if (event.keyCode == 13) {
                var artist = $('#pick-artist-input').val();
                $('#lead-in').fadeOut(500, function(){
                    console.log('lead-in artist: ' + artist);
                    $('#artist').val(artist);
                    $('#fav-pl-artist').val(artist);
                    $('#fav-pl-title').val(title);
                    $('#the-form').fadeIn(500);
                    $('#fav-pl-the-form').fadeIn(500);
                    //go();
                    fav_go();
                    
                    //useFavPlayer = true;
                    //fav_go();
                    favGoTimeout = window.setTimeout(function(){
                        //useFavPlayer = true;
                        //fav_go();
                        go();
                    }, 1500);

                    //useFavPlayer = true;
                    //fav_playSong(fav_favEcho);

                    //$('#fav-pl-rp-pause-play').delay(1500).trigger('click');
                    //challengerPlaying = false;
                    //useFavPlayer = true;
                    //$('#fav-pl-rp-pause-play').trigger('click');
                });
            }
        });
    $("#artist").keydown(
        function(){
            if (event.keyCode == 13) {
                go();
            }
        });
    $("#go").click(go);

    $("#bad-song").click(badSong);
    $("#good-song").click(goodSong);
    $('#new-fav').click(function(){
        useFavPlayer = true;
        var artist = curSong.artist_name;
        var title = curSong.title;
        fav_favEcho = curSong;
        console.log('in #new-fav.click, cursong.title: ' + curSong.title);
        console.log('in #new-fav.click, fav_favEcho.title: ' + fav_favEcho.title);
        fav_findSong(artist, title, 0);
        favoriteSong();
        var newImage = $("#rp-album-art").attr('src');
        $("#fav-pl-rp-album-art").attr('src', newImage);
        endGame();
    });
}

function endGame(){
    $('#the-player').fadeOut(500);
    $('#game-over').fadeIn(500);
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
                if(useFavPlayer == false){
                    $("#the-player").fadeOut(500);
                    console.log('in player.js change:playingTrack');
                    if (track) {
                        var image = track.attributes.icon;
                        $("#rp-album-art").attr('src', image);
                        trackStartTime = now();
                        if(playCount == 1 && reloaded == false || playCount == 3 && reloaded == true){
                            $('#fav-pl-rp-pause-play').trigger('click');
                        }
                    } else {
                        console.log('in player.js change:playingTrack else');
                        playNextSong();
                    }
                    $("#the-player").fadeIn(500);
                }
            });

            R.player.on("change:playState", function(state) {
                if (state == R.player.PLAYSTATE_PAUSED && useFavPlayer == false) {
                    $("#rp-pause-play i").removeClass("icon-pause");
                    $("#rp-pause-play i").addClass("icon-play");
                    $("#rp-pause-play").html('Play');
                }
                if (state == R.player.PLAYSTATE_PLAYING && useFavPlayer == false) {
                    $("#rp-pause-play i").removeClass("icon-play");
                    $("#rp-pause-play i").addClass("icon-pause");
                    $("#rp-pause-play").html('Playing');
                }
            });

            R.player.on("change:playingSource", function(track) {});

            $("#rp-pause-play").click(function() {
                useFavPlayer = false;
                R.player.togglePause();
                if(challengerPlaying == false){
                    $("#fav-pl-rp-pause-play").html('Play');
                    $("#rp-pause-play").html('Playing');
                    challengerPlaying = true;
                    playSong(curSong);
                }
            });

            $("#rp-next").click(function() {
                var delta = now() - trackStartTime;

                //submit like button when click next, mostly a test
                //var likeButton = $('#like');
                //console.log('likeButton: ' + likeButton);
                //$('#like').submit();
                
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
