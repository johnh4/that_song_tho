jQuery.ajaxSettings.traditional = true; 
var apiKey = 'EUFISR9P2AYE4J2ZN';
var fav_curSong = null;
var fav_curDBsong = null;
var fav_favEcho = null;
var curFav = null;
var maxTimeForSkip = 3000;
var fav_playCount = 0;
var useFavPlayer = true;
var fav_songIndex = 0;
var fav_played = false;


function fav_info(s) {
    $("#fav-pl-info").removeClass();
    if (s.length > 0) {
        $("#fav-pl-info").addClass("alert alert-info");
    }
    $("#fav-pl-info").text(s);
}

function fav_tinfo(s) {
    fav_info(s);
    setTimeout( function() { fav_info(""); }, 5000);
}

function fav_error(s) {
    $("#fav-pl-info").removeClass();
    if (s.length > 0) {
        $("#fav-pl-info").addClass("alert alert-error");
    }
    $("#fav-pl-info").text(s);
}

function fav_terror(s) {
    fav_error(s);
    setTimeout( function() { fav_error(""); }, 5000);
}

function fav_getRdioID(song) {
    var fav_id = song.tracks[0].foreign_id;
    var fav_rawID = fav_id.split(':')[2]
    return fav_rawID;
}

function fav_playSong(song) {
    console.log("In fav_playSong()");
    fav_playCount++;
    console.log('fav_playCount: ' + fav_playCount);
    var fav_rdioID = fav_getRdioID(song);
    fav_curSong = song;
    if(fav_favEcho){
        console.log('in fav_playSong and fav_favEcho.title is:' + fav_favEcho.title);
        R.player.play({
            source: fav_getRdioID(fav_favEcho)
        });
    }
    else{
        console.log('in fav_playSong but fav_favEcho is not defined');
        R.player.play({
            source: fav_rdioID
        });    
    }
    
    $("#fav-pl-rp-song-title").text(song.title);
    $("#fav-pl-rp-artist-name").text(song.artist_name);
    
    if (fav_favEcho != null){
        $("#fav-pl-rp-song-title").text(fav_favEcho.title);
        $("#fav-pl-rp-artist-name").text(fav_favEcho.artist_name);
        console.log('fav_favEcho: ' + fav_favEcho);
    }
    
    document.title = song.artist_name;
    fav_postSong(song);
    if(fav_playCount == 1){
        console.log('fav_playCount is 1, setting fav_favEcho');
        fav_favEcho = song;
        //var fav_image = song.rdio.icon; //song.attributes.icon;
        //$("#fav-pl-rp-album-art").attr('src', fav_image);
        //console.log('fav_playSong changed image');
    }
}

function fav_postSong(foundSong) {
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
            fav_curDBsong = response;
            if(fav_playCount == 1){
                console.log('fav_playCount is 1, running fav_favoriteSong()');
                fav_favoriteSong();
            }
        }
    });
}

function fav_favoriteSong() {
    //use fav_curDBsong
    var newFavorite = { id: fav_curDBsong.id }
    console.log('in fav_favoriteSong, fav_curDBsong: ' + fav_curDBsong.title);
    //fav_favEcho = fav_curSong;
    $.ajax({
        type: 'PATCH',
        url: '/songs/' + fav_curDBsong.id + '/make_favorite',
        data: JSON.stringify(newFavorite),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            console.log('in fav_favoriteSong success function');
            console.log('fav_favoriteSong response: ' + response);
            curFav = response;
        }
    });
    fav_updateFavHTML();
}

function fav_updateRoundsWon(song){
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

function fav_updateFavHTML() {
    $('#fav-title').html(fav_curDBsong.title);
    $('#fav-artist').html(fav_curDBsong.artist);
    //var roundsBefore = parseInt(document.getElementById('rounds-won').textContent);
    //var roundsAfter = roundsBefore + 1;
    //console.log('roundsBefore: ' + roundsBefore);
    //console.log('roundsAfter: ' + roundsAfter);
    //$('#rounds-won').html(roundsAfter);
    var favCountBefore = parseInt(document.getElementById('fav-count').textContent);
    var favCountAfter = favCountBefore + 1;
}

function fav_playNextSong() {
    if(curFav != null) {
        fav_updateRoundsWon(curFav);
    }
    fav_fetchNextTrack();
}


function fav_fetchNextTrack() {
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
            fav_playSong(data.response.songs[0]);

            $("#fav-pl-up-next").empty();
            var names = [];

            $.each(data.response.lookahead, 
                function(index, song) {
                    names.push(song.artist_name);
                }
            );
            var all = names.join(', ');
            $("#fav-pl-up-next").append(all);
        },
        function() {
            fav_error("Trouble creating playlist session for " + artist);
        }
    );
}

function fav_fetchUpNext() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/next';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        results: 0,
        lookahead: 5,
    };

    $.getJSON(url, args,
        function(data) {
            $("#fav-pl-up-next").empty();
            var names = [];

            $.each(data.response.lookahead, 
                function(index, song) {
                    names.push(song.artist_name);
                }
            );
            var all = names.join(', ');
            $("#fav-pl-up-next").append(all);
        },
        function() {
            fav_error("Trouble getting next artists in the playlist");
        }
    );
}

function fav_createDynamicPlaylist(artist) {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/create';
    fav_tinfo("Creating the playlist ...");

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
                $("#fav-pl-the-player").show();
                fav_fetchNextTrack();
            } else {
                fav_error("Trouble creating playlist for artist " + artist);
            }
        },
        function() {
            console.log('error');
            fav_error("Trouble creating playlist session for " + artist);
        }
    );
}

function fav_findSong(artist, title, index) {
    var url = 'http://developer.echonest.com/api/v4/song/search?api_key=' + apiKey;
    fav_tinfo("Finding a song ...");

    var args = {
        'artist': artist,
        'title': title,
        //'api_key' : apiKey,
        'bucket': [ 'id:rdio-US', 'tracks'], 'limit' : true,
        //'type':'artist-radio'
        //'dmca': false
    };

    $.getJSON(url, args,
        function(data) {
            console.log(data);
            if (data.response.status.code == 0) {
                session_id = data.response.session_id;
                //fav_fetchNextTrack();
                console.log('data.response.songs.length: ' + data.response.songs.length);
                if(data.response.songs.length > 0) {
                    $("#fav-pl-the-player").show();
                    console.log('data.response.songs[' + index +'].title: ' + data.response.songs[index].title);
                    fav_playSong(data.response.songs[index]);
                    $('#fav-pl-the-form').fadeOut(500);
                }
                else if(data.response.songs.length == 0 && fav_playCount == 0){
                    console.log("data.response.songs.length == 0");
                    console.log("fav_playCount: " + fav_playCount);
                    //fav_initUI();
                    fav_reloadUI();
                }                
            } else {
                fav_error("Trouble getting a song of title " + title);
            }
        },
        function() {
            console.log('error');
            fav_error("Trouble getting a song for " + artist);
        }
    );
}

function fav_badSong() {
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        ban_artist: fav_curSong.artist_id,
    };

    fav_terror("banning songs by " + fav_curSong.artist_name);
    $.getJSON(url, args,
        function(data) {
            fav_terror("banned songs by " + fav_curSong.artist_name);
            fav_playNextSong();
        },
        function() {
            fav_error("Trouble creating playlist session for " + artist);
        }
    );
}

function fav_skipSong() {
    console.log('in fav_skipSong');
    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        skip_song: fav_curSong.id
    };

    fav_tinfo("skipping " + fav_curSong.title);
    $.getJSON(url, args,
        function(data) {
            fav_tinfo("skipped " + fav_curSong.title);
            fav_playNextSong();
        },
        function() {
            fav_error("Trouble creating playlist session for " + artist);
        }
    );
}

function fav_goodSong() {

    var url = 'http://developer.echonest.com/api/v4/playlist/dynamic/feedback';

    var args = { 
        api_key : apiKey,
        session_id : session_id,
        favorite_artist: 'last',
        favorite_song: 'last'
    };

    fav_tinfo("favoriting " + fav_curSong.artist_name);
    $.getJSON(url, args,
        function(data) {
            fav_fetchUpNext();
            fav_tinfo("favorited " + fav_curSong.artist_name);
        },
        function() {
            fav_error("Trouble creating playlist session for " + artist);
        }
    );
}



function fav_now() {
    return new Date().getTime();
}

function fav_go() {
    useFavPlayer = true;
    challengerPlaying = false;

    fav_songIndex = 0;
    console.log("In fav-player.js' fav_go().");
    var artist = $("#fav-pl-artist").val();
    var title = $("#fav-pl-title").val();
    if (title.length > 0) {
        //fav_createDynamicPlaylist(artist);
        fav_findSong(artist, title, fav_songIndex);
    } else {
        fav_error("Type an artist first");
    }
    //useFavPlayer = false;
    //go();
}

function fav_initUI() {
    console.log('In fav-player.js fav_initUI().');
    $("#fav-pl-the-player").hide();
    $("#fav-pl-artist").keydown(
        function(){
            if (event.keyCode == 13) {
                fav_go();
            }
        });
    $("#fav-pl-title").keydown(
        function(){
            if (event.keyCode == 13) {
                fav_go();
            }
        });
    $("#fav-pl-go").click(fav_go);

    $("#fav-pl-bad-song").click(fav_badSong);
    $("#fav-pl-good-song").click(fav_goodSong);
    /*
    $('#new-fav').click(function(){
        var artist = fav_curSong.artist;
        var title = fav_curSong.title;
        fav_findSong(artist, title, 0);
        fav_favoriteSong();

    });
    */
}

function fav_reloadUI(){
    /*
    //window.clearTimeout(favGoTimeout);
    reloaded = true;
    console.log('in fav_reloadUI()');
    window.setTimeout(R.player.togglePause, 4000);
    $("#fav-pl-the-form").fadeOut(500);
    //$("#lead-in").fadeIn(500);
    useFavPlayer = true;
    initUI();
    $("#pick-title-div").fadeIn(500);
    $("#pick-artist-div").fadeOut(500);
    //window.setTimeout(fav_go, 8000);
    */

    //$("#reload-div").append('<p>Song not found, please try again</p>');
    $('#reload-div').fadeIn(500);
    $('#reload-btn').on('click', function(){
        location.reload();
    });

    //window.setTimeout(location.reload(), 9000);
}

$(document).ready(function() {
    var fav_trackStartTime = fav_now();

    $.ajaxSetup( {cache: false});
    // fetchApiKey will fetch the Echo Nest demo key for demos
    // hosted on The Echo Nest, otherwise it fetch an empty key
    fetchApiKey( function(api_key, isLoggedIn) {
        if (!api_key) {
            api_key = 'EUFISR9P2AYE4J2ZN';
        }
        apiKey = api_key;
        fav_initUI();
        R.ready(function() {
            R.player.on("change:playingTrack", function(track) {
                console.log('change:playingTrack triggered.');
                if (useFavPlayer){
                    if (track) {
                        console.log('track.attributes.name in change:playingTrack event: '+track.attributes.name);
                        console.log('fav_favEcho.title in change:playingTrack event: '+fav_favEcho.title);
                        console.log('fav_curSong.title in change:playingTrack event: '+fav_curSong.title);
                        console.log('track.attributes.canStream: ' + track.attributes.canStream);
                        if(track.attributes.canStream == false){
                            fav_songIndex++;
                            console.log('track.attributes.album.canStream false, running fav_findSong with fav_songIndex of' + fav_songIndex + ', name of ' + track.attributes.name + 'and artist of ' + track.attributes.artist);
                            fav_findSong(track.attributes.artist, track.attributes.name, fav_songIndex);
                        }
                        if(track.attributes.canStream == true){
                            console.log('track.attributes.canStream is true, setting fav_songIndex back to 0');
                            fav_songIndex = 0;
                            console.log('fav_songIndex', fav_songIndex);
                        }
                        if(fav_favEcho && fav_favEcho.title == track.attributes.name){
                            console.log('fav_favEcho in change:playingTrack event: '+fav_favEcho);
                            var fav_image = track.attributes.icon;
                            $("#fav-pl-rp-album-art").attr('src', fav_image);
                            console.log('change:playingTrack callback changed image');
                            fav_trackStartTime = fav_now();
                        }
                        //fav_playSong(fav_favEcho);
                        //R.player.setCurrentPosition(0);
                    } else {
                        console.log('else statement in change:playingTrack, track not found?');
                        //fav_playNextSong();
                        //fav_playSong(fav_favEcho);
                        fav_played = true;
                        fav_findSong(track.attributes.artist, track.attributes.name, fav_songIndex);
                    }
                }
                if(track.attributes.canStream == true){
                    //useFavPlayer = false;
                }
            });

            R.player.on("change:playState", function(state) {
                if (state == R.player.PLAYSTATE_PAUSED && useFavPlayer == true) {
                    $("#fav-pl-rp-pause-play i").removeClass("icon-pause");
                    $("#fav-pl-rp-pause-play i").addClass("icon-play");
                    $("#fav-pl-rp-pause-play").html('Play');
                }
                if (state == R.player.PLAYSTATE_PLAYING && useFavPlayer == true) {
                    $("#fav-pl-rp-pause-play i").removeClass("icon-play");
                    $("#fav-pl-rp-pause-play i").addClass("icon-pause");
                    $("#fav-pl-rp-pause-play").html('Playing');
                }
            });

            R.player.on("change:playingSource", function(track) {
                if(useFavPlayer){
                    console.log('fav-player change:playingSource: ' + track);
                }
            });

            $('#fav-pl-rp-pause-play').on('click', function() {
                console.log('fav-pl-rp-pause-play triggered.');
                useFavPlayer = true;
                if(challengerPlaying == true){
                    $("#rp-pause-play").html('Play');
                    $("#fav-pl-rp-pause-play").html('Playing');
                    challengerPlaying = false;
                    fav_playSong(fav_favEcho);
                } else if(fav_played == true){
                    fav_played = false;
                    //fav_findSong(track.attributes.artist, track.attributes.name, fav_songIndex);
                    fav_playSong(fav_curSong);
                }else {
                    R.player.togglePause();                    
                }
            });
            $("#fav-pl-rp-next").click(function() {
                console.log('in #fav-pl-rp-next');
                var delta = fav_now() - fav_trackStartTime;

                //submit like button when click next, mostly a test
                //var likeButton = $('#like');
                //console.log('likeButton: ' + likeButton);
                //$('#like').submit();
                
                if (delta < maxTimeForSkip) {
                    //fav_skipSong();
                } else {
                    //fav_playNextSong();
                }
            });

            console.log('rdio ready');
        });
    });
});
