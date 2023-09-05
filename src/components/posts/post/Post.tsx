import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import { Image } from "@chakra-ui/image";
import { Textarea, Link as LinkChakra } from "@chakra-ui/react";

import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { CheckIcon, CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";

import { ThemeColor } from "../../../common/styles/theme.style";
import { Input } from "@chakra-ui/react";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { POST_FOLD } from "../../../common/constraints";
import postApi from "../../../api/postApi";
import userApi from "../../../api/userApi";

import { GetUserInfoDto } from "../../../api/dtos/user.dto";
import { UpdatePostDtoInput } from "../../../api/dtos/post.dto";
import useUserStore from "../../../store/user.zustand";
import ImageBoard from "../../../common/components/images/ImageBoard";
import { useImageFileListWithPreview } from "../../../hooks/images";

import PostFooter from "./PostFooter";
import styled from "@emotion/styled";
import PostMenu, { PostHeader } from "./PostHeader";
import PostEdit from "./PostEdit";
import { PostDto } from "../../../api/dtos/post.dto";

interface PostProp {
  pid?: string;
  slug?: string;
}
type FormData = {
  content: string;
  images: FileList;
};

export const IconButtonStyleDiv = styled.div`
  padding-top: 0em;
  & > Button {
    background-color: ${ThemeColor.backgroundColorDarker};
    :hover {
      text-decoration-line: underline;
    }
    :hover {
      background-color: ${ThemeColor.backgroundColor};
    }
  }
`;

/**
 * Takes pid or slug as a prop and renders the post after fetching the data of corresponding post.
 * It also queries the comments of the post and renders them with Comment-related components.
 *
 * @param param0
 * @returns JSX.Element
 */
const Post = ({ pid, slug }: PostProp) => {
  const queryClient = useQueryClient();
  // get the client's uid
  const clientUid = useUserStore((state) => state.uid);

  // query the post by pid or slug
  const postQueryKey = pid ? { pid } : { slug };
  const { data: post } = useQuery<PostDto>({
    queryKey: ["post", postQueryKey],
    queryFn: async () => {
      return await postApi.getPost(postQueryKey);
    },
  });
  // query the author info
  const { data: author } = useQuery<GetUserInfoDto | null>({
    queryKey: ["user", { uid: post?.author }],
    queryFn: async () =>
      !post
        ? Promise.reject(undefined)
        : await userApi.getUserInfo({ uid: post.author }),
  });

  // post deletion
  const { mutate: deleteMutate } = useMutation(
    async () =>
      !post ? Promise.reject("undefined") : postApi.deletePost(post.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    }
  );

  // comments folding
  const [IsFold, setFold] = useState(true);

  // author info
  const username = author?.username || "Unknown user";
  const profileImage = author?.profile_image_url;

  /* post editing */
  const [isEditing, setEditing] = useState(false);

  const { register, handleSubmit } = useForm<FormData>();

  const { onLoadFile, imagePreviewSources, imageFileList, removeImages } =
    useImageFileListWithPreview();

  const { mutate, isLoading } = useMutation(
    async (post: UpdatePostDtoInput) =>
      postApi.updatePost({
        id: post.id,
        author: post.author,
        content: post.content,
      }),
    {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ["post", postQueryKey] });
        setEditing(false);
      },
    }
  );

  const editPost = async (data: FormData) => {
    if (data.content.length === 0) return alert("내용을 입력해주세요");
    // 기존 이미지에서 변경되지 않은 경우
    try {
      if (!post) return;
      const editedPost: UpdatePostDtoInput = {
        id: post.id,
        author: post.author,
        //images: imagePreview ? imagePreview : [],
        content: data.content,
      };
      await mutate(editedPost);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card
        bgColor={ThemeColor.backgroundColorDarker}
        color="white"
        fontSize="0.7em"
        margin="0.5em"
      >
        <CardHeader paddingBottom={"0"}>
          <Flex letterSpacing="4">
            <PostHeader
              profileImageSrc={profileImage || ""}
              username={username}
              timestamp={post?.createdAt || new Date()}
            />
            <PostMenu
              author={post?.author || ""}
              slug={post?.slug || ""}
              setEditing={() => setEditing(true)}
              deletePost={() => deleteMutate()}
            />
          </Flex>
        </CardHeader>

        {!isEditing && (
          <ImageBoard
            srcs={(post && post.images) /*?.map((img) => img.src)*/ || []}
          />
        )}

        <CardBody paddingTop="0.5em">
          {isEditing && post ? (
            <PostEdit
              post={post}
              postQueryKey={postQueryKey}
              closeEdit={() => setEditing(false)}
            />
          ) : (
            <>
              <Text style={{ whiteSpace: "pre-wrap" }}>
                {IsFold && !!post && post.content.length > POST_FOLD
                  ? post.content.slice(0, POST_FOLD) + "..."
                  : !!post
                  ? post.content
                  : ""}
              </Text>
              <IconButtonStyleDiv>
                {(!!post ? post.content.length : 0) > POST_FOLD && (
                  <>
                    <Button
                      alignSelf="flex-start"
                      onClick={() => setFold(false)}
                      size="sm"
                      display={IsFold ? "block" : "none"}
                    >
                      more...
                    </Button>
                    <Button
                      alignSelf="flex-start"
                      onClick={() => setFold(true)}
                      size="sm"
                      display={IsFold ? "none" : "block"}
                    >
                      {" "}
                      shortly...
                    </Button>
                  </>
                )}
              </IconButtonStyleDiv>
            </>
          )}
        </CardBody>
        {/* {!isEditing && post?.id && (
          <PostFooter pid={post.id} slug={post.slug} likenum={post.likeNum} />
        )} */}
      </Card>
    </>
  );
};

export default Post;
