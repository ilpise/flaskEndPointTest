
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
      url : "/modbus/api/alarms",
      type : "GET",
      success: readAlarms,
    });

    function readAlarms (data, textStatus, jqXHR) {
        console.log(data)

        let alarms = ['K_ALM_TIMEOUT_FASE10',
        'K_ALM_TIMEOUT_FASE20',
        'K_ALM_TIMEOUT_FASE30',
        'K_ALM_TIMEOUT_FASE40',
        'ALM_START_SOFFIANTE_NOK',
        'ALM_FUNGO_SOFFIANTE',
        'ALM_PTC_SOFFIANTE',
        'ALM_TERMICA_SOFFIANTE',
        'ALM_TUBO_SCOLLEGATO']
        var out = '';
        $.each(data.response, function( index, value ) {
            console.log( index + ": " + value );
            if (value) {
               out += '<span class="badge badge-success">'+alarms[index]+'</span>';
            } else {
               out += '<span class="badge badge-danger">'+alarms[index]+'</span>';
            }
        });
//            $('#mbresponse').html(data.response);
        $('#alarms').html(out);
    };


   }
  };

})(jQuery);