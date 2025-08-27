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
      control: {
        type: "select",
        description: "选择日期组件类型",
      },
      options: ["date", "dateRange", "time", "timeRange"],
      defaultValue: "date",
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
    valueRange: false,
    showTime: false,
  },
};
