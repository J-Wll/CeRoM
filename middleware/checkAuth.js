function checkAuth(req, res, next) {
    if (!req.session.isAuthenticated) {
        req.session.flash = ({
            type: "error",
            message: "Login required"
        })
        return res.redirect("/login");
    }
    next();
}

module.exports = checkAuth;
