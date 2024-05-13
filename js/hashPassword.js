const bcrypt = require("bcrypt");
const saltRounds = 12;

async function hashPassword(plainText) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainText, salt);
        return hash;
    } catch (error) {
        console.error("Error while hashing password:", error);
    }
}

module.exports = hashPassword;