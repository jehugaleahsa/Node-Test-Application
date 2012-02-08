$(function() {

    // extend jQuery to validate with bootstrap
    (function($) {
      $.fn.bs_validate = function(options) {
        var bootstrapOptions = {
            errorClass: 'error',
            validClass: 'success',
            errorElement: 'span',
            highlight: function (element, errorClass, validClass) { 
                $(element).parents(".control-group").addClass(errorClass).removeClass(validClass); 
            }, 
            unhighlight: function (element, errorClass, validClass) { 
                $(element).parents(".error").removeClass(errorClass).addClass(validClass); 
            }
        };
        var merged = {};
        $.extend(merged, options, bootstrapOptions);
        this.validate(merged);
      };
    })( jQuery );

    // /home/create
    $('.create-user-frm').bs_validate({
        rules: {
            name: { required: true }
        }
    });
});