import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "./SprintCard.module.css";

type IPropsSprintCard = {
  sprint: ISprint; // Objeto sprint que se pasará al componente
  onCardClick?: () => void; // Función opcional para manejar el clic en la tarjeta
  onDelete?: (id: string) => void; // Función opcional para eliminar el sprint
  onView?: (sprint: ISprint) => void; // Función opcional para ver los detalles del sprint
  onEdit?: (sprint: ISprint) => void; // Función opcional para editar el sprint
};

// Componente que muestra una tarjeta con la información del sprint
const SprintCard: FC<IPropsSprintCard> = ({
  sprint,
  onCardClick,
  onDelete,
  onView,
  onEdit,
}) => {
  // Maneja el clic en el botón de eliminar, mostrando una confirmación
  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el sprint ${sprint.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    // Si el usuario confirma, llama a la función onDelete
    if (result.isConfirmed && onDelete) {
      onDelete(sprint.id);
    }
  };

  return (
    <div className={styles.sprintCard}>
      {/* Encabezado de la tarjeta, que muestra el nombre del sprint */}
      <div className={styles.sprintCardHeader} onClick={onCardClick}>
        {sprint.nombre}
      </div>

      {/* Información del sprint: fecha de inicio y cierre */}
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

      {/* Botones para ver, editar y eliminar el sprint */}
      <div className={styles.sprintCardButtons}>
        {/* Botón para ver los detalles del sprint */}
        <button onClick={() => onView && onView(sprint)}>
          <FaEye size={29} color="C8B810" />
        </button>

        {/* Botón para editar el sprint */}
        <button onClick={() => onEdit && onEdit(sprint)}>
          <FaEdit size={25} color="0D7DD8" />
        </button>

        {/* Botón para eliminar el sprint */}
        <button onClick={handleDeleteClick}>
          <FaTrash size={25} color="A90505" />
        </button>
      </div>
    </div>
  );
};

export default SprintCard;
