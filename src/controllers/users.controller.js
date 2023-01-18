const conection = require("../config/db.config");
const { generateAccessToken, getDataToken } = require("../config/jwt.config");
const { sendEmail, getTemplate } = require("../config/mailer.config");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.length <= 0 || password.length <= 0) {
    return res.json("Enter all data");
  }

  conection.query(
    `INSERT INTO users (email, password, verified) VALUES ('${email}', '${password}', false)`,
    async (err, rows) => {
      if (err) {
        if (err.sqlState !== 23000) {
          return res.json(err["sqlMessage"]);
        } else {
          return res.json("Email already exists, enter another email");
        }
      }

      const user = { id_user: rows["insertId"], email, password };
      const token = generateAccessToken(user);

      const template = getTemplate(email, token, "confirm");
      await sendEmail(email, "Verify your account", template, 'Confirm account');

      return res.json(
        "Account created, please verify your account with the link that was sent to your email"
      );
    }
  );
  return
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.length <= 0 || password.length <= 0) {
    return res.json("Enter all data");
  }

  conection.query(
    `SELECT id_user, email, password, created, photo, verified 
      FROM users WHERE email = '${email}' AND password = '${password}'`,
    (err, rows) => {
      if (err) {
        return res.json(err);
      }

      if (rows.length <= 0) {
        return res.json("Incorrect credentials, try again");
      }

      const user = { ...rows[0] };
      if (!user.verified) {
        res.json(
          "Your email has not been confirmed, you must confirm your account before logging in"
        );
      }

      const accessToken = generateAccessToken(user);
      return res.header("authorization", accessToken).json({
        message: "You are logged in",
        token: accessToken,
      });
    }
  );
  return
};

const confirm = async (req, res) => {
  const token = req.params.token;
  const data = await getDataToken(token);

  if (data === null) {
    return res.json("Token expired, you need a new token");
  }

  conection.query(
    `SELECT id_user, email, password, created, photo, verified 
      FROM users WHERE email = '${data.email}' AND password = '${data.password}'`,
    (err, rows) => {
      if (err) {
        return res.json(err);
      }

      if (rows.length <= 0) {
        return res.json("The data does not match");
      }

      const user = { ...rows[0] };
      if (user.verified) {
        return res.json("Your account has already been confirmed");
      }

      conection.query(
        `UPDATE users SET verified = 1 WHERE id_user = ${data.id_user} AND email = '${data.email}'`,
        (err, change) => {
          if (err) {
            return res.json(err);
          }

          if (change.length <= 0) {
            return res.json(
              "Your account could not be confirmed, please try again"
            );
          }

          user.verified = 1;

          const accessToken = generateAccessToken(user);
          return res.header("authorization", accessToken).json({
            message: "Your account has been confirmed, You are logged in",
            token: accessToken,
          });
        }
      );
    }
  );
  return
};

const get_data = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

const forgot = async (req, res) => {
  const email = req.body.email;

  if (!email) return res.json("You need to enter an email");

  conection.query(
    `SELECT * FROM users WHERE email = '${email}' LIMIT 1`,
    async (err, rows) => {
      if (err) return res.json(err);

      if (rows.length <= 0) {
        return res.json("The email entered does not match any account");
      }

      const user = { ...rows[0] };
      const token = generateAccessToken(user);

      const template = getTemplate(email, token, "forgot");
      await sendEmail(email, "Forgot password", template, 'Forgot password');

      return res.json(
        "We have sent a code to your email to recover your account."
      );
    }
  );
  return
};

const recovery = async (req, res) => {
  const password = req.body.password;
  const user = req.user;

  if (!password) return res.json("Enter a password");

  conection.query(
    `UPDATE users SET password = '${password}' WHERE email = '${user.email}' AND id_user = '${user.id_user}'`,
    async (err, change) => {
      if (err) return res.json(err);

      if (change.length <= 0) {
        return res.json(
          "Failed to change password, please try again."
        );
      }

      return res.json('The password has been changed, now you can enter the system again.')
    }
  );
  return;
};

module.exports = {
  register,
  login,
  get_data,
  confirm,
  forgot,
  recovery
};
