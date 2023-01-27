import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import registerApi from "../../api/registerApi";

import FormInput, {
  IFormInputValues,
} from "../../common/components/forms/FormInput";
import BlueLink from "../../common/components/links/BlueLink";
import Logo from "../../common/components/Logo";
import { nickname_limit } from "../../common/constraints";

import useAppStore from "../../store/app.zustand";
import useRegisterStore from "../../store/register.zustand";

const RegisterNickname = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  /* store */
  const user_id = useAppStore((state) => state.user_id);
  const register_nickname = useRegisterStore(
    (state) => state.register_nickname
  );
  const set_register_info = useRegisterStore(
    (state) => state.set_register_info
  );

  /* hook-form */
  const { register, watch, getValues } = useForm<IFormInputValues>({
    shouldUseNativeValidation: true,
    defaultValues: { nickname: register_nickname },
  });

  /* state */
  const [failed, setFailed] = useState(false);

  return (
    <>
      <Logo />
      <p>{t("{{name}}", { name: user_id })},</p>
      <p>
        {!failed && t("What nickname would you like to use?")}
        {failed && t("This nickname is already existing.")}
      </p>
      <FormInput
        placeholder={"nickname"}
        focusString={"3~16자"}
        {...register("nickname", {
          required: true,
          minLength: 3,
          maxLength: 16,
          onChange: (e) => setFailed(false),
        })}
      ></FormInput>
      <p></p>
      {(watch("nickname") || "").length >= nickname_limit.min && (
        <BlueLink
          onClick={(e) => {
            const { ok } = registerApi.register_nickname({
              id: user_id,
              nickname: getValues("nickname"),
            });
            if (ok) {
              set_register_info({ register_nickname: getValues("nickname") });
              navigate("/register/type");
            } else {
              setFailed(true);
            }
          }}
        >
          {t("Next")}
        </BlueLink>
      )}
    </>
  );
};

export default RegisterNickname;
