import { Svix, Webhook } from "svix";
import { User } from "../models/User.js";

// api controller function to manage the clerk user  with database

export const webhooksClerk = async (req, res) => {
  try {
    // create a svix instance with clerk webhook secret
    const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // verifying headers
    await wHook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // getting data from request body
    const { data, type } = req.body;

    // switch case for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + "" + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + "" + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error(error.message);
    res.json({
      success: false,
      message: "webhook error",
    });
  }
};
