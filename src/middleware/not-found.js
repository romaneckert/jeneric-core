class NotFound {

    handle(req, res) {
        res.status(404);
        return res.render('status-404');
    }

}

module.exports = NotFound;

