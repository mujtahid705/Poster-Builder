import styles from "./EditorPage.module.css";
// import background from "../assets/poster_bg.png";
import fg1 from "../assets/fg1.png";
import fg2 from "../assets/fg2.png";
import DragFG from "../components/DragFG";
import { useRef, useState } from "react";

// const __Template = {
//     title: "",
//     description: "",
//     background: "",
//     image: "",
//     fg_s: ["", ""]
// }

const EditorPage: React.FC = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [background, setBackground] = useState<string>("");

  const [foreground, setForeground] = useState<{ id: number; image: string }[]>(
    []
  );
  const [foregroundList, setForegroundList] = useState<number[]>([]);
  const [foregroundCounter, setForgroundCounter] = useState<number>(0);

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
          { id: id, image: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteForegroundImg = (idx: number) => {
    setForeground((prev) => prev.filter((item) => item.id !== idx));
    setForegroundList((prev) => prev.filter((item) => item !== idx));
  };

  const applyHandler = () => {
    if (titleRef.current) setTitle(titleRef.current?.value);
    if (descriptionRef.current) setDescription(descriptionRef.current?.value);

    if (backgroundRef.current?.files) {
      const file = backgroundRef.current.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setBackground(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  //   const title = "TAKE YOUR SKILL TO THE NEXT LEVEL";
  //   const description =
  // "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum eleifend ex, hendrerit volutpat purus facilisis a.";
  return (
    <>
      <div className={styles.container}>
        <div className={styles.editorForm}>
          <input ref={titleRef} type="text" placeholder="Title" />
          <input ref={descriptionRef} type="text" placeholder="Description" />
          <input ref={backgroundRef} type="file" accept="img/" />

          <button onClick={addForegroundHandler}>Add FG</button>
          {foregroundList.map((item) => (
            <>
              <input
                key={item}
                type="file"
                accept="img/"
                onChange={(e) => foregroundImgHandler(e, item)}
              />
              <button onClick={() => deleteForegroundImg(item)}>Delete</button>
            </>
          ))}

          <button onClick={applyHandler}>Apply</button>
        </div>

        <div className={styles.editorContainer} id="editorContainer">
          {/* <DragFG
            defaultPosition={{ x: 50, y: 50 }}
            bounds="#editorContainer"
            image={fg1}
          /> */}
          {foreground.map((item, i) => (
            <DragFG
              key={i}
              defaultPosition={{ x: 50, y: 50 }}
              bounds="#editorContainer"
              image={item.image}
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
