import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./DragFG.module.css";

interface DraggableItemProps {
  position?: { x: number; y: number };
  bounds?: string;
  title: string;
  titleFontSize: string;
  description: string;
  descriptionFontSize: string;
  color: string;
  onStop?: DraggableEventHandler;
}

const DragText: React.FC<DraggableItemProps> = ({
  position,
  bounds,
  title,
  description,
  titleFontSize,
  descriptionFontSize,
  color,
  onStop,
}) => {
  return (
    <>
      <Draggable position={position} bounds={bounds} onStop={onStop}>
        <div className={styles.textContainer} style={{ color: color }}>
          <h2 className={styles.title} style={{ fontSize: titleFontSize }}>
            {title}
          </h2>
          <p
            className={styles.description}
            style={{ fontSize: descriptionFontSize }}
          >
            {description}
          </p>
        </div>
      </Draggable>
    </>
  );
};

export default DragText;
