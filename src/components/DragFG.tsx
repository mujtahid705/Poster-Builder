import Draggable from "react-draggable";
import styles from "./DragFG.module.css";

interface DraggableItemProps {
  defaultPosition?: { x: number; y: number };
  bounds?: string;
  image: string;
}

const DragFG: React.FC<DraggableItemProps> = ({
  defaultPosition,
  bounds,
  image,
}) => {
  return (
    <>
      <Draggable defaultPosition={defaultPosition} bounds={bounds}>
        <img src={image} className={styles.dragImg} />
      </Draggable>
    </>
  );
};

export default DragFG;
