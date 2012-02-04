function index(request, response) {
    var options = {
        layout: false,
        name: '',
        post: false
    };
    response.render('home/index', options);
}
exports.index = index;

function indexPost(request, response) {
    var options = {
        layout: false,
        name: request.param('name'),
        post: true
    };
    response.render('home/index', options);
}
exports.indexPost = indexPost;