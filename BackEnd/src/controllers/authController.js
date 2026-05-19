const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.saveUser = async (req, res) => {
  try {
    const {
      firebaseUID,
      fullName,
      email,
      phone,
      specialization,
      license,
      clinic,
      location,
      city,
      preferredLanguage,
      role,
      authProvider
    } = req.body;

    if (!firebaseUID || !role || !authProvider) {
      return res.status(400).json({
        success: false,
        message: "Missing required authentication fields"
      });
    }

    let user = await User.findOne({ firebaseUID });
    if (!user) {
      user = await User.create({
        firebaseUID,
        fullName,
        email,
        phone,
        specialization,
        license,
        clinic,
        location,
        city: city || location,
        preferredLanguage,
        role,
        authProvider
      });
    } else {
      const profileUpdate = {
        fullName,
        email,
        phone,
        specialization,
        license,
        clinic,
        location,
        city: city || location,
        preferredLanguage
      };

      Object.keys(profileUpdate).forEach(key => {
        if (profileUpdate[key] === undefined || profileUpdate[key] === "") {
          delete profileUpdate[key];
        }
      });

      if (Object.keys(profileUpdate).length) {
        user = await User.findByIdAndUpdate(
          user._id,
          profileUpdate,
          { returnDocument: "after" }
        );
      }
    }

    const token = signAuthToken(user);

    res.status(200).json({
      success: true,
      message: "User saved successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        specialization: user.specialization,
        license: user.license,
        clinic: user.clinic,
        location: user.location,
        city: user.city || user.location,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error("Save user error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { firebaseUID } = req.body;
    if (!firebaseUID) {
      return res.status(400).json({
        success: false,
        message: "Firebase user id is required"
      });
    }

    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const token = signAuthToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        specialization: user.specialization,
        license: user.license,
        clinic: user.clinic,
        location: user.location,
        city: user.city || user.location,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "phone",
      "specialization",
      "license",
      "clinic",
      "location",
      "city",
      "preferredLanguage"
    ];

    const updateData = allowedFields.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    if (updateData.location && !updateData.city) {
      updateData.city = updateData.location;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        specialization: user.specialization,
        license: user.license,
        clinic: user.clinic,
        location: user.location,
        city: user.city || user.location,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const signAuthToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
