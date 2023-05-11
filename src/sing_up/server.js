const bcrypt = require("bcrypt");

export default async function SignUp(id, pwd) {
  try {
    //check id ok

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const user = { name: id, password: hashedPassword };
    // push user to mongodb
  } catch {
    res.status(500).send();
  }
}
