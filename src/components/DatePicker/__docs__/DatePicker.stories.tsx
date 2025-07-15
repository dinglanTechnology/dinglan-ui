import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "DatePicker",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  argTypes: {
    pickerType: {
      control: { type: "select" },
      options: ["date", "dateRange", "time", "timeRange"],
      description: "选择日期组件类型",
      defaultValue: "dateRange",
    },
    valueRange: {
      control: { type: "select" },
      options: [true, false],
    },
    showTime: {
      control: { type: "select" },
      options: [true, false],
    },
  },
  args: {
    pickerType: "",
    valueRange: false,
    showTime: false,
  },
};
