

(function ($) {

  Drupal.behaviors.EndPoints = {
    attach: function(context, settings) {

//            $.ajax({
//              url : "/testcoges",
//              type : "GET",
//        //      contentType: "application/json",
//        //      dataType: 'json',
////              data : {'dabId': 'test' },
//              success: getStoredEndPointsData,
//            });

//            $.ajax({
//              url : "/coges_engine",
//              type : "POST",
//              contentType: "application/json",
//              data : JSON.stringify({'command_code': '20' }),
//              success: getStoredEndPointsData,
//            });
//
//          function getStoredEndPointsData (data, textStatus, jqXHR) {
//              console.log(data)
//            $('#cogesresp').html(data.response);
//
//          };

    $('#testChecksum').click(function(event) {
        console.log('Checksum')

        $.ajax({
          url : "/api/coges_engine/checksum",
          type : "GET",
//          contentType: "application/json",
//          data : JSON.stringify({'command_code': code }),
          success: getStoredEndPointsData,
        });

        function getStoredEndPointsData (data, textStatus, jqXHR) {
            console.log(data)
//            $('#cogesresp').html(data.response);

            // Pass the response data Object to a javascript function to elaborate the response

//            $.ajax({
//              url : "/api/coges_engine/elab_resp",
//              type : "POST",
//              contentType: "application/json",
//              data : JSON.stringify(data),
//              success: showHumanReadableResp,
//            });

//        function showHumanReadableResp (data, textStatus, jqXHR) {
//            console.log('END')
//        }

        };


        return false;
    });

//    $('button').click(function(event) {
//        console.log('CARICO')
//        console.log($(this).attr("value"))
//
//        var code = $(this).attr("value");
//
//        $.ajax({
//          url : "/api/coges_engine/request",
//          type : "POST",
//          contentType: "application/json",
//          data : JSON.stringify({'command_code': code }),
//          success: getStoredEndPointsData,
//        });
//
//        function getStoredEndPointsData (data, textStatus, jqXHR) {
//            console.log(data)
//            $('#cogesresp').html(data.response);
//
//            // Pass the response data Object to a javascript function to elaborate the response
//
////            $.ajax({
////              url : "/api/coges_engine/elab_resp",
////              type : "POST",
////              contentType: "application/json",
////              data : JSON.stringify(data),
////              success: showHumanReadableResp,
////            });
//
////        function showHumanReadableResp (data, textStatus, jqXHR) {
////            console.log('END')
////        }
//
//        };
//
//
//        return false;
//    });

   }
  };

})(jQuery);