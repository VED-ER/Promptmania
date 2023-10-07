"use client";

import PromptCard from "@components/PromptCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [prompts, setPrompts] = useState<PromptPost[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserPrompts = async () => {
      const res = await fetch(`/api/users/${session?.user.id}/prompts`);
      const data = await res.json();
      setPrompts(data);
    };

    if (session?.user.id) fetchUserPrompts();
  }, [session?.user.id]);

  const onClickEdit = (promptId: string) => {
    router.push(`/update-prompt?id=${promptId}`);
  };

  const onDeleteClick = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts((prevPrompts) => {
          return prevPrompts.filter((p) => p._id !== promptId);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div>
        <h1 className="head_text py-2">
          <span className="blue_gradient">My Profile</span>
        </h1>
        <p className="desc">
          Welcome to your personalized profile page. Share your exceptional
          prompts and inspire others with the power of your imagination
        </p>
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
