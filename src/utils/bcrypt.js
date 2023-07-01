import bcrypt from "bcrypt";

export const hashWithSalt = async (arg) => {
  console.log("hashing...");

  try {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedArg = await bcrypt.hash(arg, salt);

    return hashedArg;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const compare = (pwd, hashedPwd) => {
  console.log("Comparing whether the password is correct or not...");

  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pwd, hashedPwd, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        result ? resolve(true) : resolve(false);
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
