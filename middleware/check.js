function login(req, res, next) {
    if (!req.session.isAuthenticated) {
        req.session.flash = ({
            type: "error",
            message: "Login required"
        })
        return res.redirect("/login");
    }
    next();
}

function admin(req, res, next) {
    if (!req.session.admin) {
        req.session.flash = ({
            type: "error",
            message: "Admin status required"
        })
        return res.redirect("/");
    }
    next();
}

function read(req, res, next) {
    if (!req.session.read) {
        req.session.flash = ({
            type: "error",
            message: "Read permission required"
        })
        return res.redirect("/");
    }
    next();
}

function del(req, res, next) {
    if (!req.session.delete) {
        req.session.flash = ({
            type: "error",
            message: "Delete permission required"
        })
        return res.redirect("/");
    }
    next();
}

function create(req, res, next) {
    if (!req.session.create) {
        req.session.flash = ({
            type: "error",
            message: "Create permission required"
        })
        return res.redirect("/");
    }
    next();
}

function update(req, res, next) {
    if (!req.session.update) {
        req.session.flash = ({
            type: "error",
            message: "Update permission required"
        })
        return res.redirect("/");
    }
    next();
}

function rootAdmin(req, res, next) {
    if (!req.session.rootAdmin) {
        req.session.flash = ({
            type: "error",
            message: "Root admin status required"
        })
        return res.redirect("/");
    }
    next();
}

const check = {
    login,
    read,
    del,
    create,
    update,
    rootAdmin,
    admin
};

module.exports = check;
