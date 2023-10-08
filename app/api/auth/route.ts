import User from "@models/user";
import { connectDB } from "@utils/database";
const bcrypt = require("bcryptjs");

export const POST = async (req: Request) => {
  const { username, password, email } = await req.json();
    console.log('AAAAAA');
    
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      image: "",
    });

    await newUser.save();

    return new Response("User created successfully", { status: 201 });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify(error), { status: 500 });
  }
};
