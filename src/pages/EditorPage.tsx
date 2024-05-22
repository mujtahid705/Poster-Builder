import styles from "./EditorPage.module.css";
// import background from "../assets/poster_bg.png";
// import fg1 from "../assets/fg1.png";
// import fg2 from "../assets/fg2.png";
import DragFG from "../components/DragFG";
import { DraggableData, DraggableEvent } from "react-draggable";
import { useState } from "react";

const EditorPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [background, setBackground] = useState<string>("");

  const [image, setImage] = useState<string>("");
  const [imageWidth, setImageWidth] = useState<number>(200);
  const [imageZIdx, setImageZIdx] = useState<number>(0);

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
        setImage(reader.result as string);
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
    setTitle(e.target?.value);
  };

  const addDescriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target?.value);
  };

  const handleStop = (id: number, e: DraggableEvent, data: DraggableData) => {
    setForeground((prevForeground) =>
      prevForeground.map((fg) =>
        fg.id === id ? { ...fg, position: { x: data.x, y: data.y } } : fg
      )
    );
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
            onChange={(e) => setImageWidth(parseInt(e.target.value))}
          />
          {image && imageZIdx === 0 && (
            <button onClick={() => setImageZIdx(1)}>Bring to Front</button>
          )}
          {imageZIdx === 1 && (
            <button onClick={() => setImageZIdx(0)}>Bring to Back</button>
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

        <div className={styles.editorContainer} id="editorContainer">
          <DragFG
            defaultPosition={{ x: 50, y: 50 }}
            bounds="#editorContainer"
            image={image}
            width={imageWidth}
            zIndex={imageZIdx}
          />
          {foreground.map((item, i) => (
            <DragFG
              key={i}
              defaultPosition={item.position}
              bounds="#editorContainer"
              image={item.image}
              width={item.width}
              onStop={(e, data) => handleStop(item.id, e, data)}
            />
          ))}
          <img src={background} className={styles.backgroundImg} />
          {/* <img src={fg1} className={styles.fg1} /> */}
          {/* <img src={fg2} className={styles.fg2} /> */}
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
