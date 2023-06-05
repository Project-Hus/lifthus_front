import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { QueryPostDto } from "../../api/dtos/post.dto";
import postApi from "../../api/postApi";
import relationApi from "../../api/relationApi";
import BasicPageLayout from "../../common/components/layouts/BasicPageLayout";
import { LIFTHUS_API_URL } from "../../common/routes";
import Posts from "../../components/Posts";
import CreatePost from "../../components/posts/CreatePost";
import useUserStore from "../../store/user.zustand";

const Home = () => {
  const { uid } = useUserStore();
  const { data: posts } = useQuery<QueryPostDto[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const followingList = await relationApi.getUserFollowing({ uid });
      const posts = await postApi.getUsersPosts({
        users: followingList,
        skip: 0,
      });
      console.log("FFF", followingList);
      console.log("PPP", posts);
      return posts;
    },
  });
  return (
    <div>
      <BasicPageLayout>
        <CreatePost />
        <Posts posts={posts || []} />
      </BasicPageLayout>
    </div>
  );
};

export default Home;
