import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "./SprintCard.module.css";

type IPropsSprintCard = {
  sprint: ISprint;
  onCardClick?: () => void;
  onDelete?: (id: string) => void;
  onView?: (sprint: ISprint) => void;
  onEdit?: (sprint: ISprint) => void;
};

const SprintCard: FC<IPropsSprintCard> = ({
  sprint,
  onCardClick,
  onDelete,
  onView,
  onEdit,
}) => {
  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el sprint ${sprint.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed && onDelete) {
      onDelete(sprint.id);
    }
  };

  return (
    <div className={styles.sprintCard}>
      <div className={styles.sprintCardHeader} onClick={onCardClick}>
        {sprint.nombre}
      </div>
      <div className={styles.sprintCardInfo}>
        <div>Inicio: {
          new Date(sprint.inicio).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }</div>
        <div>Cierre: {
          new Date(sprint.fin).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }</div>
      </div>
      <div className={styles.sprintCardButtons}>
        <button onClick={() => onView && onView(sprint)}>
          <FaEye size={29} color="C8B810" />
        </button>
        <button onClick={() => onEdit && onEdit(sprint)}>
          <FaEdit size={25} color="0D7DD8" />
        </button>
        <button onClick={handleDeleteClick}>
          <FaTrash size={25} color="A90505" />
        </button>
      </div>
    </div>
  );
};

export default SprintCard;
