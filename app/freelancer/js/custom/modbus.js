
(function ($) {

  Drupal.behaviors.Modbus = {
    attach: function(context, settings) {

    $('button .erog').click(function(event) {
        console.log('PING')
        console.log($(this).attr("value"))

        $.ajax({
          url : "/modbus/api/",
          type : "GET",
          success: readModbusResponse,
        });

        function readModbusResponse (data, textStatus, jqXHR) {
            console.log(data)
//            $('#mbresponse').html(data.response);
            $('#erogresponse').html(data.response);
        };

        return false;
    });

    $('#s2_carico').click(function(event) {
        console.log('CARICO')

        $.ajax({
          url : "/modbus/api/carico",
          type : "GET",
          success: caricoResponse,
        });

        function caricoResponse (data, textStatus, jqXHR) {
            console.log(data)
//            $('#mbresponse').html(data.response);
            $('#carresponse').html(data.response);
        };

        return false;
    });

   // Get alarm status on enter
   $.ajax({
      url : "/modbus/api/",
      type : "GET",
      success: readAlarms,
    });

    function readAlarms (data, textStatus, jqXHR) {
        console.log(data)
//            $('#mbresponse').html(data.response);
        $('#alarms').html(data.response);
    };


   }
  };

})(jQuery);