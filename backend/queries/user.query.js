const userQuery = {
    insertUser: "INSERT INTO `user` (user_email, username, password) VALUES (?,?,?)",
    selectUserByEmail: "SELECT "
     +"user_email as userEmail, username, password, address, latitude, longitude"
     +" FROM `user` WHERE user_email=?",
    selectCountUserByEmail: "SELECT COUNT(*) as count FROM `user` WHERE user_email=?",
}

module.exports = userQuery;