class NotFound {

    handle(req, res) {
        return res.render('core/middleware/not-found');
    }

}

module.exports = NotFound;

