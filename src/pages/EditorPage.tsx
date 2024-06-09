import styles from "./EditorPage.module.css";
import DragFG from "../components/DragFG";
import DragText from "../components/DragText";

import { DraggableData, DraggableEvent } from "react-draggable";
import html2canvas from "html2canvas";

import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// ANT DESIGN
import {
  Button,
  ColorPicker,
  Form,
  Input,
  Upload,
  Segmented,
  ColorPickerProps,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { RcFile } from "antd/es/upload/interface";
import { addTemplate, getId, selectTemplates } from "../redux/templateSlice";

const { TextArea } = Input;

const EditorPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [background, setBackground] = useState<string>("");

  const [text, setText] = useState<{
    title: string;
    titleFontSize: string;
    description: string;
    descriptionFontSize: string;
    color: string;
    position: { x: number; y: number };
  }>({
    title: "",
    description: "",
    position: { x: 50, y: 50 },
    titleFontSize: "30px",
    descriptionFontSize: "14px",
    color: "#000000",
  });

  const [image, setImage] = useState<{
    image: string;
    width: number;
    position: { x: number; y: number };
    zIndex: number;
  }>({ image: "", width: 200, position: { x: 50, y: 50 }, zIndex: 0 });

  const [foreground, setForeground] = useState<
    {
      id: number;
      image: string;
      width: number;
      position: { x: number; y: number };
    }[]
  >([]);
  const [foregroundList, setForegroundList] = useState<number[]>([]);
  const [foregroundCounter, setForgroundCounter] = useState<number>(0);

  const [editorHeight, setEditorHeight] = useState<string>("500px");
  const [editorWidth, setEditorWidth] = useState<string>("357px");
  const [customHW, setCustomHW] = useState<boolean>(false);

  // FORGEROUND PROPS
  const addForegroundHandler = () => {
    setForegroundList((prev) => [...prev, foregroundCounter]);
    setForgroundCounter((prev) => prev + 1);
  };

  const foregroundImgHandler = (info: UploadChangeParam, id: number) => {
    if (info.fileList.length === 0) return;
    const file = (info.file.originFileObj as RcFile) || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForeground((prev) => [
          ...prev,
          {
            id: id,
            image: reader.result as string,
            width: 100,
            position: { x: 50, y: 50 },
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteForegroundImg = (idx: number) => {
    setForeground((prev) => prev.filter((item) => item.id !== idx));
    setForegroundList((prev) => prev.filter((item) => item !== idx));
  };

  // ADD IMAGE, BACKGROUND, TITLE, DESCRIPTION
  const addImageHandler = (info: UploadChangeParam) => {
    if (info.fileList.length === 0) return;
    const file = (info.file.originFileObj as RcFile) || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage((prev) =>
          prev ? { ...prev, image: reader.result as string } : prev
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage((prev) => ({ ...prev, image: "" }));
  };

  const addBackgroundHandler = (info: UploadChangeParam) => {
    if (info.fileList.length === 0) return;
    const file = (info.file.originFileObj as RcFile) || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundRemove = () => {
    setBackground("");
  };

  const addTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText((prev) => (prev ? { ...prev, title: e.target?.value } : prev));
  };

  const addDescriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText((prev) =>
      prev ? { ...prev, description: e.target?.value } : prev
    );
  };

  // UPDATE POSITION WHILE DRAGGING
  const handleStop = (id: number, e: DraggableEvent, data: DraggableData) => {
    setForeground((prevForeground) =>
      prevForeground.map((fg) =>
        fg.id === id ? { ...fg, position: { x: data.x, y: data.y } } : fg
      )
    );
  };

  const handleImageStop = (e: DraggableEvent, data: DraggableData) => {
    setImage((prev) =>
      prev ? { ...prev, position: { x: data.x, y: data.y } } : prev
    );
  };

  const handleTextStop = (e: DraggableEvent, data: DraggableData) => {
    setText((prev) =>
      prev ? { ...prev, position: { x: data.x, y: data.y } } : prev
    );
  };

  // DOWNLOAD AS IMAGE
  const editorRef = useRef<HTMLDivElement>(null);
  const handleDownloadImage = async () => {
    if (editorRef.current === null) {
      return;
    }

    try {
      const canvas = await html2canvas(editorRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "poster-maker.png";
      link.click();
    } catch (error) {
      console.error("Could not convert to image", error);
    }
  };

  // COLOR PICKER
  const handleColorChange: ColorPickerProps["onChange"] = (color) => {
    setText((prev) => ({ ...prev, color: color.toHexString() }));
  };

  // SAVE AS TEMPLATE
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMsg = () => {
    messageApi.open({
      type: "success",
      content: "Template Saved Successfully!",
    });
  };
  const id = useAppSelector(getId);
  const handleTemplateSave = () => {
    const templateObj = {
      id: id,
      textSec: text,
      imageSec: image,
      foregroundSec: foreground,
      editorHeight,
      editorWidth,
    };
    dispatch(addTemplate(templateObj));
    showSuccessMsg();
  };
  const templates = useAppSelector(selectTemplates);
  console.log(templates);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        {/* FORM */}
        <div className={styles.editorForm}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
            style={{ maxWidth: 600 }}
          >
            <Segmented<string>
              options={["Vertical", "Horizontal", "Square", "Custom"]}
              onChange={(value) => {
                if (value === "Vertical") {
                  setEditorHeight("500px");
                  setEditorWidth("357px");
                  setCustomHW(false);
                }

                if (value === "Horizontal") {
                  setEditorHeight("357px");
                  setEditorWidth("500px");
                  setCustomHW(false);
                }

                if (value === "Square") {
                  setEditorHeight("500px");
                  setEditorWidth("500px");
                  setCustomHW(false);
                }

                if (value === "Custom") {
                  setCustomHW(true);
                }
              }}
            />

            {/* CUSTOM CANVAS SIZE */}
            {customHW && (
              <>
                <Form.Item label="Height">
                  <Input
                    onChange={(e) => setEditorHeight(`${e.target.value}px`)}
                  />
                </Form.Item>
                <Form.Item label="Width">
                  <Input
                    onChange={(e) => setEditorWidth(`${e.target.value}px`)}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item label="Title">
              <Input onChange={addTitleHandler} />
            </Form.Item>

            <Form.Item label="Title Font Size">
              <Input
                type="number"
                defaultValue={30}
                onChange={(e) =>
                  setText((prev) => ({
                    ...prev,
                    titleFontSize: `${e.target.value}px`,
                  }))
                }
              />
            </Form.Item>

            <Form.Item label="Description">
              <TextArea rows={4} onChange={addDescriptionHandler} />
            </Form.Item>

            <Form.Item label="Description Font Size">
              <Input
                type="number"
                defaultValue={14}
                onChange={(e) =>
                  setText((prev) => ({
                    ...prev,
                    descriptionFontSize: `${e.target.value}px`,
                  }))
                }
              />
            </Form.Item>

            <Form.Item label="Text Color">
              <ColorPicker
                defaultValue={"#000000"}
                onChange={handleColorChange}
              />
            </Form.Item>

            <Form.Item label="Background" valuePropName="file">
              <Upload
                listType="picture-card"
                maxCount={1}
                onChange={addBackgroundHandler}
                onRemove={handleBackgroundRemove}
                beforeUpload={() => false}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                }}
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Item
                label="Image"
                valuePropName="file"
                style={{ width: "100%" }}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: true,
                  }}
                  onChange={addImageHandler}
                  onRemove={handleImageRemove}
                  beforeUpload={() => false}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>

              <div>
                <Form.Item label="Width" style={{ width: "110%" }}>
                  <Input
                    defaultValue={image.width}
                    placeholder="Width"
                    onChange={(e) =>
                      setImage((prev) =>
                        prev
                          ? {
                              ...prev,
                              width: parseInt(e.target.value),
                            }
                          : prev
                      )
                    }
                  />
                </Form.Item>

                <Segmented<string>
                  options={["Send to Back", "Bring to Front"]}
                  onChange={(value) => {
                    console.log(value);
                    if (value === "Bring to Front")
                      setImage((prev) =>
                        prev ? { ...prev, zIndex: 1 } : prev
                      );
                    if (value === "Send to Back")
                      setImage((prev) =>
                        prev ? { ...prev, zIndex: 0 } : prev
                      );
                  }}
                />
              </div>
            </div>
          </Form>

          {foregroundList.map((item, i) => (
            <>
              <div key={i} className={styles.foregroundInputContainer}>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                  }}
                  onChange={(info) => foregroundImgHandler(info, item)}
                  beforeUpload={() => false}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
                <div>
                  <Input
                    placeholder="Width"
                    style={{ maxWidth: "150px", marginRight: "20px" }}
                    onChange={(e) => {
                      setForeground((prev) =>
                        prev.map((el) =>
                          el.id === item
                            ? { ...el, width: parseInt(e.target.value) }
                            : el
                        )
                      );
                    }}
                  />

                  <Button
                    onClick={() => deleteForegroundImg(item)}
                    type="primary"
                    danger
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          ))}
          <Button onClick={addForegroundHandler} type="primary" ghost>
            Add Props
          </Button>
        </div>

        {/* EDITOR */}
        <div className={styles.editorContainer}>
          <div
            ref={editorRef}
            className={styles.editor}
            id="editorContainer"
            style={{ height: editorHeight, width: editorWidth }}
          >
            <DragFG
              position={image.position}
              bounds="#editorContainer"
              image={image.image}
              width={image.width}
              zIndex={image.zIndex}
              onStop={(e, data) => handleImageStop(e, data)}
            />
            {foreground.map((item, i) => (
              <DragFG
                key={i}
                position={item.position}
                bounds="#editorContainer"
                image={item.image}
                width={item.width}
                onStop={(e, data) => handleStop(item.id, e, data)}
              />
            ))}
            {background !== "" && (
              <img src={background} className={styles.backgroundImg} />
            )}
            <DragText
              position={text.position}
              bounds="#editorContainer"
              title={text.title}
              description={text.description}
              titleFontSize={text.titleFontSize}
              descriptionFontSize={text.descriptionFontSize}
              color={text.color}
              onStop={(e, data) => handleTextStop(e, data)}
            />
          </div>
          <Button
            type="primary"
            onClick={handleDownloadImage}
            style={{ margin: "10px 0" }}
          >
            Download as Image
          </Button>
          <Button
            type="primary"
            onClick={handleTemplateSave}
            style={{ margin: "10px 0" }}
          >
            Save as Template
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
