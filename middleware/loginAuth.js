// Plaintext passwords
// [
//   {"username": "joe", "password": "p97"},
//   {"username": "bob", "password": "p28"},
//   {"username": "jane", "password": "p74"},
//   {"username": "jill", "password": "p17"}
// ]

const crudController = require("../controllers/crudController");
const flashError = require("../js/flashError");
const bcrypt = require("bcrypt");

async function loginAuth(req, res, next) {
  const userData = await crudController.getRaw(req, res, "employee");

  const inpUsername = req.body.username;
  const inpPassword = req.body.password;


  let userPassMatch = false;
  const user = userData.find((user) => user.username === inpUsername);

  // guard clause if user not found
  if (!user) {
    return flashError(req, res, "Invalid username or password", "/login");
  }

  bcrypt.compare(inpPassword, user.password, function (err, result) {
    userPassMatch = result === true;

    // If it doesn't match, redirect and send msg
    if (!userPassMatch) {
      return flashError(req, res, "Invalid username or password", "/login");
    }

    req.session.isAuthenticated = true;
    req.session.username = inpUsername;

    req.session.userID = user._id.valueOf();
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

module.exports = loginAuth;
