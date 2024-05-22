import Draggable, {
  DraggableEvent,
  DraggableEventHandler,
} from "react-draggable";
import styles from "./DragFG.module.css";

interface DraggableItemProps {
  defaultPosition?: { x: number; y: number };
  bounds?: string;
  image: string;
  width?: number;
  zIndex?: number;
  onStop?: DraggableEventHandler;
}

const DragFG: React.FC<DraggableItemProps> = ({
  defaultPosition,
  bounds,
  image,
  width,
  zIndex,
  onStop,
}) => {
  return (
    <>
      <Draggable
        defaultPosition={defaultPosition}
        bounds={bounds}
        onStop={onStop}
      >
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
