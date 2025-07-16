import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "InputNumber",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  argTypes: {
    useType: {
      control: { type: "select" },
      options: ["", "money"],
      defaultValue: "money",
    },
  },
  args: {
    useType: "money",
  },
};
