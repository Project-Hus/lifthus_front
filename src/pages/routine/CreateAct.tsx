import {
  Button,
  Img,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useForm } from "react-hook-form";
import BasicPageLayout from "../../common/components/layouts/BasicPageLayout";
import { ThemeColor } from "../../common/styles/theme.style";
import {
  CreateProgramHeadDiv,
  CreateProgramInternalDiv,
} from "./CreateProgram";
import { RoutinePanel } from "./Routine";

const CreateAct = () => {
  const { register, handleSubmit, watch } = useForm();
  return (
    <BasicPageLayout>
      <RoutinePanel>
        <CreateProgramHeadDiv>새 동작 생성</CreateProgramHeadDiv>
        <CreateProgramInternalDiv noBorder={true}>
          <Text fontWeight="bold" marginTop="1rem">
            동작 이름
          </Text>
          <Input
            border="none"
            bgColor={ThemeColor.backgroundColorDarker}
            w="70%"
            margin="1rem"
            textAlign={"center"}
            fontSize="1.5rem"
            {...register("actName")}
          />
        </CreateProgramInternalDiv>
        <CreateProgramInternalDiv>
          <Img
            margin="auto"
            marginTop="1rem"
            marginBottom="1rem"
            w="50%"
            objectFit="cover"
            src="https://media.tenor.com/t3buP-QoO9oAAAAM/jim-carrey-work.gif"
          />
          <RadioDiv>
            <RadioGroup>
              <Stack direction="row">
                <Radio value="weight" {...register("actType")}>
                  무게
                </Radio>
                <Radio value="time" {...register("actType")}>
                  시간
                </Radio>
                <Radio value="simple" {...register("actType")}>
                  단순
                </Radio>
              </Stack>
            </RadioGroup>
          </RadioDiv>
          <Textarea
            placeholder="동작 설명을 입력하세요"
            w="90%"
            border="none"
            bgColor={ThemeColor.backgroundColorDarker}
            marginBottom="1rem"
            {...register("actText")}
          />
        </CreateProgramInternalDiv>
        <ButtonDiv>
          <Button bgColor="orange" onClick={() => window.history.back()}>
            취소
          </Button>
          <Button isDisabled={!watch("actType")}>생성</Button>
        </ButtonDiv>
      </RoutinePanel>
    </BasicPageLayout>
  );
};
export default CreateAct;

const RadioDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 25%;
    margin: 1rem;
    font-size: 2rem;
  }
`;