module.exports = {

    checkPlayerExistence (username, players) {
        let playerAlreadyExist = players[username];
        if (playerAlreadyExist === undefined) {
            console.log("Adding new player..")
            console.log(username);
            return false;
        } else {
            return true;
        }
    }

}