"use client";

import Form from "@components/Form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

type EmptyPromptPost = {
  prompt: string;
  tag: string;
};

const UpdatePrompt = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState<EmptyPromptPost | PromptPost>({
    prompt: "",
    tag: "",
  });
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const router = useRouter();

  useEffect(() => {
    const getPromptData = async () => {
      try {
        const res = await fetch(`/api/prompt/${promptId}`);
        const data = await res.json();
        setPrompt(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (promptId) getPromptData();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: prompt.prompt,
          tag: prompt.tag,
        }),
      });

      if (res.ok) {
        router.back();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      post={prompt}
      type="Update"
      setPost={setPrompt}
      handleSubmit={onSubmit}
      submitting={isSubmitting}
    />
  );
};

export default UpdatePrompt;
