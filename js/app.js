$(function() {
  var Giphy = function(query) {
    this.query = query;
    this.offset = 0;
    $('.more').unbind('click');
    $('.more').click($.proxy(function() { this.fetch(); }, this));
  }
  Giphy.prototype = {
    apiKey: 'dc6zaTOxFJmzC',
    limit: 18,
    fetch: function() {
      if (this.offset == 0) {
        $('.grid').empty()
                  .masonry();
      }
      $.ajax({
        url: 'http://api.giphy.com/v1/gifs/search',
        data: {
          q: this.query,
          api_key: this.apiKey,
          limit: this.limit,
          offset: this.offset
        },
        success: $.proxy(function(res) { this.render(res.data); }, this),
        faile: $.proxy(function(res) { this.renderNoResult(); }, this)
      });
    },
    render: function(data) {
      if (data.length == 0) {
        this.renderNoResult();
        return;
      }
      data.forEach($.proxy(function(datumn) {
        var $item = $('<li class="grid-item"></li>');
        var $img = $('<img src="' + datumn.images.fixed_width.url + '" height="' + datumn.images.fixed_width.height + '">');
        var $overlay = $('<div class="grid-item-overlay"></div>');
        $overlay.append('<button class="clip-button" data-clipboard-text="![](' + datumn.images.fixed_width.url + ')" href="javascript:void(0)">clip markdown text</button>')
                .append('<button class="clip-button" data-clipboard-text="' + datumn.url + '" href="javascript:void(0)">clip url</button>')
        $item.append($img).append($overlay);
        $('.grid').append($item).masonry('appended', $item);
        this.offset++;
      }, this));
      $('.noresult').hide();
      $('.more').css('display', 'block');
    },
    renderNoResult: function() {
      $('.noresult').show();
      $('.more').hide();
    }
  }

  $(document).ready(function() {

    // Initialize Msonry
    $('.grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: 200,
      gutter: 10,
      isFitWidth: true,
      transitionDuration: '0.2s'
    });

    // Initialize clipboard
    var clipboard = new Clipboard('.clip-button');
    clipboard.on('success', function(e) {
      $('.clipboard-overlay').fadeIn(200);
      setTimeout(function() {
        console.log(e.text);
        $('.clipboard-overlay').fadeOut(200);
      }, 2000)
    });

    $('#query-text').focus();
    $('#search-form').submit(function() {
      var query = $('#query-text').val();
      var giphy = new Giphy(query);
      giphy.fetch();
      return false;
    });
  });

});
