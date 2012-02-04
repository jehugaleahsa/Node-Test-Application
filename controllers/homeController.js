// when the user navigates to the home page,
// they should be shown all of the current users
function index(request, response) {
    var options = {
        layout: false,
        locals: { name: '', post: false }
    };
    response.render('home/index', options);
}
exports.index = index;

function indexPost(request, response) {
    var options = {
        layout: false,
        locals: { name: request.param('name'), post: true }
    };
    response.render('home/index', options);
}
exports.indexPost = indexPost;