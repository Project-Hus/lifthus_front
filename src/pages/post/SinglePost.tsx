import React from "react";
import { useParams } from "react-router-dom";
import PostV2 from "../../components/posts/PostV2";

const SinglePost = () => {
  const slug = useParams().slug;
  return (
    <div>
      <PostV2 slug={slug} />
    </div>
  );
};

export default SinglePost;
