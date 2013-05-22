
(function ($) {
    Drupal.mydownloadsList = function(context) {
        var totalsize = 0;
        $('#mydownloads-list-form .form-submit.button-download').click(function(){
            totalsize = 0;
            $('#mydownloads-list-form .form-checkbox:checked').each(function(){
                totalsize += parseInt($('input[name=size-'+$(this).val()+']').val());
            });
            if (Drupal.settings.mydownloads.zipsize > 0 && totalsize > Drupal.settings.mydownloads.zipsize) {
                $('.zipsize-alert').removeClass('element-invisible');
                return false;
            }
        });
        $('#mydownloads-list-form .form-checkbox').change(function(){
             $('.zipsize-alert').addClass('element-invisible');
        });
    };

    Drupal.behaviors.mydownloadsList = {};
    Drupal.behaviors.mydownloadsList.attach = function(context) {
        Drupal.mydownloadsList(context);

    };
})(jQuery);