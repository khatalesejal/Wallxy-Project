// app/api/user/route.js
import { NextResponse } from "next/server";
import connectToDB from "../../util/db.js";
import { getUserFromRequest } from "../../util/auth.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

//GET → List all users (testing)
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET USERS ERR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// //PUT → Update own account info
// export async function PUT(req) {
//   try {
//     const user = await getUserFromRequest(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { username, email, password } = await req.json();

//     await connectToDB();
//     const userDoc = await User.findById(user._id);
//     if (!userDoc) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     if (username) userDoc.username = username;
//     if (email) userDoc.email = email.toLowerCase();
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       userDoc.password = await bcrypt.hash(password, salt);
//     }

//     await userDoc.save();

//     const safeUser = { id: userDoc._id, username: userDoc.username, email: userDoc.email };
//     return NextResponse.json({ message: "User updated successfully", user: safeUser });
//   } catch (err) {
//     console.error("UPDATE USER ERR", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// //DELETE → Delete own account
// export async function DELETE(req) {
//   try {
//     const user = await getUserFromRequest(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await connectToDB();
//     await User.findByIdAndDelete(user._id);

//     return NextResponse.json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("DELETE USER ERR", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
