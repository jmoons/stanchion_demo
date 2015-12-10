$(document).ready(function() {

  StanchionDemo.initialize_demo();

});

var StanchionDemo = ( function() {

  var check_and_act_upon_triggered_content = function( stanchion_xml ) {
    var golf_clubs_plu = "2000000368177";
    var polo_shirt_plu = "200004528782";

    var plus_in_stanchion_xml = $(stanchion_xml).find('numPLU').toArray();
    plus_in_stanchion_xml.forEach( function( plu, index ) {
      if ( $(plu).text() === golf_clubs_plu ) {
        console.log("GOLF CLUBS!!!");
      } else if ( $(plu).text() === polo_shirt_plu ) {
        console.log("POLO SHIRT!!!");
      };
    });
  }

  var begin_polling_for_data = function() {

    (function long_poll() {
      setTimeout(function(){
        $.ajax({
            url: StanchionDemo.IP_ADDRESS_TO_USE + "/outgoing_stanchion_data_xml",
            method: "GET",
            dataType: "XML"
          }).done(function(data) {
            console.log("GET SUCCESS");
            check_and_act_upon_triggered_content( data )
          }).fail(function(data) {
            console.log("GET FAILED");
          }).always(function(data) {
            console.log("GET ALWAYS - REPOLLING");
            //Setup the next poll recursively
            long_poll();
          });
      }, (StanchionDemo.POLLING_RATE_SECONDS * 1000) );
    })();

  }

  return {
    initialize_demo: function() {

      this.IP_ADDRESS_TO_USE    = "http://192.168.25.100:9292";
      this.POLLING_RATE_SECONDS = 5;

      begin_polling_for_data();

    }
  }
})();

// HOW TO PARSE XML INPUT
// $(data).find('numPLU')
// [<numPLU>​2400056785650​</numPLU>​, <numPLU>​2400056785643​</numPLU>​]

// test = test[0]
// <numPLU>​2400056785650​</numPLU>​

// test.textContent
// "2400056785650"