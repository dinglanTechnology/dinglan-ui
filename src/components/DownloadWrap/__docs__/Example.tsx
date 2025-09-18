import React, { FC, useState } from "react";
import { Button } from "antd";
import DownloadWrap, { DownloadError } from "../downloadWrap";

interface ExampleProps {
  disabled?: boolean;
  fileName?: string;
  downloadUrls?: string[];
}

const Example: FC<ExampleProps> = ({
  disabled = false,
  fileName = "test.jpg",
  downloadUrls = [
    "https://microbex-hte-oss.zhilingtech.com/1755855509851-9X3HnpAdk-hH_KkW_QOWimages1.jpg",
  ],
}) => {
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<{
    loaded: number;
    total: number;
    percentage: number;
    fileName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSuccess = (fileName: string) => {
    setMessage(`文件 ${fileName} 下载成功！`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleFail = (error: DownloadError, fileName: string) => {
    setMessage(
      `文件 ${fileName} 下载失败: ${error.message} (类型: ${error.type})`,
    );
    setTimeout(() => setMessage(""), 3000);
  };

  const handleProgress = (progressData: {
    loaded: number;
    total: number;
    percentage: number;
    fileName: string;
  }) => {
    setProgress(progressData);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setProgress(null);
    }
  };

  // 模拟API获取Blob的函数
  const mockApiFetch = async (): Promise<Blob> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 返回模拟的Blob数据
    const content = "API File Content - This is a mock blob response";
    return new Blob([content], { type: "text/plain" });
  };

  const mockSingleApiFetch = async (): Promise<Blob> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const content = "Single API File Content - This is a mock blob response";
    return new Blob([content], { type: "text/plain" });
  };

  // 模拟API获取多文件下载URLs（用于ZIP打包）
  const mockZipApiFetch = async (): Promise<Blob> => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 创建一个包含多个文件的ZIP Blob
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // 添加一些模拟文件
    zip.file("file1.txt", "Content of file 1");
    zip.file("file2.txt", "Content of file 2");
    zip.file("file3.txt", "Content of file 3");

    return await zip.generateAsync({ type: "blob" });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* 单文件下载示例 */}
        <DownloadWrap
          fileName={fileName}
          downloadUrls={downloadUrls}
          disabled={disabled}
          onSuccess={handleSuccess}
          onFail={handleFail}
          onProgress={handleProgress}
          onLoadingChange={handleLoadingChange}
        >
          <Button type="primary" loading={isLoading}>
            下载
          </Button>
        </DownloadWrap>

        {/* 多文件下载示例 */}
        <DownloadWrap
          fileName="multiple-files.txt"
          downloadUrls={[
            "data:text/plain;charset=utf-8,File%201%20Content",
            "data:text/plain;charset=utf-8,File%202%20Content",
            "data:text/plain;charset=utf-8,File%203%20Content",
          ]}
          disabled={disabled}
          onSuccess={handleSuccess}
          onFail={handleFail}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            下载多个文件
          </button>
        </DownloadWrap>

        {/* API获取单文件下载示例 */}
        <DownloadWrap
          fileName="api-single-file.txt"
          apiFetch={mockSingleApiFetch}
          disabled={disabled}
          onSuccess={handleSuccess}
          onFail={handleFail}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            API获取单文件
          </button>
        </DownloadWrap>

        {/* API获取多文件下载示例 */}
        <DownloadWrap
          fileName="api-multiple-files.txt"
          apiFetch={mockApiFetch}
          disabled={disabled}
          onSuccess={handleSuccess}
          onFail={handleFail}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#fd7e14",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            API获取多文件
          </button>
        </DownloadWrap>

        {/* 禁用状态示例 */}
        <DownloadWrap
          fileName="disabled-file.txt"
          downloadUrls={["data:text/plain;charset=utf-8,Disabled%20Content"]}
          disabled={true}
          onSuccess={handleSuccess}
          onFail={handleFail}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "not-allowed",
              opacity: 0.6,
            }}
          >
            禁用状态
          </button>
        </DownloadWrap>

        {/* API获取多文件下载（ZIP打包）示例 */}
        <DownloadWrap
          fileName="images_package"
          apiFetch={mockZipApiFetch}
          enableZip={true}
          onSuccess={(fileName) => console.log(`ZIP包下载成功: ${fileName}`)}
          onFail={(error, fileName) =>
            console.error(`ZIP包下载失败: ${fileName}`, error)
          }
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            下载图片压缩包
          </button>
        </DownloadWrap>

        {/* 多文件下载（不打包）示例 */}
        <DownloadWrap
          fileName="images"
          apiFetch={mockZipApiFetch}
          enableZip={false}
          onSuccess={(fileName) => console.log(`文件下载成功: ${fileName}`)}
          onFail={(error, fileName) =>
            console.error(`文件下载失败: ${fileName}`, error)
          }
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            分别下载多个图片
          </button>
        </DownloadWrap>

        {/* 直接提供URLs的ZIP打包下载示例 */}
        <DownloadWrap
          downloadUrls={[
            "https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Red",
            "https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Blue",
            "https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=Green",
          ]}
          fileName="colors_package"
          enableZip={true}
          onSuccess={(fileName) => console.log(`ZIP包下载成功: ${fileName}`)}
          onFail={(error, fileName) =>
            console.error(`ZIP包下载失败: ${fileName}`, error)
          }
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#20c997",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            下载颜色图片压缩包
          </button>
        </DownloadWrap>
      </div>

      {/* 进度显示 */}
      {progress && (
        <div
          style={{
            padding: "10px 15px",
            backgroundColor: "#e3f2fd",
            color: "#1565c0",
            border: "1px solid #bbdefb",
            borderRadius: "4px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <div>正在下载: {progress.fileName}</div>
          <div>
            进度: {progress.percentage}% ({progress.loaded}/{progress.total})
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              marginTop: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress.percentage}%`,
                height: "100%",
                backgroundColor: "#2196f3",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* 消息提示 */}
      {message && (
        <div
          style={{
            padding: "10px 15px",
            backgroundColor: message.includes("成功") ? "#d4edda" : "#f8d7da",
            color: message.includes("成功") ? "#155724" : "#721c24",
            border: `1px solid ${
              message.includes("成功") ? "#c3e6cb" : "#f5c6cb"
            }`,
            borderRadius: "4px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Example;
