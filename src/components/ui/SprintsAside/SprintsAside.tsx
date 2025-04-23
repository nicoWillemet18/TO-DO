import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISprint } from "../../../types/ISprint";
import SprintCard from "../SprintCard/SprintCard";
import {
  getSprintsController,
  deleteSprintController,
} from "../../../data/sprintController";
import styles from "./SprintsAside.module.css";
import SprintModal from "../modalSprints/modalSprints";
import Swal from "sweetalert2";

const SprintsAside = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<ISprint[]>([]); // Estado que almacena los sprints
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para manejar la apertura/cierre del modal
  const [selectedSprint, setSelectedSprint] = useState<ISprint | null>(null); // Estado para el sprint seleccionado
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Estado que define si el modal está en modo edición

  // Efecto que obtiene los sprints al cargar el componente
  useEffect(() => {
    const fetchSprints = async () => {
      const sprintsData = await getSprintsController(); // Llamada para obtener los sprints
      if (sprintsData) {
        setSprints(sprintsData); // Actualiza el estado con los sprints obtenidos
      }
    };
    fetchSprints();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Maneja el clic en la tarjeta de un sprint para navegar a su vista detallada
  const handleCardClick = (id: string) => {
    navigate(`/sprint/${id}`);
  };

  // Navega al Backlog cuando se hace clic en el botón correspondiente
  const handleBacklogClick = () => {
    navigate("/");
  };

  // Abre el modal para crear o editar un sprint
  const openModal = (sprint: ISprint | null = null, edit: boolean = false) => {
    setSelectedSprint(sprint); // Establece el sprint seleccionado
    setIsEditMode(edit); // Define si el modal está en modo edición
    setIsModalOpen(true); // Abre el modal
  };

  // Cierra el modal y restablece el estado
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSprint(null); // Restablece el sprint seleccionado
    setIsEditMode(false); // Restablece el modo de edición
  };

  // Refresca la lista de sprints obteniendo nuevamente los datos
  const refreshSprints = async () => {
    const sprintsData = await getSprintsController();
    if (sprintsData) {
      setSprints(sprintsData); // Actualiza el estado con los sprints actualizados
    }
  };

  // Elimina un sprint, actualizando la lista de sprints
  const handleDeleteSprint = async (id: string) => {
    await deleteSprintController(id); // Llama al controlador para eliminar el sprint
    const updatedSprints = sprints.filter((sprint) => sprint.id !== id); // Filtra el sprint eliminado
    setSprints(updatedSprints); // Actualiza el estado con los sprints restantes
    
    Swal.fire("Eliminado", "El sprint ha sido eliminado.", "success"); // Notificación de éxito

  };

  // Abre el modal en modo solo visualización para ver los detalles del sprint
  const handleViewSprint = (sprint: ISprint) => {
    openModal(sprint, false); // Abre el modal en modo visualización
  };

  // Abre el modal en modo edición para editar un sprint
  const handleEditSprint = (sprint: ISprint) => {
    openModal(sprint, true); // Abre el modal en modo edición
  };

  return (
    <div className={styles.containerAsideWrapper}>
      <div className={styles.fullHeightBox}>
        {/* Botón para navegar al Backlog */}
        <button className={styles.buttonBacklog} onClick={handleBacklogClick}>
          Backlog <i className="bi bi-book"></i>
        </button>

        <div className={styles.containerAside}>
          <div className={styles.containerTitleButton}>
            <h3 className={styles.title}>
              Lista de sprints
              {/* Ícono para abrir el modal para crear un nuevo sprint */}
              <i
                className="bi bi-plus-square"
                style={{ cursor: "pointer" }}
                onClick={() => openModal()}
              ></i>
            </h3>
          </div>

          <div className={styles.line}></div>

          {/* Muestra la lista de tarjetas de sprint */}
          <div className={styles.sprintCardContainer}>
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onCardClick={() => handleCardClick(sprint.id)}
                onDelete={handleDeleteSprint}
                onView={handleViewSprint}
                onEdit={handleEditSprint}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal para crear o editar un sprint, visible solo si isModalOpen es true */}
      {isModalOpen && (
        <SprintModal
          closeModal={closeModal}
          refreshSprints={refreshSprints}
          sprint={selectedSprint}
          editMode={isEditMode}
        />
      )}
    </div>
  );
};

export default SprintsAside;
