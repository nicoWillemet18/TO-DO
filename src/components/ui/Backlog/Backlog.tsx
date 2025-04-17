import { useEffect, useState } from "react";
import { deleteTareaController, getTareasController } from "../../../data/proyectoController"; // Usando las funciones actualizadas
import ListProyectos from "../ListTareas/ListTareas";
import Modal from "../modal/Modal"; 
import styles from "./Backlog.module.css";
import Swal from "sweetalert2";

import { IProyecto } from "../../../types/Iinterfaces"; 

const Backlog = () => {
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [showModal, setShowModal] = useState(false); 
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<IProyecto | undefined>(undefined); 

  useEffect(() => {
    const fetchProyectos = async () => {
      const proyectosData = await getTareasController(); // Cambié de getProyectosController a getTareasController
      if (proyectosData) {
        setProyectos(proyectosData);
      }
    };

    fetchProyectos();
  }, []);

  const openModalCrear = () => {
    setProyectoSeleccionado(undefined);
    setShowModal(true);
  };

  const openModalEditar = (proyecto: IProyecto) => {
    setProyectoSeleccionado(proyecto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      await deleteTareaController(id); // Cambié de deleteProyectoController a deleteTareaController
      Swal.fire("Eliminado", "El proyecto ha sido eliminado.", "success");
      refreshProyectos(); // Refrescar la lista después de eliminar
    }
  };

  const refreshProyectos = async () => {
    const proyectosData = await getTareasController(); // Cambié de getProyectosController a getTareasController
    setProyectos(proyectosData || []);
  };

  return (
    <div className={styles.containerBacklog}>
      <div className={styles.headerBacklog}>
        <h2 className={styles.title}>Backlog</h2>
        <button className={styles.buttonTask} onClick={openModalCrear}>
          Crear nueva tarea <i className="bi bi-list-task"></i>
        </button>
      </div>

      {showModal && (
        <Modal
          closeModal={closeModal}
          refreshProyectos={refreshProyectos}
          proyecto={proyectoSeleccionado}
        />
      )}

      {proyectos.map((proyecto) => (
        <ListProyectos
          key={proyecto.id}
          proyecto={proyecto}
          onEdit={() => openModalEditar(proyecto)}
          onDelete={handleDelete} 
        />
      ))}
    </div>
  );
};

export default Backlog;
