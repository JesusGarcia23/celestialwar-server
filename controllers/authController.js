module.exports = {

    loggedIn(req, res, next) {
        console.log("REQUESTING!")
        console.log(req.query);
        if(req.query.user !== null) {
            res.send(true);
        }
    }
}