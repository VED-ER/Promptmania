import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "./Modal";

type PromptCardProps = {
  prompt: PromptPost;
  onTagClick?: (tag: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

const PromptCard = ({
  prompt,
  onTagClick,
  onDelete,
  onEdit,
}: PromptCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const copylink = () => {
    setCopied(true);
    navigator.clipboard.writeText(prompt.prompt);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const pathName = usePathname();

  const onProfileClick = () => {
    if (prompt.creator._id === session?.user.id) {
      router.push("/profile");
    } else {
      router.push(`/profile/${prompt.creator._id}?name=${prompt.creator.username}`);
    }
  };

  return (
    <>
      <div className="prompt_card">
        <div className="flex justify-between items-center">
          <div
            onClick={onProfileClick}
            className="flex gap-5 items-center cursor-pointer"
          >
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
            <p
              onClick={onEdit && onEdit}
              className="text-green-400 px-5 cursor-pointer"
            >
              Edit
            </p>
            <p
              onClick={() => setShowModal(true)}
              className="text-red-400 px-5 cursor-pointer"
            >
              Delete
            </p>
          </div>
        )}
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div>
          <p className="mb-5">Delete this prompt?</p>
          <div className="flex gap-5">
            <button
              onClick={onDelete && onDelete}
              type="button"
              className="outline_btn"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              type="button"
              className="black_btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PromptCard;
