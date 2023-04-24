const {
  add,
  getAddress,
  update,
  deleteAddress,
} = require("../controllers/addressController");
const { auth } = require("../middlewares/auth");

const addressRoutes = require("express").Router();

addressRoutes.post("/address/add", [auth], add);
addressRoutes.get("/address", [auth], getAddress);
addressRoutes.put("/address/:id", [auth], update);
addressRoutes.delete("/delete/address/:id", [auth], deleteAddress);

module.exports = addressRoutes;
