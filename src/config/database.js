
// Mysql Connection Class
class Connection {
    constructor() {
        const db = require('../models');
        db.sequelize.sync().then(async () => {
            console.log('✔ Connected to DB');
        }).catch((err) => {
            console.log('✘ Connection error to DB', err);
        });
    }
}

module.exports = new Connection();
