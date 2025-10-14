
import dbConnect from "../../../util/db";
//import User from "../../../models/User";
import bcrypt from "bcryptjs";
//import { signToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  await dbConnect();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user._id, email: user.email });
    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
