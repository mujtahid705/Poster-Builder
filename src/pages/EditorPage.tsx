import styles from "./EditorPage.module.css";
// import background from "../assets/poster_bg.png";
// import fg1 from "../assets/fg1.png";
// import fg2 from "../assets/fg2.png";
import DragFG from "../components/DragFG";
import { DraggableData, DraggableEvent } from "react-draggable";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import DragText from "../components/DragText";

const EditorPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [background, setBackground] = useState<string>("");

  const [text, setText] = useState<{
    title: string;
    description: string;
    position: { x: number; y: number };
  }>({ title: "", description: "", position: { x: 50, y: 50 } });

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

  console.log(foreground);

  const addForegroundHandler = () => {
    setForegroundList((prev) => [...prev, foregroundCounter]);
    setForgroundCounter((prev) => prev + 1);
  };

  const foregroundImgHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = e.target.files?.[0];
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

  const addimageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setImage(reader.result as string);
        setImage((prev) =>
          prev ? { ...prev, image: reader.result as string } : prev
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addBackgroundHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText((prev) => (prev ? { ...prev, title: e.target?.value } : prev));
  };

  const addDescriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      link.download = "editor-image.png";
      link.click();
    } catch (error) {
      console.error("Could not convert to image", error);
    }
  };

  //   const title = "TAKE YOUR SKILL TO THE NEXT LEVEL";
  //   const description =
  // "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum eleifend ex, hendrerit volutpat purus facilisis a.";
  return (
    <>
      <div className={styles.container}>
        <div className={styles.editorForm}>
          <input type="text" placeholder="Title" onChange={addTitleHandler} />
          <input
            type="text"
            placeholder="Description"
            onChange={addDescriptionHandler}
          />
          <input type="file" accept="img/" onChange={addBackgroundHandler} />
          <input type="file" accept="img/" onChange={addimageHandler} />
          <input
            type="number"
            placeholder="Image Width"
            // onChange={(e) => setImageWidth(parseInt(e.target.value))}
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
          {image && image.zIndex === 0 && (
            <button
              onClick={() =>
                setImage((prev) => (prev ? { ...prev, zIndex: 1 } : prev))
              }
            >
              Bring to Front
            </button>
          )}
          {image && image.zIndex === 1 && (
            <button
              onClick={() =>
                setImage((prev) => (prev ? { ...prev, zIndex: 0 } : prev))
              }
            >
              Bring to Back
            </button>
          )}

          <button onClick={addForegroundHandler}>Add FG</button>
          {foregroundList.map((item) => (
            <>
              <div className={styles.foregroundInputContainer}>
                <input
                  key={item}
                  type="file"
                  accept="img/"
                  onChange={(e) => foregroundImgHandler(e, item)}
                />
                <input
                  type="number"
                  placeholder="FG Width"
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
                <button onClick={() => deleteForegroundImg(item)}>
                  Delete
                </button>
              </div>
            </>
          ))}
        </div>

        <div
          ref={editorRef}
          className={styles.editorContainer}
          id="editorContainer"
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
          <img src={background} className={styles.backgroundImg} />
          {/* <div className={styles.textContainer}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div> */}
          <DragText
            position={text.position}
            bounds="#editorContainer"
            title={text.title}
            description={text.description}
            onStop={(e, data) => handleTextStop(e, data)}
          />
        </div>
        <button onClick={handleDownloadImage}>Download as Image</button>
      </div>
    </>
  );
};

export default EditorPage;
