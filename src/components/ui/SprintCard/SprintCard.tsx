import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos de react-icons

import styles from "./SprintCard.module.css";

type IPropsSprintCard = {
  sprint: ISprint;
};

const SprintCard: FC<IPropsSprintCard> = (sprint) => {
  return (
    <div className={styles.sprintCard}>
      <div className={styles.sprintCardHeader}>{sprint.sprint.nombre}</div>
      <div className={styles.sprintCardInfo}>
        <div>Inicio: {new Date(sprint.sprint.inicio).toISOString().split("T")[0]}</div>
        <div>Cierre: {new Date(sprint.sprint.fin).toISOString().split("T")[0]}</div>
      </div>
      <div className={styles.sprintCardButtons}>
        <FaEye className={styles.icon} /> {/* Icono de "ver" */}
        <FaEdit className={styles.icon} /> {/* Icono de "editar" */}
        <FaTrash className={styles.icon} /> {/* Icono de "eliminar" */}
      </div>
    </div>
  );
};

export default SprintCard;