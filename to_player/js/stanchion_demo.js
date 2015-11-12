$(document).ready(function() {

  var start_json_text = "Start JSON AJAX Interval";
  var start_xml_text  = "Start XML AJAX Interval";

  var stop_json_text  = "Stop JSON AJAX Interval";
  var stop_xml_text   = "Stop XML AJAX Interval";

  // Initialize Start/Stop AJAX Button
  $("#json_button").addClass('stopped');
  $("#xml_button").addClass('stopped');

  $("#json_button").text(start_json_text);
  $("#xml_button").text(start_xml_text);

  var json_interval_id  = null;
  var xml_interval_id   = null;

  $("#json_button").on('click', function() {
    var $button = $(this);

    $button.toggleClass("stopped");

    if ( $button.hasClass("stopped") ) {
      // I am running, stop interval
      $button.text(start_json_text);
      clearInterval(json_interval_id);
    } else {
      // I am not running, start interval
      $button.text(stop_json_text);
      json_interval_id = setInterval( function() {
                          $.ajax({
                              method:   "GET",
                              url:      "/outgoing_stanchion_data_json",
                              dataType: "json"
                            }
                          ).done( function(data) {
                            console.log(data);
                          }).fail( function(data) {
                            console.log("UH OH GET FAILED")
                          });
                        }, 3000);
    };
  });

  $("#xml_button").on('click', function() {
    var $button = $(this);

    $button.toggleClass("stopped");

    if ( $button.hasClass("stopped") ) {
      // I am running, stop interval
      $button.text(start_xml_text);
      clearInterval(xml_interval_id);
    } else {
      // I am not running, start interval
      $button.text(stop_xml_text);
      xml_interval_id = setInterval( function() {
                          $.ajax({
                              method:   "GET",
                              url:      "/outgoing_stanchion_data_xml",
                              dataType: "xml"
                            }
                          ).done( function(data) {
                            console.log(data);
                          }).fail( function(data) {
                            console.log("UH OH GET FAILED")
                          });
                        }, 3000);
    };
  });

});

var StanchionDemo = ( function() {

})();

// HOW TO PARSE XML INPUT
// $(data).find('numPLU')
// [<numPLU>​2400056785650​</numPLU>​, <numPLU>​2400056785643​</numPLU>​]

// test = test[0]
// <numPLU>​2400056785650​</numPLU>​

// test.textContent
// "2400056785650"