module.exports = {

    loggedIn(req, res, next) {
        console.log("REQUESTING!")
        console.log(req.query);
        if(req.query.user !== null) {
            res.send(true);
        }

        // let accepted = true;
        // console.log(username)
        // let playerAlreadyExist = players[username];
        // if (playerAlreadyExist === undefined && username !== null) {
        //     players[username] = {
        //         id: socket.id,
        //         username: username
        //     }
        // } else {
        //     accepted = false;
        // }
    }
}