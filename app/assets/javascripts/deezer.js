/*
var DEEZER_DEMO_API_KEY='EUFISR9P2AYE4J2ZN';

var audio
jQuery.ajaxSettings.traditional = true;


function createSongDiv(song) {
    var songDiv = $("<div class='sdiv' id=" + song.id + "-div>");
    return songDiv;
}

function addSongs(songs) {
    var playlist = $("#playlist");

    for (var i = 0; i < songs.length; i++) {
        var div = createSongDiv(songs[i]);
        playlist.append(div);
        fetchDeezerTrack(songs[i], div);
    }
}


function fetchDeezerTrack(song, div) {
    if (song.tracks.length > 0) {
        var tid = song.tracks[0].foreign_id.split(':')[2];
        var url = 'http://api.deezer.com/2.0/track/' + tid + '?callback=?'

        jQuery.getJSON(url, { output:'jsonp'},
            function(data) {
                var link = $("<a target='deezer'>").attr('href', data.link);
                var cover = $("<img class='timg'>").attr('src', data.album.cover).attr("style", "float:left");
                link.append(cover);
                div.append(link);

                var tdiv = $("<div class='tdiv'>");
                tdiv.append( $("<div class='title'>").text(data.title));
                tdiv.append( $("<div>").text(data.album.title));
                tdiv.append( $("<div>").text(data.artist.name));
                div.append(tdiv);
                div.append(createPlayer(data.preview));
                div.append($('<br clear="left">'));
            }
        );
    }
}

function createPlayButton(audio) {
    var button = $("<button>").text("preview");
    button.click( 
        function()  {
            alert("Playing " + audio);
        }
    );
    return button;
}

function createPlayer(audio) {
    var player = $("<audio class='player' preload='none' controls='controls'>").attr("src", audio);
    return player;
}


function info(msg) {
    $("#info").text(msg);
}

function fetchPlaylist(artist) {
    info("Getting playlist for " + artist);
    $("#playlist").empty();
    var url = 'http://developer.echonest.com/api/v4/playlist/static?callback=?'
    jQuery.getJSON(url, 
        {   artist:artist, 
            type:'artist-radio', 
            format:'jsonp', 
            bucket: ['id:deezer', 'tracks'],
            limit: true,
            'api_key' : DEEZER_DEMO_API_KEY
        },
        function(data) {
            info("");
            if (data.response.status.code == 0) {
                var songs = data.response.songs;
                addSongs(songs);
            } else {
                info("Can't create a playlist for " + artist);
            }
        }
    );
}

function initUI() {
    $("#artist-name").keypress(
        function(e) {
            if(e.which == 13) {
                var artist = $("#artist-name").val();
                fetchPlaylist(artist);
            }
        }
    );
}


$(document).ready(
    function() {
        initUI();
    }
);
*/
