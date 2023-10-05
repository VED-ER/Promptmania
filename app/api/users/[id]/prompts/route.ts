import Prompt from "@models/prompt";
import { connectDB } from "@utils/database";
import { NextApiRequest } from "next";

type Params = {
  id: string;
};

export const GET = async (
  req: NextApiRequest,
  { params }: { params: Params }
) => {
  try {
    await connectDB();

    const prompts = await Prompt.find({ creator: params.id }).populate(
      "creator"
    );

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
