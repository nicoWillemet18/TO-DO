import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos de react-icons
import Swal from "sweetalert2"; // Importar SweetAlert2
import styles from "./SprintCard.module.css";

// Tipos de props
type IPropsSprintCard = {
  sprint: ISprint;
  onCardClick?: () => void;
  onDelete?: (id: string) => void; // Nueva prop para manejar la eliminación
  onView?: (sprint: ISprint) => void; // Nueva prop para manejar la visualización
};

const SprintCard: FC<IPropsSprintCard> = ({ sprint, onCardClick, onDelete, onView }) => {

  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el sprint ${sprint.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (onDelete) {
        onDelete(sprint.id);
      }
    }
  };

  return (
    <div className={styles.sprintCard}>
      <div className={styles.sprintCardHeader} onClick={onCardClick}>{sprint.nombre}</div>
      <div className={styles.sprintCardInfo}>
        <div>Inicio: {new Date(sprint.inicio).toISOString().split("T")[0]}</div>
        <div>Cierre: {new Date(sprint.fin).toISOString().split("T")[0]}</div>
      </div>
      <div className={styles.sprintCardButtons}>
        <button onClick={() => onView && onView(sprint)}>
          <FaEye size={29} color="C8B810" />
        </button>
        <button>
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
