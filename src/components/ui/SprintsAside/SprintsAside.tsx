import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISprint } from "../../../types/ISprint";
import SprintCard from "../SprintCard/SprintCard";
import { getSprintsController, deleteSprintController } from "../../../data/sprintController";
import styles from "./SprintsAside.module.css";
import SprintModal from "../modalSprints/modalSprints";

const SprintsAside = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSprint, setSelectedSprint] = useState<ISprint | null>(null);

  useEffect(() => {
    const fetchSprints = async () => {
      const sprintsData = await getSprintsController();
      if (sprintsData) {
        setSprints(sprintsData);
      }
    };

    fetchSprints();
  }, []);

  const handleCardClick = (id: string) => {
    navigate(`/sprint/${id}`);
  };

  const handleBacklogClick = () => {
    navigate("/");
  };

  const openModal = (sprint: ISprint | null = null) => {
    setSelectedSprint(sprint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSprint(null);
  };

  const refreshSprints = async () => {
    const sprintsData = await getSprintsController();
    if (sprintsData) {
      setSprints(sprintsData);
    }
  };

  // Función para manejar la eliminación de un sprint
  const handleDeleteSprint = async (id: string) => {
    await deleteSprintController(id);
    const updatedSprints = sprints.filter((sprint) => sprint.id !== id);
    setSprints(updatedSprints);
  };

  // Función para manejar la visualización del sprint
  const handleViewSprint = (sprint: ISprint) => {
    openModal(sprint);
  };

  return (
    <div className={styles.containerAsideWrapper}>
      <div className={styles.fullHeightBox}>
        <button className={styles.buttonBacklog} onClick={handleBacklogClick}>
          Backlog <i className="bi bi-book"></i>
        </button>

        <div className={styles.containerAside}>
          <div className={styles.containerTitleButton}>
            <h3 className={styles.title}>
              Lista de sprints
              <i
                className="bi bi-plus-square"
                style={{ cursor: "pointer" }}
                onClick={() => openModal()}
              ></i>
            </h3>
          </div>

          <div className={styles.line}></div>

          <div className={styles.sprintCardContainer}>
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onCardClick={() => handleCardClick(sprint.id)}
                onDelete={handleDeleteSprint}
                onView={handleViewSprint} // Pasamos la función para ver el sprint
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mostrar el modal para ver o crear un sprint */}
      {isModalOpen && (
        <SprintModal
          closeModal={closeModal}
          refreshSprints={refreshSprints}
          sprint={selectedSprint} // Pasamos el sprint seleccionado o null para crear uno nuevo
        />
      )}
    </div>
  );
};

export default SprintsAside;
