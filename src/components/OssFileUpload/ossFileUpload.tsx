import { message, Upload, UploadFile, UploadProps, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";

export interface OSSResponse {
  params: {
    expire: string;
    policy: string;
    signature: string;
    accessid: string;
    host: string;
    bucket: string;
  };
}

type OssFileUploadProps = UploadProps & {
  children?: React.ReactNode;
  filePath: string;
  generateOss: () => Promise<OSSResponse>;
  /** 支持的文件格式 */
  fileTypes?: string[];
  /** 文件大小限制，单位：MB，默认5MB */
  maxFileSize?: number;
  /** 重试次数，默认为0不重试 */
  retryCount?: number;
  onChange?: (fileList: string[]) => void;
  /** 上传进度回调 */
  onProgress?: (percent: number, file: File) => void;
  /** 上传成功回调 */
  onSuccess?: (url: string, file: File) => void;
  /** 上传失败回调 */
  onError?: (error: Error, file: File) => void;
};

const OssFileUpload = ({
  children,
  filePath,
  generateOss,
  fileTypes = ["image/*"],
  maxFileSize = 5,
  retryCount = 0,
  onProgress,
  onSuccess,
  onError,
  ...props
}: OssFileUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 监听fileList变化，更新onChange回调
  useEffect(() => {
    const validUrls = fileList
      .filter((item) => item.status === "done" && item.url)
      .map((item) => item.url || "");
    props?.onChange?.(validUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  // 检查文件类型是否匹配
  const checkFileType = (file: RcFile): boolean => {
    // 如果包含 '*' 表示支持所有格式
    if (fileTypes.includes("*")) {
      return true;
    }

    // 检查是否匹配任一支持的格式
    return fileTypes.some((type) => {
      if (type.endsWith("/*")) {
        // 处理通配符格式，如 'image/*'
        const prefix = type.slice(0, -2);
        return file.type.startsWith(prefix + "/");
      } else {
        // 精确匹配，如 'image/jpeg'
        return file.type === type;
      }
    });
  };

  // 上传前校验
  const beforeUpload = (file: RcFile) => {
    // 检查文件格式
    if (!checkFileType(file)) {
      const supportedFormats = fileTypes.join(", ");
      message.error(`仅支持以下格式的文件: ${supportedFormats}`);
      return Upload.LIST_IGNORE;
    }

    // 检查文件大小
    const maxSizeInBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      message.error(`文件大小不能超过${maxFileSize}MB!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // 检查是否为图片类型
  const isImageFile = (file: UploadFile): boolean => {
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
    ];
    return imageTypes.some(
      (type) =>
        file.type === type ||
        file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i),
    );
  };

  // 移除数据
  const handleRemove: UploadProps["onRemove"] = (file) => {
    setFileList((preList) => preList.filter((item) => item.uid !== file.uid));
  };

  // 处理预览
  const handlePreview = async (file: UploadFile) => {
    // 如果是图片类型，使用Image组件预览
    if (isImageFile(file)) {
      setPreviewImage(file.url || file.thumbUrl || "");
      setPreviewVisible(true);
    } else {
      // 非图片类型，直接下载
      if (file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // 自定义上传处理器
  const handleCustomRequest: UploadProps["customRequest"] = async (options) => {
    const {
      file,
      onProgress: antdOnProgress,
      onSuccess: antdOnSuccess,
      onError: antdOnError,
    } = options;
    const fileObj = file as File;

    const fileUid = (fileObj as RcFile).uid || `${Date.now()}-${Math.random()}`;

    try {
      // 添加文件到列表，状态为uploading
      const uploadingFile: UploadFile = {
        uid: fileUid,
        name: fileObj.name,
        status: "uploading",
        percent: 0,
        originFileObj: fileObj as RcFile,
      };

      setFileList((preList) => [...preList, uploadingFile]);

      // 初始进度
      antdOnProgress?.({ percent: 10 });
      onProgress?.(10, fileObj);

      // 更新进度
      setFileList((preList) =>
        preList.map((item) =>
          item.uid === fileUid ? { ...item, percent: 10 } : item,
        ),
      );

      const uploadedUrl = await onCustomRequest(fileObj);

      console.log(uploadedUrl, "uploadedUrl");

      // 完成进度
      antdOnProgress?.({ percent: 100 });
      onProgress?.(100, fileObj);

      // 更新文件状态为done
      setFileList((preList) =>
        preList.map((item) =>
          item.uid === fileUid
            ? { ...item, status: "done", percent: 100, url: uploadedUrl }
            : item,
        ),
      );

      // 成功回调
      antdOnSuccess?.(uploadedUrl);
      onSuccess?.(uploadedUrl, fileObj);

      // 更新文件状态为done
      setFileList((currentList) => {
        return currentList.map((item) =>
          item.uid === fileUid
            ? {
                ...item,
                status: "done" as const,
                percent: 100,
                url: uploadedUrl,
              }
            : item,
        );
      });
    } catch (error) {
      const errorObj = error as Error;

      // 更新文件状态为error
      setFileList((preList) =>
        preList.map((item) =>
          item.uid === fileUid
            ? { ...item, status: "error", percent: 0 }
            : item,
        ),
      );

      // 错误回调
      message.error(errorObj.message || "文件上传失败");
      antdOnError?.(errorObj);
      onError?.(errorObj, fileObj);
    }
  };

  const onCustomRequest = async (
    fileUrlInfo: File,
    currentRetry = 0,
  ): Promise<string> => {
    try {
      const res = await generateOss();
      const { policy, signature, accessid, host } = res.params;
      const name = fileUrlInfo.name;

      const formData = new FormData();
      formData.append("policy", policy);
      formData.append("signature", signature);
      formData.append("OSSAccessKeyId", accessid);
      formData.append("key", filePath + name);
      formData.append("success_action_status", "200");
      formData.append("file", fileUrlInfo);

      const param = {
        method: "POST",
        body: formData,
      };

      await fetch(host, param);
      const fileUrl = host + "/" + filePath + name;
      return fileUrl;
    } catch (error) {
      console.log(error, "error");

      // 如果还有重试次数，则重试
      if (currentRetry < retryCount) {
        console.log(`上传失败，正在重试 ${currentRetry + 1}/${retryCount}`);
        return onCustomRequest(fileUrlInfo, currentRetry + 1);
      }

      // 重试次数用完，抛出错误
      throw new Error(`上传失败，已重试${retryCount}次`);
    }
  };

  const onChangeFn: UploadProps["onChange"] = (info) => {
    // 不做任何处理，info需要被调用，否则会报错，但是不使用info
    console.log(info, "onChange");
  };

  return (
    <>
      <Upload
        {...props}
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={handleCustomRequest}
        onRemove={handleRemove}
        onPreview={handlePreview}
        onChange={onChangeFn}
        progress={{
          strokeColor: {
            "0%": "#108ee9",
            "100%": "#87d068",
          },
          size: 3,
          format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        }}
      >
        {fileList.length < (props.maxCount || 1) &&
          (children ? children : <PlusOutlined style={{ fontSize: 30 }} />)}
      </Upload>

      <Image
        width={0}
        height={0}
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => {
            setPreviewVisible(visible);
            if (!visible) {
              setPreviewImage("");
            }
          },
        }}
      />
    </>
  );
};

export default OssFileUpload;
