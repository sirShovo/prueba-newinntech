const verifyFile = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.photo)
    return res.json("No files");

  next();
};

module.exports = {
  verifyFile
}