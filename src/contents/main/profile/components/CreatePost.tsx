import React from "react";
import { useForm } from "react-hook-form";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { RepContent } from "../../../../api/interfaces/repsApi.interface";
import { Text, Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Input, Menu, MenuButton, useDisclosure, MenuList, MenuItem, Textarea } from "@chakra-ui/react";
import RepsApi from "../../../../api/repsApi"
import useUserStore from "../../../../store/user.zustand";
import { CloseIcon } from "@chakra-ui/icons";
import { USER_PROFILE_IMAGE_ROUTE } from "../../../../common/routes";
import { ThemeColor } from "../../../../common/styles/theme.style";
const CreatePost = () => {
    //call user_id from zustand
    const { user_id, username } = useUserStore();
    // comment_obj의 refeching을 위해서 useQueryClient 객체 생성
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<FormData>();

    const { getButtonProps, getDisclosureProps, onOpen, onClose } = useDisclosure();
    const buttonProps = getButtonProps()
    const disclosureProps = getDisclosureProps()

    const { mutate, isLoading } = useMutation(async (rep: RepContent) => RepsApi.post_rep({ user_id, rep }), {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({ queryKey: ["reps"] });
        },
    });

    type FormData = {
        text: string;
        image: FileList;
    };
    const onSubmit = async (data: FormData) => {
        if (data.text.length == 0) return alert("내용을 입력해주세요"
        );

        try {

            const rep = {
                rep_id: Math.floor(Math.random() * 1000),
                created_at: new Date(),
                updated_at: new Date(),
                user_id: user_id,
                username: username,
                text: data.text,

            }
            await mutate(rep);
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Menu >
                <MenuButton as={Button} colorScheme="blue" margin="0.5em" marginBottom={"0em"}>Create new Post</MenuButton>
                <MenuList>
                    <MenuItem fontSize={"sm"} onClick={onOpen} textColor="gray.400">Create new Post</MenuItem>
                    <MenuItem fontSize={"sm"} textColor="gray.400">Share my routine</MenuItem>
                </MenuList>
            </Menu>
            <Card {...disclosureProps}
                bgColor={ThemeColor.backgroundColorDarker}
                color="white"
                fontSize="0.7em"
                margin="0.5em"
                marginBottom={"0em"}
            >
                <CardHeader>
                    <Flex letterSpacing="4">
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <Avatar
                                name={username}
                                src={USER_PROFILE_IMAGE_ROUTE + username + ".jpeg"}
                            />
                            <Box>
                                <Heading fontSize="1.1em">{username}</Heading>
                                <Text fontSize={"0.9em"} color="gray.400"></Text>
                            </Box>
                            <Button onClick={onClose} backgroundColor="red.300" leftIcon={<CloseIcon />}></Button>
                        </Flex>
                    </Flex>
                </CardHeader>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: ThemeColor.backgroundColor,
                        borderLeft: `solid 0.5em ${ThemeColor.backgroundColorDarker}`,
                        borderRight: `solid 0.5em ${ThemeColor.backgroundColorDarker}`,
                    }}
                >
                    {/* {image_list} */}
                </div>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="file" {...register("image")} />
                        <Textarea color="black" {...register("text")} backgroundColor="white" />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "작성 중..." : "작성"}
                        </button>
                    </form>
                </CardBody>

            </Card>


        </>
    );
};

export default CreatePost;