import Prompt from "@models/prompt";
import { connectDB } from "@utils/database";

type Params = {
  id: string;
};

export const GET = async (req: Request, { params }: { params: Params }) => {
  try {
    await connectDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt)
      return new Response(
        "Error finding prompt with the id: ".concat(params.id),
        { status: 404 }
      );

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: { params: Params }) => {
  const { prompt: updatedPrompt, tag: updatedTag } = await req.json();

  try {
    await connectDB();

    const prompt = await Prompt.findById(params.id);

    if (!prompt)
      return new Response(
        "Error finding prompt with the id: ".concat(params.id),
        { status: 404 }
      );

    prompt.prompt = updatedPrompt;
    prompt.tag = updatedTag;

    await prompt.save();

    return new Response("Prompt updated succesfully", { status: 200 });
  } catch (error) {
    return new Response("Error updating prompt", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: Params }) => {
  try {
    await connectDB();

    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted succesfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
