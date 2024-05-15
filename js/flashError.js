function flashError(req, res, msg, redirect) {
    req.session.flash = {
        type: "error",
        message: msg,
    };
    return res.redirect(redirect);
}

module.exports = flashError;