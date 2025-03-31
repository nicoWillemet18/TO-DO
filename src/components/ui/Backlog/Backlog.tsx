import { useEffect, useState } from "react";
import { getProyectosController } from "../../../data/proyectoController";
import ListProyectos from "../ListProyectos/ListProyectos";
import Modal from "../modal/modal"; // Importar el modal
import styles from "./Backlog.module.css";

import { IProyecto } from "../../../types/Iinterfaces"; // Asegúrate de que la ruta es correcta.

const Backlog = () => {
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [showModal, setShowModal] = useState(false); // Controlar la visibilidad del modal
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<IProyecto | undefined>(undefined); // Cambiar null por undefined

  useEffect(() => {
    const fetchProyectos = async () => {
      const proyectosData = await getProyectosController();
      if (proyectosData) {
        setProyectos(proyectosData);
      }
    };

    fetchProyectos();
  }, []);

  const openModalCrear = () => {
    setProyectoSeleccionado(undefined); // Usar undefined en lugar de null
    setShowModal(true);
  };

  const openModalEditar = (proyecto: IProyecto) => {
    setProyectoSeleccionado(proyecto); // Pasamos el proyecto para editar
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const refreshProyectos = async () => {
    const proyectosData = await getProyectosController();
    setProyectos(proyectosData || []);
  };

  return (
    <div className={styles.containerBacklog}>
      <div className={styles.headerBacklog}>
        <h2 className={styles.title}>Backlog</h2>
        <button className={styles.buttonTask} onClick={openModalCrear}>
          Crear nuevo proyecto <i className="bi bi-list-task"></i>
        </button>
      </div>

      {showModal && (
        <Modal
          closeModal={closeModal}
          refreshProyectos={refreshProyectos}
          proyecto={proyectoSeleccionado} // Ahora se pasa undefined cuando no estamos editando
        />
      )}

      {proyectos.map((proyecto) => (
        <ListProyectos
          key={proyecto.id}
          proyecto={proyecto}
          onEdit={() => openModalEditar(proyecto)} // Pasar la función onEdit al componente
        />
      ))}
    </div>
  );
};

export default Backlog;
