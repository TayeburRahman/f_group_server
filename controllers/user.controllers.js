const axios = require("axios");
const userModels = require("../models/user.models");
const { generateToken } = require("../utils/token");
let bcrypt = require("bcryptjs");
const url = require("url");

//  response
const createUser = async (req, res) => {
  try {
    const newUser = req.body;

    console.log(newUser);
    const ExistingUser = await userModels.findOne({
      email: req.body.email,
    });

    if (ExistingUser) {
      return res.json({
        status: "error",
        message: `${req.body.email} User(email) already exists`,
      });
    }

    const user = await userModels.create(newUser);
    return res.status(200).json({
      user,
      status: "success",
      message: "User register success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: error });
  }
};

const getDiscordUser = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ status: "error", message: "Authorization code missing or invalid" });
    }

    const formData = new URLSearchParams({
      client_id: process.env.DISCORD_C_ID,
      client_secret: process.env.DISCORD_C_SECRET,
      code: code.toString(),
      grant_type: "authorization_code",
      redirect_uri: process.env.DISCORD_R_URL,
    });


    try {
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get('https://discordapp.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/x-www-form-urlencoded',
        },
      });

      const { username, email, avatar, global_name, id } = userResponse.data;
      const userForm = {
        name: username,
        email: email,
        avatar: avatar,
        displayName: global_name,
        password: `Dcd!1${id}`,
        dId: id,
        confirmPassword: `Dcd!1${id}`,
      };

      const existingUser = await userModels.findOne({ email: email });

      if (existingUser) {
        const token = generateToken(existingUser);
        await userModels.updateOne({ email: email }, { $set: userForm });
        console.log("user updated successfully")
        return res.status(200).json({
          user: existingUser,
          token,
          status: "success",
          message: "User updated successfully",
        });
      }

      const newUser = await userModels.create(userForm);
      const token = generateToken(newUser);

      console.log("user updated successfully")
      return res.status(200).json({
        user: newUser,
        token,
        status: "success",
        message: "User registered successfully",
      });
    } catch (tokenError) { 
      return res.status(202).json({ status: "success", message: "Failed to obtain access token" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};



/**
 1. Check if Email and password given
 2. Load user from database by email
 3. if not user send res Some message
 4. compare password
 5. if password not match send res Some message
 6. check if user is active
 7. if not active send res Some message
 8. generate token
 9. send user and token
 */

const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
      return res.status(401).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    const isMatchPassword = await bcrypt.compareSync(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({
        status: "error",
        message: "Password not match",
      });
    }

    console.log("isMatchPassword", isMatchPassword);
    if (user.status != "active") {
      return res.status(401).json({
        status: "error",
        message: "User is not active",
      });
    }

    const token = generateToken(user);

    // IGNORE PASSWORD
    const { password: pwd, ...others } = user.toObject();

    return res.status(200).send({
      status: "success",
      user: others,
      token,
      id: user._id,
      message: "User Login Successful",
    });
  } catch (error) {
    return res.status(401).json({ status: "error", message: error.massages });
  }
};

const getAllUser = async (req, res) => {
  console.log("user", req.user);
  try {
    const user = await userModels.find({});

    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).json({ status: "error", message: error.massages });
  }
};


const getUserData = async (req, res) => {
  try {
    const email = req.params;

    const user = await userModels.findOne(email);

    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).json({ status: "error", message: error.massages });
  }
};
const getUserDataById = async (req, res) => {
  try {
    const { ID } = req.params;

    const user = await userModels.findById(ID);

    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).json({ status: "error", message: error.massages });
  }
};




module.exports = {
  createUser,
  getUser,
  getAllUser,
  getDiscordUser,
  getUserDataById,
  getUserData,
};
