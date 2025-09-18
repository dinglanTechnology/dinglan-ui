import { FormInstance, message, Upload, UploadFile, UploadProps } from "antd";
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
  form: FormInstance;
  nameField: string;
};

const OssFileUpload = ({
  children,
  filePath,
  generateOss,
  form,
  nameField,
  ...props
}: OssFileUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 上传前校验,限制图片大小不能超过5MB
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    const isGif = file.type === "image/gif";
    if (!isImage) {
      message.error("仅支持图片格式!");
      return Upload.LIST_IGNORE;
    }
    if (isGif) {
      message.error("不支持 GIF 格式的图片上传!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("图片大小不能超过5MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 移除数据
  const handleRemove: UploadProps["onRemove"] = (file) => {
    console.log("移除数据", fileList);
    form.setFieldValue(
      nameField,
      fileList.map((item) => item.url),
    );
    setFileList(fileList.filter((item) => item.uid !== file.uid));
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
        form.setFieldValue(nameField, urls);
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

  return (
    <Upload
      {...props}
      fileList={fileList}
      beforeUpload={beforeUpload}
      customRequest={handleCustomRequest}
      onRemove={handleRemove}
      disabled={uploading}
    >
      {fileList.length < (props.maxCount || 1) &&
        (children ? children : <PlusOutlined style={{ fontSize: 30 }} />)}
    </Upload>
  );
};

export default OssFileUpload;
