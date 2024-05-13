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

  const userData = await crudController.getAll(req, res, "employee");

  const inpUsername = req.body.username;
  const inpPassword = req.body.password;

  console.log("request", inpUsername, inpPassword);

  let userPassMatch = false;
  const user = userData.find((user) => user.username === inpUsername);

  // guard clause if user not found
  if (!user) {
    console.log("test1")
    flashError("Invalid username or password");
  }

  console.log(inpPassword, user.password);
  bcrypt.compare(inpPassword, user.password, function (err, result) {
    console.log(err, result);
    userPassMatch = result === true;

    // If it doesn't match, redirect and send msg
    if (!userPassMatch) {
      flashError("Invalid username or password");
    }

    req.session.isAuthenticated = true;
    req.session.username = inpUsername;

    // TODO: PERM TESTING REMOVE
    req.session.create = true;
    req.session.read = true;
    req.session.update = true;
    req.session.delete = true;
    req.session.viewSensitive = true;
    req.session.admin = true;




    req.session.flash = {
      type: "message",
      message: `You have successfully logged in as ${inpUsername}`,
    };
    next();
  });
}

module.exports = authMiddleware;
