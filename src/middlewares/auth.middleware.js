

exports.authentication = (req, res, next) => {
    var authheader = req.headers.authorization;

    if (!authheader) {
        res.status(401).json({
            message: 'Missing Authorization Header',
            status: false
        });
    }

    var auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user == 'admin' && pass == 'password') {

        // If Authorized user
        next();
    } else {
        res.status(401).json({
            message: 'Invalid Authentication Credentials',
            status: false
        });
    }

}
