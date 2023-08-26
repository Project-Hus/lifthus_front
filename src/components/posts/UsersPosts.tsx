import { Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import postApi from "../../api/postApi";
import BlueSpinner from "../../common/components/spinners/BlueSpinner";
import { useVisibleEffect } from "../../hooks/visibleEffect";

import Post from "./post/Post";

interface UsersPostsProps {
  uids: number[];
}
const UsersPosts = ({ uids }: UsersPostsProps) => {
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["posts", "followings"],
    queryFn: async ({ pageParam = 0 }) => {
      const posts = await postApi.getUsersPosts({
        users: uids,
        skip: pageParam,
      });
      return posts;
    },
    getNextPageParam: (lastPage, pages) =>
      pages.reduce((acc, curr) => acc + curr.length, 0),
  });

  /* Infinite scroll */
  const { observerTarget } = useVisibleEffect(fetchNextPage);

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((post) => (
            <Post key={post.id} pid={post.id} />
          ))}
        </React.Fragment>
      ))}
      {isFetching ? (
        <div style={{ textAlign: "center", padding: "1em" }}>
          <BlueSpinner />
        </div>
      ) : (
        <Text align="center" fontSize="4xl">
          😲
        </Text>
      )}
      <div ref={observerTarget} />
    </>
  );
};

export default UsersPosts;
