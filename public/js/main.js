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
                $(element).parents(".control-group").removeClass(errorClass).addClass(validClass); 
            }
        };
        var merged = {};
        $.extend(merged, options, bootstrapOptions);
        return this.validate(merged);
      };
    })(jQuery);
    
    var templates = {};
    $('#create-user-btn').on('click', function (e) {
        if ('create-user' in templates) {
            $('#add-user-modal').modal('show');
        } else {
            $.ajax({ url: '/templates/create-user-modal.html', type: 'GET' })
             .success(function (data) {
                $('.templates').append(data);
                templates['create-user'] = true;
                prepareCreateUserTemplate();
                $('#add-user-modal').modal('show');
             });
        }
    });
    
    $('.edit-user-btn').on('click', function (e) {
        var userId = $(this).attr('data-user-id');
        alert(userId);
    });
    
    $('.remove-user-btn').on('click', function (e) {
        var userId = $(this).attr('data-user-id');
        if ('remove-user' in templates) {
            populateRemoveTemplate(userId);
        } else {
            $.ajax({ url: '/templates/remove-user-modal.html', type: 'GET' })
             .success(function (data) {
                $('.templates').append(data);
                templates['remove-user'] = true;
                populateRemoveTemplate(userId);
             });
        }
    });
});

function prepareCreateUserTemplate() {
    var $form = $('#create-user-frm');
    // validation
    $form.bs_validate({
        rules: {
            name: { required: true }
        }
    });
    
    // submission
    $('#create-user-submit-btn').on('click', function (e) {
        if ($form.valid()) {
            $.ajax({ url: '/user', type: 'POST', data: $form.serialize(), dataType: 'JSON' })
             .success(function(user) {
                // TODO - add row to table 
             });
            $('#add-user-modal').modal('hide');
        }
    });
}

function populateRemoveTemplate(userId) {
    var $template = $('#remove-user-modal');
    var url = ['/user/', userId, '/details'].join('');
    $.ajax({ url: url, type: 'POST', dataType: 'JSON' })
     .success(function (user) {
        var template = Handlebars.compile($template.get(0).outerHTML);
        var $modal = $(template(user));
        $modal.find('#remove-user-submit-btn').on('click', function (e) {
            var data = $modal.find('#remove-user-frm').serialize();
            $.ajax({ url: '/user', type: 'DELETE', data: data, dataType: 'JSON' });
            // TODO - remove row from table
            $modal.modal('hide');
        });
        $modal.modal('show');
     });
}