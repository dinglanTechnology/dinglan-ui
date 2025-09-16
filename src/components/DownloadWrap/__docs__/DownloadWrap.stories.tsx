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
        "https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=API+Image+1",
        "https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=API+Image+2",
      ]);
    }, 1000);
  });
};

export const Default: Story = {
  args: {
    fileName: "example.jpg",
    downloadUrls: [
      "https://via.placeholder.com/600x400/007bff/ffffff?text=Download+Me",
    ],
    children: <button>下载文件</button>,
  },
};

export const MultipleFiles: Story = {
  args: {
    fileName: "images",
    downloadUrls: [
      "https://via.placeholder.com/600x400/28a745/ffffff?text=Image+1",
      "https://via.placeholder.com/600x400/dc3545/ffffff?text=Image+2",
      "https://via.placeholder.com/600x400/ffc107/ffffff?text=Image+3",
    ],
    children: <button>下载多个文件</button>,
  },
};

export const ZipDownload: Story = {
  args: {
    fileName: "images_package",
    downloadUrls: [
      "https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Red",
      "https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Blue",
      "https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=Green",
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
    fileName: "disabled-file.txt",
    downloadUrls: ["data:text/plain;charset=utf-8,Disabled%20Content"],
    disabled: true,
    children: <button>禁用状态</button>,
  },
};

export const LargeFileList: Story = {
  args: {
    fileName: "large-file-list",
    downloadUrls: Array.from(
      { length: 10 },
      (_, i) =>
        `data:text/plain;charset=utf-8,Large%20File%20${i + 1}%20Content`,
    ),
    children: <button>下载大量文件</button>,
  },
};

export const LargeFileListZip: Story = {
  args: {
    fileName: "large_files_package",
    downloadUrls: Array.from(
      { length: 10 },
      (_, i) =>
        `data:text/plain;charset=utf-8,Large%20File%20${i + 1}%20Content`,
    ),
    enableZip: true,
    children: <button>下载大量文件（ZIP打包）</button>,
  },
};

export const CustomFileName: Story = {
  args: {
    fileName: "custom-report.json",
    downloadUrls: [
      'data:application/json;charset=utf-8,{"message":"Custom JSON file content","timestamp":"2024-01-01T00:00:00Z"}',
    ],
    children: <button>下载自定义文件</button>,
  },
};
