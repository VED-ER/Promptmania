"use client";

import Profile from "@components/Profile";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserProfile = ({ params }: { params: { id: string } }) => {
  const [userPrompts, setUserPrompts] = useState<PromptPost[]>([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("name");

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}/prompts`);
        const data = await res.json();
        setUserPrompts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <Profile
      name={username!}
      prompts={userPrompts}
      setPrompts={setUserPrompts}
    />
  );
};

export default UserProfile;
