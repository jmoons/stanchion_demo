$(document).ready(function() {

  StanchionDemo.initialize_demo();

  (function poll() {
    setTimeout(function(){
      $.ajax({ 
          url: "http://192.168.25.100:9292/outgoing_stanchion_data_xml",
          method: "GET",
          dataType: "XML"
        }).done(function(data){
          //Update your dashboard gauge
          salesGauge.setValue(data.value);

          //Setup the next poll recursively
          poll();
        });
    }, 5000);
  })();
});

var StanchionDemo = ( function() {
  return {
    initialize_demo: function() {
      console.log("CONNECTION")
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