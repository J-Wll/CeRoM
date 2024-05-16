
function permsArr(req) {
    let perms = [];
    if (req.session.rootAdmin) { perms.push(" Root Admin") };
    if (req.session.admin) { perms.push(" Admin") };
    if (req.session.create) { perms.push(" Create") };
    if (req.session.read) { perms.push(" Read") };
    if (req.session.update) { perms.push(" Update") };
    if (req.session.delete) { perms.push(" Delete") };

    return perms;
}

module.exports = permsArr