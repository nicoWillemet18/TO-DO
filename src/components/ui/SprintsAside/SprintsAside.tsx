import { useNavigate } from "react-router-dom"; 
import { ISprint } from "../../../types/ISprint";
import SprintCard from "../SprintCard/SprintCard";
import styles from "./SprintsAside.module.css";


  
const SprintsAside = () => {
  const navigate = useNavigate(); // 👈 Hook para navegar

  const sprint: ISprint = {
    id: 2,
    nombre: "Sprint 2",
    inicio: "2025-03-04",
    fin: "2025-03-11",
    tareas: [
      {
        id: 1,
        titulo: "Diseñar login",
        descripcion: "Crear la pantalla de login",
        estado: "pendiente",
        fechaLimite:"2025-04-20",
      },
      {
        id: 2,
        titulo: "Implementar API",
        descripcion: "Conectar con la API de usuarios",
        estado: "en-progreso",
        fechaLimite: "2025-04-29",
      }
    ]
    
  };

  const handleCardClick = () => {
    navigate(`/sprint/${sprint.id}`);
  };

  return (
    <div className={styles.containerAsideWrapper}>
      <div className={styles.fullHeightBox}>
        <button className={styles.buttonBacklog}>
          Backlog <i className="bi bi-book"></i> {/* Icono de libro */}
        </button>

        <div className={styles.containerAside}>
          <div className={styles.containerTitleButton}>
            <h3 className={styles.title}>
              Lista de sprints <i className="bi bi-list-ul"></i> {/* Icono de lista */}
            </h3>
          </div>

          <div className={styles.line}></div>

          <div className={styles.sprintCardContainer}>
            <SprintCard sprint={sprint} onCardClick={handleCardClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintsAside;