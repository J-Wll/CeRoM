// Plaintext passwords
// [
//   {"username": "joe", "password": "p97"},
//   {"username": "bob", "password": "p28"},
//   {"username": "jane", "password": "p74"},
//   {"username": "jill", "password": "p17"}
// ]

const crudController = require("../controllers/crudController");

const bcrypt = require("bcrypt");

async function authMiddleware(req, res, next) {
  function flashError(msg) {
    req.session.flash = {
      type: "error",
      message: msg,
    };
    return res.redirect("/login");
  }

  const userData = await crudController.getAll(req, res, "employee", { login: true });

  const inpUsername = req.body.username;
  const inpPassword = req.body.password;

  console.log("request", inpUsername, inpPassword);

  let userPassMatch = false;
  const user = userData.find((user) => user.username === inpUsername);

  // guard clause if user not found
  if (!user) {
    console.log("test1")
    return flashError("Invalid username or password");
  }

  bcrypt.compare(inpPassword, user.password, function (err, result) {
    console.log(err, result);
    userPassMatch = result === true;

    // If it doesn't match, redirect and send msg
    if (!userPassMatch) {
      return flashError("Invalid username or password");
    }

    req.session.isAuthenticated = true;
    req.session.username = inpUsername;

    console.log(user);

    req.session.create = user.permissions.create || false;
    req.session.read = user.permissions.read || false;
    req.session.update = user.permissions.update || false;
    req.session.delete = user.permissions.delete || false;
    req.session.viewSensitive = user.permissions.viewSensitive || false;
    req.session.admin = user.permissions.admin || false;
    req.session.rootAdmin = user.permissions.rootAdmin || false;

    next();
  });
}

module.exports = authMiddleware;
