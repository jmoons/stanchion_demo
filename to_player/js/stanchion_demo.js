$(document).ready(function() {

  StanchionDemo.initialize_demo();

});

var StanchionDemo = ( function() {

  var stage_triggered_content = function() {
    var timeout = setTimeout( function() {
      window.clearTimeout(timeout);
      reset_to_default();
    }, StanchionDemo.TRIGGERED_CONTENT_DISPLAY_SECONDS * 1000);
  }

  var reset_to_default = function() {
    console.log("RESET TO DEFAULT");
    $("#image_container").css( 'background-image', 'url(images/necam-fs-default.png)' );
    begin_polling_for_data();
  }

  var check_and_act_upon_triggered_content = function( stanchion_xml ) {

    var plus_in_stanchion_xml = $(stanchion_xml).find('numPLU').toArray();
    var found_matching_plu    = false;

    plus_in_stanchion_xml.forEach( function( plu, index ) {
      if ( $(plu).text() === StanchionDemo.GOLF_CLUBS_PLU ) {
        found_matching_plu = true;
        console.log("GOLF CLUBS!!!");
        $("#image_container").css( 'background-image', 'url(images/necam-fs-golf.png)' );
        stage_triggered_content();
      } else if ( $(plu).text() === StanchionDemo.POLO_SHIRT_PLU ) {
        found_matching_plu = true;
        console.log("POLO SHIRT!!!");
        $("#image_container").css( 'background-image', 'url(images/necam-fs-apparel.png)' );
        stage_triggered_content();
      }
    });

    if (!found_matching_plu) {
      begin_polling_for_data();
    };

  }

  var begin_polling_for_data = function() {

    (function long_poll() {
      var timer = setTimeout(function(){
        $.ajax({
            url: StanchionDemo.IP_ADDRESS_TO_USE + "/outgoing_stanchion_data_xml",
            method: "GET",
            dataType: "XML"
          }).done(function(data) {
            console.log("GET SUCCESS");
            window.clearTimeout( timer );
            check_and_act_upon_triggered_content( data )
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
      this.IP_ADDRESS_TO_USE                  = "http://192.168.25.100:9292";
      this.POLLING_RATE_SECONDS               = 5;
      this.TRIGGERED_CONTENT_DISPLAY_SECONDS  = 5;
      this.GOLF_CLUBS_PLU                     = "2000031744865";
      this.POLO_SHIRT_PLU                     = "2000002434023";

      begin_polling_for_data();

    }
  }
})();