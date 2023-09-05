import {
  CreatePostDtoInput,
  DeletePostResponse,
  PostDto,
  UpdatePostDtoInput,
  UpdatePostResponse,
} from "../dtos/post.dto";
import { PostSummaryDto } from "../dtos/postSummary.dto";

export interface PostApi {
  getPost: ({ pid, slug }: { pid?: string; slug?: string }) => Promise<PostDto>;
  getAllPosts: (skip?: number) => Promise<PostSummaryDto[]>;
  getUserPosts: ({
    uid,
    skip,
  }: GetUserPostsParams) => Promise<PostSummaryDto[]>;
  getUsersPosts: ({
    users,
    skip,
  }: {
    users: string[];
    skip: number;
  }) => Promise<PostSummaryDto[]>;
  createPost: ({
    author,
    images,
    content,
  }: CreatePostDtoInput) => Promise<PostDto>;
  updatePost: ({
    id,
    author,
    content,
  }: UpdatePostDtoInput) => Promise<UpdatePostResponse>;
  deletePost: (pid: string) => Promise<DeletePostResponse>;
  likePost: (pid: string) => Promise<string>;
}

export type GetUserPostsParams = {
  uid: string;
  skip?: number;
};
