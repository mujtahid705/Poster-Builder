import styles from "./EditorPage.module.css";
import background from "../assets/poster_bg.png";
import fg1 from "../assets/fg1.png";
import fg2 from "../assets/fg2.png";
import DragFG from "../components/DragFG";

const EditorPage: React.FC = () => {
  const title = "TAKE YOUR SKILL TO THE NEXT LEVEL";
  return (
    <>
      <div className={styles.container}>
        <div className={styles.editorContainer} id="editorContainer">
          <DragFG
            defaultPosition={{ x: 50, y: 50 }}
            bounds="#editorContainer"
            image={fg1}
          />
          <img src={background} className={styles.backgroundImg} />
          <img src={fg1} className={styles.fg1} />
          <img src={fg2} className={styles.fg2} />
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              elementum eleifend ex, hendrerit volutpat purus facilisis a.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
