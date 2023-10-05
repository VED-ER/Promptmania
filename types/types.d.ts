interface PromptCreator {
  email: string;
  image: string;
  username: string;
  _id: string;
}

interface PromptPost {
  creator: PromptCreator;
  _id: string;
  prompt: string;
  tag: string;
}
