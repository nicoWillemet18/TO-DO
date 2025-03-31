import { FC } from "react";
import styles from "./ListProyectos.module.css"; // Asegúrate de que la ruta sea correcta.
import { IProyecto } from "../../../types/Iinterfaces";
import { FaEye, FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa"; // Usamos react-icons para los iconos

type IPropsIProyecto = {
  proyecto: IProyecto;
  onEdit: () => void; // Función para editar, que se pasará desde el componente padre
};

const ListProyectos: FC<IPropsIProyecto> = ({ proyecto, onEdit }) => {
  return (
    <div className={styles.proyecto}>
      <div className={styles.containerRow}>
        <span className={styles.titulo}>Nombre: {proyecto.nombre}</span>
        <span className={styles.descripcion}>Descripción: {proyecto.descripcion}</span>
        <span className={styles.fecha}>
          Fecha de Inicio: {new Date(proyecto.fechaInicio).toISOString().split("T")[0]}
        </span>
        <span className={styles.fecha}>
          Fecha de Fin: {new Date(proyecto.fechaFin).toISOString().split("T")[0]}
        </span>

        <button className={styles.enviar}>
          Enviar a <FaPaperPlane className={styles.icon} /> {/* Icono de "send" */}
        </button>

        <div className={styles.selectContainer}>
          <select className={styles.select}>
            <option>Seleccione un Sprint</option>
          </select>
        </div>

        <div className={styles.acciones}>
          {/* Icono de ver */}
          <button>
            <FaEye size={16} /> {/* Icono de ojo */}
          </button>

          {/* Icono de editar (ahora es opcional, porque la acción de editar se maneja al hacer clic en el icono de ojo) */}
          <button onClick={onEdit}>
            <FaEdit size={16} /> {/* Icono de editar */}
          </button>

          {/* Icono de eliminar */}
          <button>
            <FaTrash size={16} /> {/* Icono de eliminar */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProyectos;



