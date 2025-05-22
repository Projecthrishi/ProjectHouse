// save as hashPassword.js
import bcrypt from "bcrypt";

const password = "2003";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Hashed password:", hash);
});
