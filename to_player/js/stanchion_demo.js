$(document).ready(function() {

  StanchionDemo.initialize_demo();

});

var StanchionDemo = ( function() {

  var begin_polling_for_data = function() {

    (function long_poll() {
      setTimeout(function(){
        $.ajax({
            url: StanchionDemo.IP_ADDRESS_TO_USE + "/outgoing_stanchion_data_xml",
            method: "GET",
            dataType: "XML"
          }).done(function(data) {
            console.log("Sweet dude, you got a GET");

            //Setup the next poll recursively
            long_poll();
          }).fail(function(data) {
            console.log("GET FAILED - RELOADING");
            document.location.reload(true);
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