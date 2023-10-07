"use client";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MyProfile = () => {
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

  return <Profile name="My" prompts={prompts} setPrompts={setPrompts} />;
};

export default MyProfile;
