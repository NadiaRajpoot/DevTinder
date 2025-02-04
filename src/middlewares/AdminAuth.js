 const adminAuth =("/admin", (req, res, next) => {
    const token = "xyz";
    const isAdmnAuth = token === "xyz";
    console.log("/admin");
    if (!isAdmnAuth) {
      res.status(401).send("unauth");
    } else {
      next();
    }
  });

  module.exports = adminAuth;