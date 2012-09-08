var incBoard = new IncBoard();

function  IncBoard() {
    this.searchString = "";
    this.rows = 7;
    this.cols = 14;
    this.cellSizeX = 56;
    this.cellSizeY = 44;
}

IncBoard.prototype.insert = function(v, row, col) {
    cell = new IncBoardCell(this.cellSizeX, this.cellSizeY);
    cell.setContent(v);
    cell.setPos(row, col);
    cellHtml = cell.getHtml();
    $('#subtitle').subtitleAdd(v.artist);
    cellHtml.css('background-color', $('#subtitle').subtitleGetColor(v.artist));
    console.log(v.artist);
    console.log($('#subtitle').subtitleGetColor(v.artist));
    $('#incboard-result #incboard').append(cellHtml);
}

IncBoard.prototype.clean = function() {
    var table = $('<div id="incboard"></div>');
    table.css('width', this.cols * this.cellSizeX);
    table.css('height', this.rows * this.cellSizeY);
    $('#incboard-result').html(table);
}

IncBoard.prototype.init = function() {
    this.clean();
    this.animateCells();
}

IncBoard.prototype.focusArtist = function(artist) {
    $.each($('.incboard-cell'), function(i, e) {
        if($(this).attr('artist') === artist)
            $(this).addClass('focus');
        else
            $(this).removeClass('focus');
    });
}

IncBoard.prototype.animateCells = function() {
    var incBoard = this;
    $('.incboard-cell').live('mouseover', function(e) {
        $('.incboard-img').css('display', 'block');
        $('.incboard-cell').find('.inevidence').removeClass('inevidence');
        $(this).find('.object-music').addClass('inevidence');
        $(this).find('.incboard.img').css('display', 'none');

        incBoard.focusArtist($(this).attr('artist'));
    });

    $('.incboard-cell').live('mouseleave', function(e) {
        $('.incboard-img').css('display', 'block');
        $('.incboard-cell').find('.inevidence').removeClass('inevidence');
        $('.incboard-cell').removeClass('focus');
    });

    $('#subtitle li').live('hover', function(e) {
        incBoard.focusArtist($(this).attr('artist'));
        $('html').css('cursor', 'pointer');
    });

    $('#subtitle li').live('mouseleave', function(e) {
        $('.incboard-cell').removeClass('focus');
        $('html').css('cursor', 'default');
    });
}

IncBoard.prototype.searchMusic = function(artist, musicTitle, pos) {
    $.get('/api/searchmusic', {
        'artist': artist,
        'musicTitle': musicTitle
    }, function(v) {
        incBoard.insert(v, Math.floor(pos / incBoard.cols), pos % incBoard.cols);
    }, 'json');
}


$(document).ready(function() {
    incBoard.init();
    $('#incboard-search').ajaxForm({
        dataType: 'json',
        success: function (data) {
            $.bootstrapMessageOff();
            $.each(data[0], function(i, s) {
                var k = i + 1;
                if(k < incBoard.cols * incBoard.rows)
                    incBoard.searchMusic(s.artist, s.musicTitle, k);
            });
        },
        beforeSubmit: function() {
            $('#subtitle').subtitleInit();
            incBoard.searchString = $('#q').val();
            console.log($('#q').val());
            $.bootstrapMessage('Loading...', 'info');
            incBoard.clean();
            incBoard.searchMusic($('#artist').val(), $('#musicTitle').val(), 0);
        }
    });

});
