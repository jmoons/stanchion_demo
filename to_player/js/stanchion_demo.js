$(document).ready(function() {

  var start_text = "Start AJAX Interval";
  var stop_text  = "Stop AJAX Interval";

  // Initialize Start/Stop AJAX Button
  $(".ajax_button").addClass('stopped');

  var ajax_interval_id  = null;

  $(".ajax_button").on('click', function() {
    var $button = $(this);

    var ajax_data_type = $button.data('request_format');
    $button.toggleClass("stopped");

    if ( $button.hasClass("stopped") ) {
      // I am running, stop interval
      $button.text(start_text + " " + ajax_data_type.toUpperCase() );
      clearInterval(ajax_interval_id);
    } else {
      // I am not running, start interval
      $button.text(stop_text + " " + ajax_data_type.toUpperCase() );

      var url = "/outgoing_stanchion_data_" + ajax_data_type
      ajax_interval_id = setInterval( function() {
                          $.ajax({
                              method:   "GET",
                              url:      url,
                              dataType: ajax_data_type
                            }
                          ).done( function(data) {
                            console.log(data);
                          }).fail( function(data) {
                            console.log("UH OH GET FAILED")
                          });
                        }, 3000);
    };
  });

  $("#submit_ajax").on('click', function() {
    var string_to_send = "<?xml version='1.0'?><John>Is Awesome</John>";
    $.ajax({
      method: "POST",
      url: "/incoming_stanchion_data_xml",
      data: string_to_send,
      dataType: 'xml'
    });
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