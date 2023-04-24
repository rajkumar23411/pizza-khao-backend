const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const Address = require("../models/address");
const addressController = {
  async add(req, res, next) {
    try {
      const {
        name,
        contact,
        pinCode,
        address,
        city,
        state,
        locality,
        landMark,
        alternatContact,
      } = req.body;

      if (
        !name ||
        !contact ||
        !pinCode ||
        !address ||
        !city ||
        !state ||
        !locality
      )
        return next(CustomErrorHandler.required("All fields are require"));

      const newAddress = await Address.create({
        name,
        contact,
        pinCode,
        address,
        city,
        state,
        locality,
        landMark,
        alternatContact,
        userId: req.user.id,
      });

      res.status(201).json({ newAddress });
    } catch (error) {
      console.log(error);
    }
  },

  async getAddress(req, res, next) {
    try {
      const user = req.user._id;

      const addresses = await Address.find({ userId: user }).sort("-createdAt");

      if (!addresses) {
        return next(CustomErrorHandler.notFound("No address found"));
      }

      res.status(200).json({ addresses });
    } catch (error) {
      console.log(error);
    }
  },
  async update(req, res, next) {
    await Address.findOneAndUpdate(req.params.id, req.body, {
      runValidators: true,
      useFindAndModify: false,
      new: true,
    });

    res.status(200).json({ success: true });
  },
  async deleteAddress(req, res, next) {
    try {
      const address = await Address.findById(req.params.id);
      if (!address)
        return next(CustomErrorHandler.notFound("Address not found"));

      await address.deleteOne();
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = addressController;
