"use client";

import PromptCard from "@components/PromptCard";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [prompts, setPrompts] = useState<PromptPost[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserPrompts = async () => {
      const res = await fetch(`/api/users/${session?.user.id}/prompts`);
      const data = await res.json();
      setPrompts(data);
    };

    if (session?.user.id) fetchUserPrompts();
  }, [session?.user.id]);

  const onClickEdit = ()=>{}

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="head_text py-2">
          <span className="blue_gradient">My Profile</span>
        </h1>
        <p className="desc">
          Welcome to your personalized profile page. Share your exceptional
          prompts and inspire others with the power of your imagination
        </p>
      </div>

      {prompts?.length > 0 &&
        prompts.map((p) => <PromptCard prompt={p} key={p._id} />)}
    </div>
  );
};

export default Profile;
