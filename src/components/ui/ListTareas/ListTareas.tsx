import { FC, useState, useEffect } from "react";
import styles from "./ListTareas.module.css";
import { IProyecto } from "../../../types/Iinterfaces";
import { ISprint } from "../../../types/ISprint";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BsDropbox } from "react-icons/bs";
import Modal from "react-modal";
import { getSprintsController } from "../../../data/sprintController";

Modal.setAppElement("#root");

type IPropsIProyecto = {
  proyecto: IProyecto;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const ListTareas: FC<IPropsIProyecto> = ({ proyecto, onEdit, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");

  useEffect(() => {
    const fetchSprints = async () => {
      const data = await getSprintsController();
      if (data) {
        const validSprints = data.filter((sprint) => sprint.id && sprint.nombre);
        setSprints(validSprints);
      }
    };

    fetchSprints();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprint(e.target.value);
  };

  return (
    <div className={styles.proyecto}>
      <div className={styles.cont}>
        <div className={styles.containerRow}>
          <span className={styles.titulo} data-tooltip={proyecto.nombre}>
            <strong>Nombre:</strong> {proyecto.nombre}
          </span>

          <span
            className={styles.fecha}
            data-tooltip={`Fecha de Inicio: ${formatearFecha(proyecto.fechaInicio)}`}
          >
            <strong>Fecha de inicio:</strong> {formatearFecha(proyecto.fechaInicio)}
          </span>

          <button
            className={styles.enviar}
            style={{ maxWidth: "200px" }}
            disabled={!selectedSprint}
          >
            Enviar a <BsDropbox className={styles.icon} />
          </button>

          <span
            className={styles.descripcion}
            data-tooltip={proyecto.descripcion}
          >
            <strong>Descripción:</strong> {proyecto.descripcion}
          </span>

          <span
            className={styles.fecha}
            data-tooltip={`Fecha de Fin: ${formatearFecha(proyecto.fechaFin)}`}
          >
            <strong>Fecha de fin:</strong> {formatearFecha(proyecto.fechaFin)}
          </span>

          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              value={selectedSprint}
              onChange={handleSelectChange}
            >
              <option value="">Seleccione un Sprint</option>
              {sprints.length > 0 ? (
                sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay sprints disponibles</option>
              )}
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
            <FaTrash size={25} color="A90505" />
          </button>
        </div>        
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Detalles del Proyecto"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>{proyecto.nombre}</h2>
          <p>
            <strong>Descripción:</strong> {proyecto.descripcion}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {formatearFecha(proyecto.fechaInicio)}
          </p>
          <p>
            <strong>Fecha de Fin:</strong> {formatearFecha(proyecto.fechaFin)}
          </p>
          <button
            className={styles.modalCloseButton}
            onClick={() => setModalIsOpen(false)}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListTareas;
