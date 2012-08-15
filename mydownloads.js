(function ($) {
    Drupal.mydownloads = function(context) {

        var archivesize = 0;

        function updateLink(element, newHtml, count) {
            var $newLink = $(newHtml);

            // Reattach the behavior to the new <A> element. This element
            // is either whithin the wrapper or it is the outer element itself.
            var $nucleus = $newLink.is('a') ? $newLink : $('a.mydownloads', $newLink);
            $nucleus.addClass('mydownloads-processed').click(mydownloadsClick);

            // Find the wrapper of the old link.
            var $wrapper = $(element).parents('.mydownloads-wrapper:first');
            if ($wrapper.length == 0) {
                // If no ancestor wrapper was found, or if the 'flag-wrapper' class is
                // attached to the <a> element itself, then take the element itself.
                $wrapper = $(element);
            }
            // Replace the old link with the new one.
            $wrapper.after($newLink).remove();
            Drupal.attachBehaviors($newLink.get(0));

            $('.mydownloads-count').html(count);

            return $newLink.get(0);
        }

        function mydownloadsClick() {
            var element = this;
            var $wrapper = $(element).parents('.mydownloads-wrapper');
            if ($wrapper.is('.mydownloads-waiting')) {
                // Guard against double-clicks.
                return false;
            }
            $wrapper.addClass('mydownloads-waiting');
            $.ajax({
                type: 'POST',
                url: element.href,
                data: {
                    js: true
                },
                dataType: 'json',
                success: function (data) {
                    if (data.status) {
                        // Success.
                        data.link = $wrapper.get(0);
                        $.event.trigger('flagGlobalBeforeLinkUpdate', [data]);
                        if (!data.preventDefault) { // A handler may cancel updating the link.
                            data.link = updateLink(element, data.newLink, data.count);
                        }
                        $.event.trigger('flagGlobalAfterLinkUpdate', [data]);
                        //refreshFormBlock();
                    }
                    else {
                        // Failure.
                        alert(data.errorMessage);
                        $wrapper.removeClass('mydownloads-waiting');
                    }
                },
                error: function (xmlhttp) {
                    alert('An HTTP error '+ xmlhttp.status +' occurred.\n'+ element.href);
                    $wrapper.removeClass('mydownloads-waiting');
                }
            });
            return false;
        }

        function refreshFormBlock() {
            var w = $('#block-mydownloads-mydownloads .content', context);
            if ($(w) == 0) return false;
            $('.mydownloads-overlay', w).removeClass('element-invisible');
            $.ajax({
                type: 'POST',
                url: '/mydownloads/block',
                data: {
                    js: true
                },
                dataType: 'json',
                success: function (data) {
                    if (data.status) {
                        $('form', w).remove();
                        var $newForm = $(data.content);
                        w.after($newForm).remove();
                        Drupal.attachBehaviors($newForm.get(0));
                        $('form', $newForm).attr('action','node');
                    }
                }
            });
        }


        $('a.mydownloads:not(.mydownloads-processed)', context).addClass('mydownloads-processed').click(mydownloadsClick);


    };

    Drupal.behaviors.mydownloads = {};
    Drupal.behaviors.mydownloads.attach = function(context) {
        Drupal.mydownloads(context);
    };
})(jQuery);
