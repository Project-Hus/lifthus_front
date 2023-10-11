import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { CreateDailyRoutineDto } from "../../../api/dtos/program.dto";
import { ThemeColor } from "../../../common/styles/theme.style";

type WeeklyProgramBuilderProps = {
  typeResetter: () => void;
  dailyRoutines: CreateDailyRoutineDto[];
  dailyRoutineSetter: (dailyRoutines: CreateDailyRoutineDto[]) => void;
};

const WeeklyProgramBuilder = ({
  typeResetter,
  dailyRoutines,
  dailyRoutineSetter,
}: WeeklyProgramBuilderProps) => {
  const [maxWeek, setMaxWeek] = useState(1);
  const weeks = [];
  for (let i = 1; i <= maxWeek; i++) {
    weeks.push(<WeekRoutineBuilder week={i} />);
  }
  return (
    <div>
      {weeks}
      <div>
        <Button
          variant="unstyled"
          color="orange"
          border="0.1rem solid"
          _hover={{ bgColor: ThemeColor.topButtonColor }}
          margin="0.5rem"
          marginLeft="1rem"
          fontWeight="bold"
          fontSize="1.5rem"
          w="40%"
          onClick={() => {
            if (maxWeek === 1) {
              typeResetter();
              return;
            }
            setMaxWeek(maxWeek - 1);
          }}
        >
          -WEEK
        </Button>
        <Button
          variant="unstyled"
          color="skyblue"
          border="0.1rem solid"
          _hover={{ bgColor: ThemeColor.topButtonColor }}
          margin="0.5rem"
          marginLeft="1rem"
          fontWeight="bold"
          fontSize="1.5rem"
          w="40%"
          onClick={() => {
            setMaxWeek(maxWeek + 1);
          }}
        >
          +WEEK
        </Button>
      </div>
    </div>
  );
};
export default WeeklyProgramBuilder;

type WeekRoutineBuilderProps = {
  week: number;
};

const WeekRoutineBuilder = ({ week }: WeekRoutineBuilderProps) => {
  const { getButtonProps, getDisclosureProps } = useDisclosure();
  return (
    <>
      <div {...getButtonProps()}>{week}주차</div>
      <div {...getDisclosureProps()}>asdf</div>
    </>
  );
};
