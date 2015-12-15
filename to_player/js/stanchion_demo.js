$(document).ready(function() {

  StanchionDemo.initialize_demo();

});

var StanchionDemo = ( function() {

  var stage_triggered_content = function( triggered_content_to_stage ) {

    function display_triggered_content() {
      $("#image_container").css( 'background-image', triggered_content_to_stage.shift() );

      if ( triggered_content_to_stage.length > 0 ) {
        setTimeout( display_triggered_content, StanchionDemo.TRIGGERED_CONTENT_DISPLAY_SECONDS * 1000 );
      } else {
        setTimeout( reset_to_default, StanchionDemo.TRIGGERED_CONTENT_DISPLAY_SECONDS * 1000 )
      };
    }

    display_triggered_content();
  }

  var reset_to_default = function() {
    console.log("RESET TO DEFAULT");
    $("#image_container").css( 'background-image', StanchionDemo.DEFAULT_BACKGROUND_URL );
    begin_polling_for_data();
  }

  var check_and_act_upon_triggered_content = function( stanchion_xml ) {

    var plus_in_stanchion_xml = $(stanchion_xml).find('numPLU').toArray();

    var triggered_content_to_stage = [];

    plus_in_stanchion_xml.forEach( function( plu, index ) {
      if ( $(plu).text() === StanchionDemo.GOLF_CLUBS_PLU ) {
        console.log("GOLF CLUBS!!!");
        triggered_content_to_stage.push( StanchionDemo.GOLF_BACKGROUND_URL )
      } else if ( $(plu).text() === StanchionDemo.POLO_SHIRT_PLU ) {
        console.log("POLO SHIRT!!!");
        triggered_content_to_stage.push( StanchionDemo.APPAREL_BACKGROUND_URL )
      }
    });

    if ( triggered_content_to_stage.length == 0 ) {
      begin_polling_for_data();
    } else {
      stage_triggered_content( triggered_content_to_stage );
    };

  }

  var begin_polling_for_data = function() {

    (function long_poll() {
      var timer = setTimeout(function(){
        $.ajax({
            url: StanchionDemo.IP_ADDRESS_TO_USE + "/outgoing_stanchion_data_xml",
            method: "GET",
            dataType: "XML"
          }).done(function( data, response_text, request_headers ) {
            console.log("GET SUCCESS");
            window.clearTimeout( timer );
            var request_header_last_modified = request_headers.getResponseHeader( "Last-Modified" );
            if ( request_header_last_modified === StanchionDemo.last_modified_post ) {
              // Do Nothing
              console.log("MATCHING Last-Modified - Continue Polling");
              long_poll();
            } else {
              console.log("DIFFERING Last-Modified - Checking for Triggered Content");
              // Update the last-seen Last-Modified
              StanchionDemo.last_modified_post = request_header_last_modified;
              check_and_act_upon_triggered_content( data )
            };
          }).fail(function(data) {
            console.log("GET FAILED");
            window.clearTimeout( timer );
            long_poll();
          });
      }, (StanchionDemo.POLLING_RATE_SECONDS * 1000) );
    })();

  }

  var preload_images = function() {
    var images_to_preload = [ StanchionDemo.DEFAULT_BACKGROUND_URL, StanchionDemo.GOLF_BACKGROUND_URL, StanchionDemo.APPAREL_BACKGROUND_URL ];
    images_to_preload.forEach(function(image_url, index) {
      $("#preload_image_" + index).css( 'background-image', image_url )
    });
  }

  return {
    initialize_demo: function() {

      // this.IP_ADDRESS_TO_USE                  = "https://shrouded-temple-8115.herokuapp.com";
      this.IP_ADDRESS_TO_USE                  = "http://192.168.25.100:9292";
      this.POLLING_RATE_SECONDS               = 5;
      this.TRIGGERED_CONTENT_DISPLAY_SECONDS  = 5;
      this.GOLF_CLUBS_PLU                     = "2000031744865";
      this.POLO_SHIRT_PLU                     = "2000002434023";
      this.DEFAULT_BACKGROUND_URL             = 'url(images/necam-fs-default.png)'
      this.GOLF_BACKGROUND_URL                = 'url(images/necam-fs-golf.png)'
      this.APPAREL_BACKGROUND_URL             = 'url(images/necam-fs-apparel.png)'

      preload_images();

      reset_to_default();

    }
  }
})();