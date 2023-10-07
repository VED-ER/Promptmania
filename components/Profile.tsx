import React from "react";
import PromptCard from "./PromptCard";
import { useParams, useRouter } from "next/navigation";

type ProflePropsType = {
  prompts: PromptPost[];
  name: string;
  setPrompts: (prompts: PromptPost[]) => void;
};

const Profile = ({ prompts, name, setPrompts }: ProflePropsType) => {
  const router = useRouter();
  const params = useParams();

  const onClickEdit = (promptId: string) => {
    router.push(`/update-prompt?id=${promptId}`);
  };

  const onDeleteClick = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts(prompts.filter((p) => p._id !== promptId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <div>
        <h1 className="head_text py-2">
          <span className="blue_gradient">{name} Profile</span>
        </h1>
        {!params.id ? (
          <p className="desc">
            Welcome to your personalized profile page. Share your exceptional
            prompts and inspire others with the power of your imagination
          </p>
        ) : (
          <p className="desc">Welcome to {name}'s profile</p>
        )}
      </div>

      <div className="mt-16 w-full max-w-xl flex justify-center items-start flex-col gap-2;">
        <div className="prompt_layout">
          {prompts?.length > 0 &&
            prompts.map((p) => (
              <PromptCard
                prompt={p}
                key={p._id}
                onDelete={() => onDeleteClick(p._id)}
                onEdit={() => onClickEdit(p._id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
