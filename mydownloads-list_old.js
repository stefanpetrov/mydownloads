
(function ($) {
    Drupal.mydownloadsList = function(context) {
        $('.mydownloads-item .nid', context).addClass('element-invisible').before($('<div class="remove">x</div>'));
        $('.button-remove', context).addClass('element-invisible');
        $('#mydownloads-list-form .mydownloads-item.selected').addClass('element-invisible');
        $('.mydownloads-item', context).click(function(event) {
            var wrapper = $(this);
            if ($(event.target).is('div.remove')) {
                if ($(wrapper).is('mydownloads-waiting'))
                    return false;
                $(wrapper).addClass('mydownloads-waiting');
                var checkb = $('input:checkbox', $(wrapper));
                $(checkb).removeAttr('checked');
                $.ajax({
                    type: 'POST',
                    url: '/mydownloads/list/remove/'+$(checkb).val(),
                    data: {
                        js: true,
                        token : $('input[name="token-'+$(checkb).val()+'"]').val()
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.status) {
                            $(wrapper).fadeOut();
                            $('.mydownloads-count').html(data.count);
                        } else {
                            // Failure.
                            alert(data.errorMessage);
                            $wrapper.removeClass('mydownloads-waiting');
                        }
                    },
                    error: function (xmlhttp) {
                        alert('An HTTP error '+ xmlhttp.status +' occurred.\n'+ element.href);
                        $(wrapper).removeClass('mydownloads-waiting');
                    }
                });
            } else {
                $(wrapper).toggleClass('selected');
                $('input:checkbox', $(wrapper)).attr('checked', $(wrapper).hasClass('selected') ? 'checked' : '');
            }
            validateSize();
            return false;
        });

        function validateSize() {
            var totalsize = 0;
            if (undefined != Drupal.settings.mydownloads.zipsize) {
                $('.mydownloads-item.selected input:checkbox').each(function(){
                    totalsize += parseInt($('input[name="size-'+$(this).val()+'"]').val());
                });
                console.log(totalsize);
                if (totalsize > Drupal.settings.mydownloads.zipsize) {
                    $('.zipsize-alert').removeClass('element-invisible');
                    $('#mydownloads-list-form input:submit').each(function(){
                        $(this).attr('disabled','disabled').addClass('form-button-disabled');
                    });
                } else {
                    $('.zipsize-alert').addClass('element-invisible');
                    $('#mydownloads-list-form input:submit').each(function(){
                        $(this).removeAttr('disabled').removeClass('form-button-disabled');
                    });
                }
            }
        }
    };

    Drupal.behaviors.mydownloadsList = {};
    Drupal.behaviors.mydownloadsList.attach = function(context) {
        Drupal.mydownloadsList(context);

    };
})(jQuery);