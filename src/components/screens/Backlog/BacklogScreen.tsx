import { useEffect, useState } from "react";
import { deleteTareaController, getTareasController } from "../../../data/tareaController"; // Usando las funciones actualizadas
import ListTareas from "../../ui/ListTareas/ListTareas";
import Modal from "../../ui/Modal/Modal"; 
import styles from "./BacklogScreen.module.css";
import Swal from "sweetalert2";

import { ITareaBacklog } from "../../../types/ITareaBacklog"; 

const Backlog = () => {
  const [tareas, setTareas] = useState<ITareaBacklog[]>([]);
  const [showModal, setShowModal] = useState(false); 
  const [tareaSeleccionada, setTareaSeleccionada] = useState<ITareaBacklog | undefined>(undefined); 

  useEffect(() => {
    const fetchTareas = async () => {
      const proyectosData = await getTareasController(); // Cambié de getProyectosController a getTareasController
      if (proyectosData) {
        setTareas(proyectosData);
      }
    };

    fetchTareas();
  }, []);

  const openModalCrear = () => {
    setTareaSeleccionada(undefined);
    setShowModal(true);
  };

  const openModalEditar = (proyecto: ITareaBacklog) => {
    setTareaSeleccionada(proyecto);
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
      await deleteTareaController(id);
      Swal.fire("Eliminado", "El proyecto ha sido eliminado.", "success");
      refreshTareas(); // Refrescar la lista después de eliminar
    }
  };

  const refreshTareas = async () => {
    const proyectosData = await getTareasController(); 
    setTareas(proyectosData || []);
  };

  return (
    <div className={styles.containerBacklog}>
      <div>
        <div className={styles.headerBacklog}>
          <h2 className={styles.title}>Backlog</h2>
          <button className={styles.buttonTask} onClick={openModalCrear}>
            Crear nueva tarea <i className="bi bi-list-task"></i>
          </button>
        </div>
      </div>
      <div className={styles.containerTareas}>
        {showModal && (
          <Modal
            closeModal={closeModal}
            refreshTareas={refreshTareas}
            tarea={tareaSeleccionada}
            esBacklog={true}
          />
        )}

        {tareas.map((tarea) => (
          <ListTareas
            key={tarea.id}
            proyecto={tarea}
            onEdit={() => openModalEditar(tarea)}
            onDelete={handleDelete} 
            setTareas={setTareas}
          />
        ))}
      </div>
    </div>
  );
};

export default Backlog;
