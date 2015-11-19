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

  $(".submit_form_button").on('click', function(event) {

    var button_id         = event.target.getAttribute('id')
    var data_to_send      = null;
    var url_to_send_to    = null;
    var data_to_send_type = null;

    if ( button_id == "submit_as_xml") {
      url_to_send_to    = "/incoming_stanchion_data_xml";
      data_to_send_type = "xml";

      var xml_document = $.parseXML("<root/>");
      $(".input-group-addon").each(function(index) {
        var sibling_input       = $(this).siblings('input')[0];
        var sibling_input_name  = sibling_input.getAttribute('name');

        var new_elment = xml_document.createElement(sibling_input_name);
        new_elment.appendChild(document.createTextNode( $(sibling_input).val()) );
        xml_document.documentElement.appendChild(new_elment);
      });

      data_to_send = new XMLSerializer().serializeToString(xml_document)
    } else {
      url_to_send_to    = "/incoming_stanchion_data_json";
      data_to_send_type = "json";
      data_to_send      = [];

      $(".input-group-addon").each(function(index) {
        var sibling_input       = $(this).siblings('input')[0];
        var sibling_input_name  = sibling_input.getAttribute('name');

        var parameter_object = {};
        parameter_object[sibling_input_name] = $(sibling_input).val();
        data_to_send = data_to_send.concat(parameter_object);
      });

      data_to_send = JSON.stringify(data_to_send);
    };

    $.ajax({
      method: "POST",
      url: url_to_send_to,
      data: data_to_send,
      dataType: data_to_send_type
    }).done( function(data, textStatus) {
      console.log("Success");
    }).fail( function(data, textStatus) {
      console.log("FAILED TO POST");
    })

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