class NotFound {

    handle(req, res) {
        res.status(404);
        return res.render('core/middleware/not-found');
    }

}

module.exports = NotFound;

