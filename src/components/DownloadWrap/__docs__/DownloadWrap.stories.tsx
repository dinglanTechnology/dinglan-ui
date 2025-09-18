import type { Meta, StoryObj } from "@storybook/react";
import DownloadWrap from "../downloadWrap";

const meta: Meta<typeof DownloadWrap> = {
  title: "Components/DownloadWrap",
  component: DownloadWrap,
  parameters: {
    docs: {
      description: {
        component:
          "一个用于文件下载的包装组件，支持单文件下载、多文件下载、API获取下载链接以及批量文件ZIP打包功能。",
      },
    },
  },
  argTypes: {
    children: {
      description: "要包装的子元素，通常是按钮或链接",
      control: { type: "text" },
    },
    downloadUrls: {
      description: "下载链接数组（可选）。如果未提供，将使用apiFetch获取",
      control: { type: "object" },
    },
    fileName: {
      description: "下载文件的名称",
      control: { type: "text" },
    },
    apiFetch: {
      description: "用于获取下载链接的API函数（可选）",
      control: false,
    },
    enableZip: {
      description: "是否启用ZIP打包功能。当有多个文件时，将打包成ZIP下载",
      control: { type: "boolean" },
    },
    onSuccess: {
      description: "下载成功时的回调函数",
      control: false,
    },
    onFail: {
      description: "下载失败时的回调函数",
      control: false,
    },
    disabled: {
      description: "是否禁用下载功能",
      control: { type: "boolean" },
    },
    className: {
      description: "自定义CSS类名",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DownloadWrap>;

// 模拟API获取下载链接
const mockApiFetch = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
        "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
      ]);
    }, 1000);
  });
};

export const Default: Story = {
  args: {
    fileName: "example.jpg",
    downloadUrls: [
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
    ],
    children: <button>下载文件</button>,
  },
};

export const MultipleFiles: Story = {
  args: {
    fileName: "images",
    downloadUrls: [
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
    ],
    children: <button>下载多个文件</button>,
  },
};

export const ZipDownload: Story = {
  args: {
    fileName: "images_package",
    downloadUrls: [
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
    ],
    enableZip: true,
    children: <button>下载ZIP压缩包</button>,
  },
};

export const ApiZipDownload: Story = {
  args: {
    fileName: "api_images_package",
    apiFetch: mockApiFetch,
    enableZip: true,
    children: <button>API获取并打包下载</button>,
  },
};

export const Disabled: Story = {
  args: {
    fileName: "test.jpg",
    downloadUrls: [
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
    ],
    disabled: true,
    children: <button>禁用状态</button>,
  },
};

export const LargeFileList: Story = {
  args: {
    fileName: "test.jpg",
    downloadUrls: Array.from(
      { length: 10 },
      (_, i) =>
        `https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg`,
    ),
    children: <button>下载大量文件</button>,
  },
};

export const LargeFileListZip: Story = {
  args: {
    fileName: "test.jpg",
    downloadUrls: Array.from(
      { length: 10 },
      (_, i) =>
        `https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg`,
    ),
    enableZip: true,
    children: <button>下载大量文件（ZIP打包）</button>,
  },
};

export const CustomFileName: Story = {
  args: {
    fileName: "test.jpg",
    downloadUrls: [
      "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
    ],
    children: <button>下载自定义文件</button>,
  },
};
