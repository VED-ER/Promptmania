"use client";

import { ChangeEvent, useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import { useDebounce } from "@/utils/useDebounce";

type PrompCardListProps = {
  data: PromptPost[];
  onTagClick: (tag: string) => void;
};

const PromptCardList = ({ data, onTagClick }: PrompCardListProps) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((prompt) => (
        <PromptCard key={prompt._id} prompt={prompt} onTagClick={onTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState<PromptPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PromptPost[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const debouncedSearchText = useDebounce(searchText, 500);

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i");
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  useEffect(() => {
    const searchResult = filterPrompts(debouncedSearchText);
    setFilteredPosts(searchResult);
  }, [debouncedSearchText]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const onTagClick = (tag: string) => {
    setSearchText(tag);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          value={searchText}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search for a tag or username..."
          required
          className="search_input peer"
        />
      </form>

      {filteredPosts.length && searchText ? (
        <PromptCardList data={filteredPosts} onTagClick={onTagClick} />
      ) : (
        <PromptCardList data={posts} onTagClick={onTagClick} />
      )}
    </section>
  );
};

export default Feed;
