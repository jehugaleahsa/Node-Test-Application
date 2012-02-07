$(function() {

    // extend jQuery to validate with bootstrap
    (function($) {
      $.fn.bs_validate = function() {
        this.validate({
            errorClass: 'error',
            validClass: 'success',
            errorElement: 'div',
            highlight: function (element, errorClass, validClass) { 
                $(element).parents(".control-group").addClass(errorClass).removeClass(validClass); 
            }, 
            unhighlight: function (element, errorClass, validClass) { 
                $(element).parents(".error").removeClass(errorClass).addClass(validClass); 
            }
        });
      };
      $.fn.required = function(isRequired) {
        if (typeof variable === 'undefined' || isRequired) {
            this.addClass('required');
        } else {
            this.removeClass('required');
        }
      };
    })( jQuery );

    // /home/create
    $('.create-user-name-txt').required();    
    $('.create-user-frm').bs_validate();
});