import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
import JSZip from "jszip";

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 下载进度信息
export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  fileName: string;
}

// 下载错误类型
export enum DownloadErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  HTTP_ERROR = "HTTP_ERROR",
  ZIP_ERROR = "ZIP_ERROR",
  ABORT_ERROR = "ABORT_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// 自定义下载错误
export class DownloadError extends Error {
  public readonly type: DownloadErrorType;
  public readonly statusCode?: number;
  public readonly url?: string;

  constructor(
    message: string,
    type: DownloadErrorType,
    statusCode?: number,
    url?: string,
  ) {
    super(message);
    this.name = "DownloadError";
    this.type = type;
    this.statusCode = statusCode;
    this.url = url;
  }
}

export interface DownloadWrapProps {
  children?: React.ReactNode;
  downloadUrls?: string[];
  fileName: string;
  apiFetch?: (params?: Record<string, unknown>) => Promise<Blob>;
  enableZip?: boolean;
  onSuccess?: (fileName: string) => void;
  onFail?: (error: DownloadError, fileName: string) => void;
  onProgress?: (progress: DownloadProgress) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
  maxConcurrency?: number;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  maxFileSize?: number; // 最大文件大小（字节）
  chunkSize?: number; // 分块下载大小（字节）
}

interface StyledProps {
  disabled?: boolean;
  loading?: boolean;
}

const StyledDownloadWrap = styled.div<StyledProps>`
  display: inline-block;
  cursor: ${(props) =>
    props.disabled || props.loading ? "not-allowed" : "pointer"};
  opacity: ${(props) => (props.disabled || props.loading ? 0.6 : 1)};
  transition: opacity 0.2s ease;
  position: relative;

  &:hover {
    opacity: ${(props) => (props.disabled || props.loading ? 0.6 : 0.8)};
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: ${(props) => (props.loading ? "block" : "none")};
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
  onProgress,
  onLoadingChange,
  className,
  disabled = false,
  maxConcurrency = 3,
  timeout = 30000,
  retryCount = 3,
  retryDelay = 1000,
  maxFileSize = 100 * 1024 * 1024, // 默认100MB
  // chunkSize = 64 * 1024, // 默认64KB - 暂时未使用
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const downloadFile = useCallback(
    async (
      url: string,
      filename: string,
      retryAttempt: number = 0,
    ): Promise<void> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new DownloadError(
            `HTTP error! status: ${response.status}`,
            DownloadErrorType.HTTP_ERROR,
            response.status,
            url,
          );
        }

        // 检查文件大小
        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > maxFileSize) {
          throw new DownloadError(
            `File size (${formatFileSize(parseInt(contentLength))}) exceeds maximum allowed size (${formatFileSize(maxFileSize)})`,
            DownloadErrorType.UNKNOWN_ERROR,
            undefined,
            url,
          );
        }

        const blob = await response.blob();

        // 再次检查实际下载的文件大小
        if (blob.size > maxFileSize) {
          throw new DownloadError(
            `File size (${formatFileSize(blob.size)}) exceeds maximum allowed size (${formatFileSize(maxFileSize)})`,
            DownloadErrorType.UNKNOWN_ERROR,
            undefined,
            url,
          );
        }

        // 报告进度
        onProgress?.({
          loaded: blob.size,
          total: blob.size,
          percentage: 100,
          fileName: filename,
        });

        saveAs(blob, filename);
        onSuccess?.(filename);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new DownloadError(
            "Download was aborted",
            DownloadErrorType.ABORT_ERROR,
            undefined,
            url,
          );
        }

        if (retryAttempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return downloadFile(url, filename, retryAttempt + 1);
        }

        const err =
          error instanceof DownloadError
            ? error
            : new DownloadError(
                error instanceof Error ? error.message : "Download failed",
                DownloadErrorType.NETWORK_ERROR,
                undefined,
                url,
              );

        onFail?.(err, filename);
        throw err;
      }
    },
    [
      timeout,
      retryCount,
      retryDelay,
      maxFileSize,
      onProgress,
      onSuccess,
      onFail,
    ],
  );

  const downloadAsZip = useCallback(
    async (urls: string[], zipFileName: string) => {
      const zip = new JSZip();

      try {
        // 并发获取所有文件
        const filePromises = urls.map(async (url, index) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          try {
            const response = await fetch(url, {
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new DownloadError(
                `HTTP error! status: ${response.status} for URL: ${url}`,
                DownloadErrorType.HTTP_ERROR,
                response.status,
                url,
              );
            }

            const blob = await response.blob();
            const fileExtension = url.split(".").pop() || "txt";
            const fileName = `file_${index + 1}.${fileExtension}`;

            // 报告单个文件进度
            onProgress?.({
              loaded: blob.size,
              total: blob.size,
              percentage: 100,
              fileName: fileName,
            });

            return { fileName, blob };
          } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === "AbortError") {
              throw new DownloadError(
                "Download was aborted",
                DownloadErrorType.ABORT_ERROR,
                undefined,
                url,
              );
            }
            throw error;
          }
        });

        const files = await Promise.all(filePromises);

        // 将所有文件添加到ZIP
        files.forEach(({ fileName, blob }) => {
          zip.file(fileName, blob);
        });

        // 报告ZIP创建进度
        onProgress?.({
          loaded: files.length,
          total: files.length,
          percentage: 100,
          fileName: zipFileName,
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
          error instanceof DownloadError
            ? error
            : new DownloadError(
                error instanceof Error ? error.message : "ZIP creation failed",
                DownloadErrorType.ZIP_ERROR,
              );
        onFail?.(err, zipFileName);
        throw err;
      }
    },
    [timeout, onProgress, onSuccess, onFail],
  );

  const downloadWithConcurrencyLimit = useCallback(
    async (urls: string[], baseFileName: string) => {
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

        // 报告整体进度
        onProgress?.({
          loaded: index,
          total: urls.length,
          percentage: Math.round((index / urls.length) * 100),
          fileName: indexedFileName,
        });

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
    },
    [downloadFile, onProgress, maxConcurrency],
  );

  const handleClick = useCallback(async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    onLoadingChange?.(true);

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 如果提供了 apiFetch，直接使用它获取 Blob 并下载
      if (apiFetch) {
        const blob = await apiFetch({
          signal: abortControllerRef.current.signal,
        });

        // 报告进度
        onProgress?.({
          loaded: blob.size,
          total: blob.size,
          percentage: 100,
          fileName: fileName,
        });

        saveAs(blob, fileName);
        onSuccess?.(fileName);
        return;
      }

      // 如果没有提供 downloadUrls，抛出错误
      if (!downloadUrls || downloadUrls.length === 0) {
        throw new DownloadError(
          "No download URLs available",
          DownloadErrorType.UNKNOWN_ERROR,
        );
      }

      // 如果启用ZIP模式且有多个文件，打包成ZIP下载
      if (enableZip && downloadUrls.length > 1) {
        await downloadAsZip(downloadUrls, fileName);
      } else if (downloadUrls.length === 1) {
        // 单个文件直接下载
        await downloadFile(downloadUrls[0], fileName);
      } else {
        // 多个文件分别下载（不启用ZIP时）
        await downloadWithConcurrencyLimit(downloadUrls, fileName);
      }
    } catch (error) {
      const err =
        error instanceof DownloadError
          ? error
          : new DownloadError(
              error instanceof Error
                ? error.message
                : "An unknown error occurred during download",
              DownloadErrorType.UNKNOWN_ERROR,
            );
      onFail?.(err, fileName);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
      abortControllerRef.current = null;
    }
  }, [
    disabled,
    isLoading,
    apiFetch,
    downloadUrls,
    fileName,
    enableZip,
    downloadAsZip,
    downloadFile,
    downloadWithConcurrencyLimit,
    onSuccess,
    onFail,
    onProgress,
    onLoadingChange,
  ]);

  return (
    <StyledDownloadWrap
      className={className}
      disabled={disabled}
      loading={isLoading}
      onClick={handleClick}
      {...props}
    >
      {children}
    </StyledDownloadWrap>
  );
};

export default DownloadWrap;
