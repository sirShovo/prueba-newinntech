const conection = require("../config/db.config");
const { generateAccessToken } = require("../config/jwt.config");
const { uploadFile, getFileStream } = require("../config/s3.config");

const upload = async (req, res) => {
  const file = req.file;
  const user = req.user;

  const result = await uploadFile(file);
  if (!result) return res.json("Something has gone wrong");

  conection.query(
    `UPDATE users SET photo = '${result.key}' WHERE id_user = '${user.id_user}' AND email = '${user.email}'`,
    (err, rows) => {
      if (err) {
        res.json(err);
      }

      if (rows.length <= 0) {
        return res.json("We couldn't do that, please try again.");
      }

      conection.query(
        `SELECT id_user, email, password, created, photo, verified FROM users WHERE id_user = '${user.id_user}' AND email = '${user.email}'`,
        (err, rows) => {
          if (err) {
            return res.json(err);
          }

          if (rows.length <= 0) {
            return res.json("Something has gone wrong");
          }

          const newUser = { ...rows[0] };
          const token = generateAccessToken(newUser);

          return res.json({
            msg: "The account photo has been uploaded successfully.",
            newToken: token, 
            s3: result
          });
        }
      );
      return
    }
  );
  return;
};

module.exports = { upload };
