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
    $(document).on('click', '#create-user-btn', function (e) {
        if ('create-user' in templates) {
            var $modal = templates['create-user'];
            $modal.modal('show');
        } else {
            $.ajax({ url: '/templates/create-user-modal.html', type: 'GET' })
             .success(function (data) {
                var $modal = $(data);
                templates['create-user'] = $modal;
                setupCreateUserModal($modal);
                $modal.modal('show');
             });
        }
    });
    
    $(document).on('click', '.edit-user-btn', function (e) {
        var userId = $(this).attr('data-user-id');
        if ('edit-user' in templates) {
            var templator = templates['edit-user'];
            populateEditTemplate(templator, userId);
        } else {
            $.ajax({ url: '/templates/edit-user-modal.html', type: 'GET' })
             .success(function (data) {
                var templator = Handlebars.compile(data);
                templates['edit-user'] = templator;
                populateEditTemplate(templator, userId);
             });
        }
    });
    
    $(document).on('click', '.remove-user-btn', function (e) {
        var userId = $(this).attr('data-user-id');
        if ('remove-user' in templates) {
            var templator = templates['remove-user'];
            populateRemoveTemplate(templator, userId);
        } else {
            $.ajax({ url: '/templates/remove-user-modal.html', type: 'GET' })
             .success(function (data) {
                var templator = Handlebars.compile(data);
                templates['remove-user'] = templator;
                populateRemoveTemplate(templator, userId);
             });
        }
    });
});

function setupCreateUserModal($modal) {
    var $form = $modal.find('#create-user-frm');
    
    // validation
    $form.bs_validate({
        rules: {
            name: { required: true }
        }
    });
    
    // submission
    $modal.find('#create-user-submit-btn').on('click', function (e) {
        if ($form.valid()) {
            $.ajax({ url: '/user', type: 'POST', data: $form.serialize(), dataType: 'JSON' })
             .success(function(user) {
                var $row = $('<tr><td>' + user.name + '</td><td><a class="btn btn-primary btn-small edit-user-btn" data-user-id="' + user.id + '">Edit</a></td><td><a class="btn btn-primary btn-small remove-user-btn" data-user-id="' + user.id + '">Remove</a></td></tr>');
                insertRow($row, user.name);
             });
            $modal.modal('hide');
        }
    });
}

function populateEditTemplate(templator, userId) {
    var url = ['/user/', userId, '/details'].join('');
    $.ajax({ url: url, type: 'POST', dataType: 'JSON' })
     .success(function (user) {
        var $modal = $(templator(user));
        $modal.find('#edit-user-submit-btn').on('click', function (e) {
            var data = $modal.find('#edit-user-frm').serialize();
            $.ajax({ url: '/user', type: 'PUT', data: data, dataType: 'JSON' })
             .success(function (user) {
                var $row = $('.edit-user-btn[data-user-id=' + userId + ']').parents('tr');
                $row.find('td:first-child').text(user.name);
                $row.remove();
                insertRow($row, user.name);
            });
            $modal.modal('hide');
        });
        $modal.modal('show');
     });
}

function insertRow($row, name) {
    var index = findUserIndex(name);
    if (index == -1) {
        $('#user-table tbody').append($row);
    } else {
        var $successor = $('#user-table tbody tr:nth-child(' + (index + 1) +  ')');
        $successor.before($row);
    }
}

function populateRemoveTemplate(templator, userId) {
    var url = ['/user/', userId, '/details'].join('');
    $.ajax({ url: url, type: 'POST', dataType: 'JSON' })
     .success(function (user) {
        var $modal = $(templator(user));
        $modal.find('#remove-user-submit-btn').on('click', function (e) {
            var data = $modal.find('#remove-user-frm').serialize();
            $.ajax({ url: '/user', type: 'DELETE', data: data, dataType: 'JSON' });
            $('.remove-user-btn[data-user-id=' + userId + ']').parents('tr').remove();
            $modal.modal('hide');
        });
        $modal.modal('show');
     });
}

function findUserIndex(name) {
    var index = -1;
    $('#user-table tbody tr').each(function (i, row) {
        var $td = $(row).find('td');
        if (name < $td.text()) {
            index = i;
            return;
        }
    });
    return index;
}