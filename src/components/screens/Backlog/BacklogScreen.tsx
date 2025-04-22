import { useEffect, useState } from "react";
import { deleteTareaController, getTareasController } from "../../../data/tareaController"; 
import ListTareas from "../../ui/ListTareas/ListTareas";
import Modal from "../../ui/Modal/Modal"; 
import styles from "./BacklogScreen.module.css";
import Swal from "sweetalert2";

import { ITareaBacklog } from "../../../types/ITareaBacklog"; 

const Backlog = () => {
  const [tareas, setTareas] = useState<ITareaBacklog[]>([]);
  const [showModal, setShowModal] = useState(false); 
  const [tareaSeleccionada, setTareaSeleccionada] = useState<ITareaBacklog | undefined>(undefined); 

  // Al montar el componente, traigo todas las tareas del backlog
  useEffect(() => {
    const fetchTareas = async () => {
      const proyectosData = await getTareasController(); 
      if (proyectosData) {
        setTareas(proyectosData);
      }
    };

    fetchTareas();
  }, []);

  // Abre el modal para crear una nueva tarea
  const openModalCrear = () => {
    setTareaSeleccionada(undefined);
    setShowModal(true);
  };

  // Abre el modal con una tarea ya seleccionada para editar
  const openModalEditar = (proyecto: ITareaBacklog) => {
    setTareaSeleccionada(proyecto);
    setShowModal(true);
  };

  // Cierra el modal sin guardar cambios
  const closeModal = () => {
    setShowModal(false);
  };

  // Maneja la eliminación de una tarea con confirmación
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
      refreshTareas();
    }
  };

  // Refresca la lista de tareas desde la API
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
