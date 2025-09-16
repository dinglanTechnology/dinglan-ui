import React from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export interface DownloadWrapProps {
  children?: React.ReactNode;
  downloadUrls?: string[];
  fileName: string;
  apiFetch?: () => Promise<string[]>;
  enableZip?: boolean;
  onSuccess?: (fileName: string) => void;
  onFail?: (error: Error, fileName: string) => void;
  className?: string;
  disabled?: boolean;
}

interface StyledProps {
  disabled?: boolean;
}

const StyledDownloadWrap = styled.div<StyledProps>`
  display: inline-block;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.6 : 0.8)};
  }
`;

const DownloadWrap: React.FC<DownloadWrapProps> = ({
  children,
  downloadUrls,
  fileName,
  apiFetch,
  enableZip = false,
  onSuccess,
  onFail,
  className,
  disabled = false,
  ...props
}) => {
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      saveAs(blob, filename);
      onSuccess?.(filename);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Download failed");
      onFail?.(err, filename);
    }
  };

  const downloadAsZip = async (urls: string[], zipFileName: string) => {
    const zip = new JSZip();

    try {
      // 并发获取所有文件
      const filePromises = urls.map(async (url, index) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} for URL: ${url}`,
          );
        }
        const blob = await response.blob();
        const fileExtension = url.split(".").pop() || "txt";
        const fileName = `file_${index + 1}.${fileExtension}`;
        return { fileName, blob };
      });

      const files = await Promise.all(filePromises);

      // 将所有文件添加到ZIP
      files.forEach(({ fileName, blob }) => {
        zip.file(fileName, blob);
      });

      // 生成ZIP文件并下载
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const finalZipName = zipFileName.endsWith(".zip")
        ? zipFileName
        : `${zipFileName}.zip`;
      saveAs(zipBlob, finalZipName);
      onSuccess?.(finalZipName);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("ZIP creation failed");
      onFail?.(err, zipFileName);
    }
  };

  const downloadWithConcurrencyLimit = async (
    urls: string[],
    baseFileName: string,
    maxConcurrency: number = 3,
  ) => {
    const results: Promise<void>[] = [];
    let index = 0;

    const processNext = async (): Promise<void> => {
      if (index >= urls.length) return;

      const currentIndex = index++;
      const url = urls[currentIndex];
      const fileExtension = url.split(".").pop() || "";
      const indexedFileName =
        urls.length > 1
          ? `${baseFileName.replace(/\.[^/.]+$/, "")}_${currentIndex + 1}.${fileExtension}`
          : baseFileName;

      await downloadFile(url, indexedFileName);

      // 添加延迟避免浏览器阻止多个下载
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 处理下一个文件
      return processNext();
    };

    // 启动最多 maxConcurrency 个并发下载
    for (let i = 0; i < Math.min(maxConcurrency, urls.length); i++) {
      results.push(processNext());
    }

    await Promise.all(results);
  };

  const handleClick = async () => {
    if (disabled) return;

    try {
      let urls = downloadUrls;

      // 如果没有提供 downloadUrls，尝试使用 apiFetch 获取
      if (!urls && apiFetch) {
        urls = await apiFetch();
      }

      if (!urls || urls.length === 0) {
        throw new Error("No download URLs available");
      }

      // 如果启用ZIP模式且有多个文件，打包成ZIP下载
      if (enableZip && urls.length > 1) {
        await downloadAsZip(urls, fileName);
      } else if (urls.length === 1) {
        // 单个文件直接下载
        await downloadFile(urls[0], fileName);
      } else {
        // 多个文件分别下载（不启用ZIP时）
        await downloadWithConcurrencyLimit(urls, fileName);
      }
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("An unknown error occurred during download");
      onFail?.(err, fileName);
    }
  };

  return (
    <StyledDownloadWrap
      className={className}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </StyledDownloadWrap>
  );
};

export default DownloadWrap;
