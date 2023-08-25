import {
  Button,
  Card,
  CardFooter,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Suspense } from "react";
import commentApi from "../../api/commentApi";
import postApi from "../../api/postApi";
import BlueSpinnerCentered from "../../common/components/spinners/BlueSpinnerCentered";
import { ThemeColor } from "../../common/styles/theme.style";
import useUserStore from "../../store/user.zustand";
import CommentCreate from "./post/commentCreate";
import CommentList from "./post/CommentList";

const PostFooter = ({
  pid,
  slug,
  likenum,
}: {
  pid: number;
  slug: string;
  likenum: number;
}) => {
  const queryClient = useQueryClient();

  // get the client UID
  const { uid: clientUid } = useUserStore();

  // like post mutation
  const { mutate: likeMutate, isLoading: likeLoading } = useMutation(
    async () => await postApi.likePost(pid),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["post", { pid }] });
        queryClient.invalidateQueries({ queryKey: ["post", { slug }] });
      },
    }
  );

  // comment disclosure
  const { getDisclosureProps, getButtonProps, onClose } = useDisclosure();
  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  const [numComments, setNumComments] = React.useState<Number>(0);

  return (
    <>
      <CardFooter justify="space-between">
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<>{likeLoading ? <Spinner /> : "🤍"}</>}
          _hover={{ bg: ThemeColor.backgroundColor }}
          onClick={
            clientUid
              ? () => likeMutate()
              : () => (window.location.href = "/sign")
          }
        >
          <Text color="white">{likenum} Likes</Text>
        </Button>
        <Button
          {...buttonProps}
          flex="1"
          variant="ghost"
          leftIcon={<>💬</>}
          _hover={{ bg: ThemeColor.backgroundColor }}
        >
          <Text color="white">{`${numComments} Comments`}</Text>
        </Button>
      </CardFooter>
      <Card {...disclosureProps}>
        {!!clientUid && pid && <CommentCreate postId={pid} onClose={onClose} />}
        <Suspense fallback={<BlueSpinnerCentered />}>
          <CommentList pid={pid} getNumber={setNumComments} />
        </Suspense>
      </Card>
    </>
  );
};

export default PostFooter;