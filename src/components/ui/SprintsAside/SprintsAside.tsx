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

const SprintsAside = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSprint, setSelectedSprint] = useState<ISprint | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

  const openModal = (sprint: ISprint | null = null, edit: boolean = false) => {
    setSelectedSprint(sprint);
    setIsEditMode(edit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSprint(null);
    setIsEditMode(false);
  };

  const refreshSprints = async () => {
    const sprintsData = await getSprintsController();
    if (sprintsData) {
      setSprints(sprintsData);
    }
  };

  const handleDeleteSprint = async (id: string) => {
    await deleteSprintController(id);
    const updatedSprints = sprints.filter((sprint) => sprint.id !== id);
    setSprints(updatedSprints);
  };

  const handleViewSprint = (sprint: ISprint) => {
    openModal(sprint, false);
  };

  const handleEditSprint = (sprint: ISprint) => {
    openModal(sprint, true);
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
                onView={handleViewSprint}
                onEdit={handleEditSprint}
              />
            ))}
          </div>
        </div>
      </div>

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
