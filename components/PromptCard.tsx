import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type PromptCardProps = {
  prompt: PromptPost;
  onTagClick?: (tag: string) => void;
};

const PromptCard = ({ prompt, onTagClick }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  const copylink = () => {
    setCopied(true);
    navigator.clipboard.writeText(prompt.prompt);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const pathName = usePathname();

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <Image
            alt="user image"
            src={prompt.creator.image}
            width={50}
            height={50}
            className="rounded-full object-contain"
          />
          <div>
            <p className="font-bold mt-0 pt-0">{prompt.creator.username}</p>
            <p className="text-sm text-gray-500">{prompt.creator.email}</p>
          </div>
        </div>
        <div onClick={copylink} className="copy_btn">
          <Image
            alt="copy icon"
            src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="py-5">
        <p className="text-sm">{prompt.prompt}</p>
      </div>

      <div
        onClick={() => onTagClick && onTagClick(prompt.tag)}
        className="cursor-pointer text-sm blue_gradient"
      >
        {prompt.tag}
      </div>

      {pathName === "/profile" && session?.user.id === prompt.creator._id && (
        <div className="flex gap-8 justify-center mt-5">
          <p className="text-green-400 px-5 cursor-pointer">Edit</p>
          <p className="text-red-400 px-5 cursor-pointer">Delete</p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
