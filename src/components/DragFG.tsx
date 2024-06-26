import Draggable, { DraggableEventHandler } from "react-draggable";
import styles from "./DragFG.module.css";

interface DraggableItemProps {
  position?: { x: number; y: number };
  bounds?: string;
  image: string;
  width?: number;
  zIndex?: number;
  onStop?: DraggableEventHandler;
}

const DragFG: React.FC<DraggableItemProps> = ({
  position,
  bounds,
  image,
  width,
  zIndex,
  onStop,
}) => {
  return (
    <>
      <Draggable position={position} bounds={bounds} onStop={onStop}>
        <img
          src={image}
          className={styles.dragImg}
          style={{ width: `${width}px`, zIndex: zIndex }}
        />
      </Draggable>
    </>
  );
};

export default DragFG;
