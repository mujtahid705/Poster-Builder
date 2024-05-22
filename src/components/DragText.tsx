import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./DragFG.module.css";

interface DraggableItemProps {
  position?: { x: number; y: number };
  bounds?: string;
  title: string;
  description: string;
  onStop?: DraggableEventHandler;
}

const DragText: React.FC<DraggableItemProps> = ({
  position,
  bounds,
  title,
  description,
  onStop,
}) => {
  return (
    <>
      <Draggable position={position} bounds={bounds} onStop={onStop}>
        {/* <img
          src={image}
          className={styles.dragImg}
          style={{ width: `${width}px`, zIndex: zIndex }}
        /> */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </Draggable>
    </>
  );
};

export default DragText;
