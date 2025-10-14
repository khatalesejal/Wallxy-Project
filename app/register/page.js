
import dbConnect from "../../../util/db";
//import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, email, password } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

  await dbConnect();

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = new User({ username, email, passwordHash });
    await user.save();
    return res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
