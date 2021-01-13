export const roomFinder = (roomId, rooms) => {

    if (rooms) {
        for (let i = 0; i <= rooms.length - 1; i++) {
            if (rooms[i].id === Number(roomId)) {
                return rooms[i]; 
            }
        }
    }
    return null;
}