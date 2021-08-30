(function ($) {

  Drupal.behaviors.SetCsrfToken = {
    attach: function(context, settings) {

          console.log(Drupal.settings)
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                      xhr.setRequestHeader("X-CSRFToken", Drupal.settings.CsrfToken);
                  }
              }
          });

    }
  };

})(jQuery);