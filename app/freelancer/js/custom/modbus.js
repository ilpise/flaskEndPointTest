
(function ($) {

  Drupal.behaviors.Modbus = {
    attach: function(context, settings) {

    $('#eroga').click(function(event) {
        console.log('EROGA')
        $(this).prop("disabled", true)
//        console.log($(this).attr("value"))
        console.log($('#peso_finale').val())
        console.log($('#soglia').val())
        var pesoFinale = $('#peso_finale').val();
        var soglia = $('#soglia').val()
        if(parseInt(pesoFinale) > parseInt(soglia)) {
            $.ajax({
              url : "/modbus/api/eroga",
              type : "POST",
              contentType: "application/json",
              data : JSON.stringify({'peso_finale': pesoFinale , 'soglia' : soglia}),
              success: readModbusResponse,
            });

            function readModbusResponse (data, textStatus, jqXHR) {
                $('#eroga').prop("disabled", false)
                console.log(data)
    //            $('#mbresponse').html(data.response);
                $('#erogresponse').html(data.response);
            };
        } else {
          setTimeout(function(){ $('#eroga').prop("disabled", false); }, 3000);
          $('#erogresponse').html('Il peso finale non è maggiore della soglia');
        }
        return false;
    });

    $('#s2_carico').click(function(event) {
        console.log('CARICO')
        $(this).prop("disabled", true)
        $.ajax({
          url : "/modbus/api/carico",
          type : "GET",
          success: caricoResponse,
        });

        function caricoResponse (data, textStatus, jqXHR) {
            $('#s2_carico').prop("disabled", false)
            console.log(data)
//            $('#mbresponse').html(data.response);
            $('#carresponse').html(data.response);
        };

        return false;
    });

    $('#s2_stop_carico').click(function(event) {
        console.log('STOP CARICO')
        $(this).prop("disabled", true)
        $.ajax({
          url : "/modbus/api/stop_carico",
          type : "GET",
          success: stopCaricoResponse,
        });

        function stopCaricoResponse (data, textStatus, jqXHR) {
            $('#s2_stop_carico').prop("disabled", false)
            console.log(data)
//            $('#mbresponse').html(data.response);
            $('#carresponse').html(data.response);
        };

        return false;
    });

    $('#reset_alarms').click(function(event) {
        console.log('RESET ALARMS')
        $(this).prop("disabled", true)
        $.ajax({
          url : "/modbus/api/reset_alarms",
          type : "GET",
          success: resetResponse,
        });

        function resetResponse (data, textStatus, jqXHR) {
            $('#reset_alarms').prop("disabled", false)
            console.log(data)
//            $('#mbresponse').html(data.response);
//            $('#carresponse').html(data.response);
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
        $.each(data.rc1, function( index, value ) {
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