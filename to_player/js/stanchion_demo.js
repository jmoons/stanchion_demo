$(document).ready(function() {

  StanchionDemo.initialize_demo();

});

var StanchionDemo = ( function() {

  var stage_triggered_content = function( triggered_content_to_stage ) {
    // var timeout = setTimeout( function() {
    //   window.clearTimeout(timeout);
    //   reset_to_default();
    // }, StanchionDemo.TRIGGERED_CONTENT_DISPLAY_SECONDS * 1000);

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
    $("#image_container").css( 'background-image', 'url(images/necam-fs-default.png)' );
    begin_polling_for_data();
  }

  var check_and_act_upon_triggered_content = function( stanchion_xml ) {

    var plus_in_stanchion_xml = $(stanchion_xml).find('numPLU').toArray();

    var triggered_content_to_stage = [];

    plus_in_stanchion_xml.forEach( function( plu, index ) {
      if ( $(plu).text() === StanchionDemo.GOLF_CLUBS_PLU ) {
        console.log("GOLF CLUBS!!!");
        triggered_content_to_stage.push('url(images/necam-fs-golf.png)')
      } else if ( $(plu).text() === StanchionDemo.POLO_SHIRT_PLU ) {
        console.log("POLO SHIRT!!!");
        triggered_content_to_stage.push('url(images/necam-fs-apparel.png)')
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
            if ( request_headers.getResponseHeader("MD5_SUM") === StanchionDemo.last_seen_md5 ) {
              // Do Nothing
              console.log("MATCHING MD5 - Continue Polling");
              long_poll();
            } else {
              console.log("DIFFERING MD5 - CHECKING");
              // Update the last-seen MD5
              StanchionDemo.last_seen_md5 = request_headers.getResponseHeader("MD5_SUM");
              check_and_act_upon_triggered_content( data )
            };
            // check_and_act_upon_triggered_content( data )
          }).fail(function(data) {
            console.log("GET FAILED");
            window.clearTimeout( timer );
            long_poll();
          });
      }, (StanchionDemo.POLLING_RATE_SECONDS * 1000) );
    })();

  }

  return {
    initialize_demo: function() {

      // this.IP_ADDRESS_TO_USE                  = "https://shrouded-temple-8115.herokuapp.com";
      this.IP_ADDRESS_TO_USE                  = "http://192.168.25.13:9292";
      this.POLLING_RATE_SECONDS               = 5;
      this.TRIGGERED_CONTENT_DISPLAY_SECONDS  = 5;
      this.GOLF_CLUBS_PLU                     = "2000031744865";
      this.POLO_SHIRT_PLU                     = "2000002434023";

      begin_polling_for_data();

    }
  }
})();