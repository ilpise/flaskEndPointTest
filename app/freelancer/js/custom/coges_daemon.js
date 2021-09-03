(function ($) {

  Drupal.behaviors.CogesDaemon = {
    attach: function(context, settings) {

    var semaphore = true;

    function resetSemaphore (data, textStatus, jqXHR) {
       console.log(data)
       semaphore = true
       getCreditAll()
    }

    var getCreditAll = function() {
         code = "70"

     $.ajax({
          url : "/api/coges_engine/request",
          type : "POST",
          contentType: "application/json",
          data : JSON.stringify({'command_code': code }),
          success: getStoredEndPointsData,
        });

        function getStoredEndPointsData (data, textStatus, jqXHR) {
            console.log(data)
//            $('#cogesresp').html(data.response);
//            001000 1 0 0 0 0

            // Transform the 001000 in $31 $30 $30 $30

            credit = data.response.slice(0,6)
            cashcredit = data.response.slice(6,7)
            keycredit = data.response.slice(7,8)
            cashLess1 = data.response.slice(8,9)
            cashLess2 = data.response.slice(9,10)
            creditcard = data.response.slice(10,11)
            checksum = data.response.slice(-2)

            console.log(credit)
            console.log(cashcredit)
            console.log(checksum)

            $('#credit').html(parseFloat(credit/100).toFixed(2))

            // SALE j6 = $80 or a7 = $81
            if (credit > 0){
               semaphore = false;
               $.ajax({
                  url : "/api/coges_engine/request",
                  type : "POST",
                  contentType: "application/json",
                  data : JSON.stringify({'command_code': "80", 'deductVal' : credit }),
                  success: resetSemaphore,
                });
            }

            // Pass the response data Object to a javascript function to elaborate the response
            if (semaphore) {
                getCreditAll();
            }

       };

    };

    getCreditAll();


//    var intervalID = setInterval(myCallback, 1000, 'Parameter 1', 'Parameter 2');
//
//    function myCallback(a, b)
//    {
//     // Your code here
//     // Parameters are purely optional.
//     console.log(a);
//     console.log(b);
//
//     code = "70"
//
//     $.ajax({
//          url : "/api/coges_engine/request",
//          type : "POST",
//          contentType: "application/json",
//          data : JSON.stringify({'command_code': code }),
//          success: getStoredEndPointsData,
//        });
//
//        function getStoredEndPointsData (data, textStatus, jqXHR) {
//            console.log(data)
////            $('#cogesresp').html(data.response);
//
//            // Pass the response data Object to a javascript function to elaborate the response
//
//
//       };
//    }

  }
  };

})(jQuery);