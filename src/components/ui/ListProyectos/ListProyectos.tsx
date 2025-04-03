import { FC, useState } from "react";
import styles from "./ListProyectos.module.css";
import { IProyecto } from "../../../types/Iinterfaces";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BsDropbox } from "react-icons/bs"; // Importa el icono de Dropbox
import Modal from "react-modal"; // Asegúrate de instalar react-modal con npm install react-modal

// Configurar react-modal para accesibilidad
Modal.setAppElement("#root");

type IPropsIProyecto = {
  proyecto: IProyecto;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

const ListProyectos: FC<IPropsIProyecto> = ({ proyecto, onEdit, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={styles.proyecto}>
      <div className={styles.cont}>
        <div className={styles.containerRow}>
          <span className={styles.titulo} data-tooltip={proyecto.nombre}>
          Nombre: {proyecto.nombre}
          </span>

          <span className={styles.fecha} data-tooltip={`Fecha de Inicio: ${new Date(proyecto.fechaInicio).toISOString().split("T")[0]}`}>
            Fecha de Inicio: {new Date(proyecto.fechaInicio).toISOString().split("T")[0]}
          </span>

          <button className={styles.enviar} style={{ maxWidth: "200px" }}>
            Enviar a <BsDropbox className={styles.icon} />
          </button>

          <span className={styles.descripcion} data-tooltip={proyecto.descripcion}>
            Descripción: {proyecto.descripcion}
          </span>

          <span className={styles.fecha} data-tooltip={`Fecha de Fin: ${new Date(proyecto.fechaFin).toISOString().split("T")[0]}`}>
            Fecha de Fin: {new Date(proyecto.fechaFin).toISOString().split("T")[0]}
          </span>

          <div className={styles.selectContainer}>
            <select className={styles.select}>
              <option>Seleccione un Sprint</option>
            </select>
          </div>
        </div>
        <div className={styles.acciones}>
          <button onClick={() => setModalIsOpen(true)}>
            <FaEye size={27} color="C8B810" />
          </button>

          <button onClick={onEdit}>
            <FaEdit size={25} color="0D7DD8" />
          </button>

          <button onClick={() => onDelete(proyecto.id)}>
            <FaTrash size={25} color="A90505"  />
          </button>
        </div>
      </div>
      {/* Modal para ver el proyecto */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Detalles del Proyecto"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{proyecto.nombre}</h2>
          <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
          <p><strong>Fecha de Inicio:</strong> {new Date(proyecto.fechaInicio).toISOString().split("T")[0]}</p>
          <p><strong>Fecha de Fin:</strong> {new Date(proyecto.fechaFin).toISOString().split("T")[0]}</p>
          <h3 className={styles.modalSubTitle}>Miembros:</h3>
          <ul className={styles.modalList}>
            {proyecto.miembros.map((miembro) => (
              <li key={miembro.id} className={styles.modalListItem}>
                {miembro.nombre} - {miembro.rol}
              </li>
            ))}
          </ul>
          <button className={styles.modalCloseButton} onClick={() => setModalIsOpen(false)}>
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListProyectos;




