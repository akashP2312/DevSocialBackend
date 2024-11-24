const adminMiddleware = (req, res, next) => {
    const token = 'xyz';
    const isAuthorizd = token === 'xyz';
    if (isAuthorizd) {
        next();
    } else {
        res.status(401).send('admin not Authorizd')
    }
};

module.exports = {
    adminMiddleware
}