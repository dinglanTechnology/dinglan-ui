import React, { FC, useState } from "react";
import DownloadWrap from "../downloadWrap";

interface ExampleProps {
  disabled?: boolean;
  fileName?: string;
  downloadUrls?: string[];
}

const Example: FC<ExampleProps> = ({
  disabled = false,
  fileName = "sample-file.txt",
  downloadUrls = ["data:text/plain;charset=utf-8,Hello%20World!"],
}) => {
  const [message, setMessage] = useState<string>("");

  const handleSuccess = (fileName: string) => {
    setMessage(`文件 ${fileName} 下载成功！`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleFail = (error: Error, fileName: string) => {
    setMessage(`文件 ${fileName} 下载失败: ${error.message}`);
    setTimeout(() => setMessage(""), 3000);
  };

  // 模拟API获取下载URLs的函数
  const mockApiFetch = async (): Promise<string[]> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 返回模拟的下载URLs
    return [
      "data:text/plain;charset=utf-8,API%20File%201%20Content",
      "data:text/plain;charset=utf-8,API%20File%202%20Content",
    ];
  };

  const mockSingleApiFetch = async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ["data:text/plain;charset=utf-8,Single%20API%20File%20Content"];
  };

  // 模拟API获取多文件下载URLs（用于ZIP打包）
  const mockZipApiFetch = async (): Promise<string[]> => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      "https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Image1",
      "https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Image2",
      "https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Image3",
      "https://via.placeholder.com/600x400/96CEB4/FFFFFF?text=Image4",
    ];
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
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            下载单个文件
          </button>
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
