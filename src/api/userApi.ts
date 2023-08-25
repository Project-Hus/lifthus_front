import axios from "axios";
import { LIFTHUS_AUTH_URL } from "../common/routes";
import { GetUserInfoDto } from "./dtos/user.dto";
import {
  Uid,
  UserApi,
  UserMutationParams,
  Username,
} from "./interfaces/userApi.interface";

import statusInfo from "./interfaces/statusInfo.json";

const userApi: UserApi = {
  setUserInfo: async (newUserinfo: UserMutationParams) => {
    // if (process.env.NODE_ENV === "development") {
    //   return userTestApi.setUserInfo(newUserinfo);
    // }
    const res = await axios.patch(
      LIFTHUS_AUTH_URL + "/auth/user",
      newUserinfo,
      {
        withCredentials: true,
      }
    );
    return res.data;
  },
  getUserInfo: async ({ uid }: Uid) => {
    // if (process.env.NODE_ENV === "development") {
    //   return await userTestApi.getUserInfo({ uid });
    // }
    const res = await axios.get(LIFTHUS_AUTH_URL + "/auth/user/info/" + uid, {
      withCredentials: true,
    });

    if (res.status === statusInfo.fail.NotFound.code) return null;
    return res.data;
  },
  getUserInfoByUsername: async ({
    username,
  }: Username): Promise<GetUserInfoDto> => {
    // if (process.env.NODE_ENV === "development") {
    //   return userTestApi.getUserInfoByUsername({ username });
    // }
    const res = await axios.get(
      LIFTHUS_AUTH_URL + "/auth/username/info/" + username,
      {
        withCredentials: true,
      }
    );

    if (res.status === statusInfo.fail.NotFound.code)
      return Promise.reject(404);
    return res.data;
  },
};

export default userApi;
