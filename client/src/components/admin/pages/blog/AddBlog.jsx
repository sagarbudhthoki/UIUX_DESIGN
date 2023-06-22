import React, { useState } from "react";
import "./AddBlog.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { Stepper } from "react-form-stepper";
import CustomInput from "../../../customInput/CustomInput";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;

const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file upload successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const AddBlog = () => {
  const [desc, setDesc] = useState("");
  const handleDesc = (e) => {
    setDesc(e);
  };
  return (
    <>
      <h3 className="mb-4">Add Blog</h3>
      {/* <Stepper
        steps={[
          { label: "Add Blog Details" },
          { label: "Upload Images" },
          { label: "Finish" },
        ]}
        activeStep={1}
      /> */}
      <div>
        <div className="">
          <form action="">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files.
              </p>
            </Dragger>
            <div className="mt-4">
              <CustomInput type="text" label="Enter Blog Title" />
            </div>
            <select name="" className="form-control py-3 mb-3" id="">
              <option value="">Select Blog Category</option>
            </select>
            <ReactQuill
              theme="snow"
              value={desc}
              onChange={(evt) => {
                handleDesc(evt.target.value);
              }}
            />
            <button className="btn btn-success border-0 rounded-3 my-5">
              Add Blog
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBlog;
