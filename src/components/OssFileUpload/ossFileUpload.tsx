import { message, Upload, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useState } from "react";

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
  onChange?: (fileList: string[]) => void;
};

const OssFileUpload = ({
  children,
  filePath,
  generateOss,
  fileTypes = ["image/*"],
  maxFileSize = 5,
  ...props
}: OssFileUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

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

  // 移除数据
  const handleRemove: UploadProps["onRemove"] = (file) => {
    console.log("移除数据", fileList);
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    props?.onChange?.(
      fileList
        .filter((item) => item.uid !== file.uid)
        .map((item) => item.url || ""),
    );
  };

  // 处理数据
  const processFileList = (imgUrl: string | unknown[] | undefined) => {
    if (typeof imgUrl === "string" && imgUrl) {
      const name = imgUrl.split("/").pop() || "";
      return [{ uid: imgUrl, name, url: imgUrl }];
    }
    return [];
  };

  // 自定义上传处理器
  const handleCustomRequest: UploadProps["customRequest"] = async (options) => {
    try {
      const { file } = options;
      setUploading(true);
      const urls = await onCustomRequest(file as File);
      setUploading(false);

      console.log(urls, "urls");

      if (urls) {
        setFileList((preList) => [...preList, ...processFileList(urls)]);
        props?.onChange?.(
          [...fileList, ...processFileList(urls)].map((item) => item.url || ""),
        );
      }
    } catch (error) {
      message.error("图片上传失败");
      options.onError?.(error as Error);
      setUploading(false);
    }
  };

  const onCustomRequest = async (fileUrlInfo: File) => {
    let fileUrl: string = "";

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
      fileUrl = host + "/" + filePath + name;
    } catch (error) {
      console.log(error, "error");
      throw new Error("上传失败");
    }

    return fileUrl;
  };

  const onChangeFn: UploadProps["onChange"] = (info) => {
    console.log(info, "info");
  };

  return (
    <Upload
      {...props}
      fileList={fileList.length ? fileList : undefined}
      beforeUpload={beforeUpload}
      customRequest={handleCustomRequest}
      onRemove={handleRemove}
      disabled={uploading}
      onChange={onChangeFn}
      progress={{
        strokeColor: {
          "0%": "#108ee9",
          "100%": "#87d068",
        },
        strokeWidth: 3,
        format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
      }}
    >
      {fileList.length < (props.maxCount || 1) &&
        (children ? children : <PlusOutlined style={{ fontSize: 30 }} />)}
    </Upload>
  );
};

export default OssFileUpload;
