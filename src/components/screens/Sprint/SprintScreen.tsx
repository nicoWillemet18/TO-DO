import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ISprint } from "../../../types/ISprint";
import styles from "./SprintScreen.module.css";
import { moverTareaABacklogController } from "../../../data/sprintController";
import TareaModal from "../../ui/Modal/Modal";
import Swal from "sweetalert2"; // Importar SweetAlert2

const SprintScreen = () => {
  // Obtener el ID del sprint desde los parámetros de la URL
  const { id } = useParams<{ id: string }>();
  const [sprint, setSprint] = useState<ISprint | null>(null);
  const [allSprints, setAllSprints] = useState<ISprint[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Cargar los datos del sprint cuando el componente se monta o cuando cambia el ID
  useEffect(() => {
    fetchSprint();
  }, [id]);

  // Función para cargar los datos del sprint desde el backend
  const fetchSprint = async () => {
    try {
      const response = await axios.get<{ listSprints: ISprint[] }>("http://localhost:3000/sprints");
      const sprints = response.data.listSprints;
      const sprintEncontrado = sprints.find(s => s.id === id);

      setAllSprints(sprints);
      if (sprintEncontrado) setSprint(sprintEncontrado);
      else console.warn("⚠ Sprint no encontrado");
    } catch (error) {
      console.error("❌ Error cargando sprint:", error);
    }
  };

  // Función para actualizar el estado de una tarea dentro de un sprint
  const actualizarEstadoTarea = async (
    tareaId: string,
    nuevoEstado: "pendiente" | "en-progreso" | "completado" | "backlog"
  ) => {
    if (!sprint) return;

    const tarea = sprint.tareas.find(t => t.id === tareaId);
    if (!tarea) return;

    // Si el estado es "backlog", mover la tarea de vuelta al backlog
    if (nuevoEstado === "backlog") {
      // Mostrar alerta de confirmación antes de mover la tarea al backlog
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas mover esta tarea al backlog?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, mover al backlog",
        cancelButtonText: "Cancelar"
      });

      if (result.isConfirmed) {
        await moverTareaABacklogController(sprint.id, tareaId);

        const tareasActualizadas = sprint.tareas.filter(t => t.id !== tareaId);
        const sprintActualizado = { ...sprint, tareas: tareasActualizadas };
        const nuevosSprints = allSprints.map(s => s.id === sprint.id ? sprintActualizado : s);

        setSprint(sprintActualizado);
        setAllSprints(nuevosSprints);
        Swal.fire("Tarea movida", "La tarea ha sido movida al backlog.", "success");
      }
      return;
    }

    // Actualizar el estado de la tarea
    const nuevasTareas = sprint.tareas.map(t =>
      t.id === tareaId ? { ...t, estado: nuevoEstado } : t
    );
    const sprintActualizado = { ...sprint, tareas: nuevasTareas };

    const nuevosSprints = allSprints.map(s =>
      s.id === sprint.id ? sprintActualizado : s
    );

    try {
      // Enviar los cambios al backend
      await axios.put("http://localhost:3000/sprints", {
        listSprints: nuevosSprints
      });

      setSprint(sprintActualizado);
      setAllSprints(nuevosSprints);
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
    }
  };

  if (!sprint) return <p>Cargando sprint...</p>;

  // Filtrar las tareas según su estado
  const tareasPendientes = sprint.tareas.filter(t => t.estado === "pendiente");
  const tareasEnProgreso = sprint.tareas.filter(t => t.estado === "en-progreso");
  const tareasCompletadas = sprint.tareas.filter(t => t.estado === "completado");

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleSection}>
          <h2 className={styles.sprintTitle}>Nombre de la Sprint: {sprint.nombre}</h2>
          <p className={styles.subtitle}>Tareas en la sprint</p>
        </div>
        {/* Botón para crear una nueva tarea */}
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          + Crear tarea
        </button>
      </div>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h3>Pendiente</h3>
          {tareasPendientes.map(t => (
            <div key={t.id} className={styles.taskCard}>
              <p>{t.titulo}</p>
              <p className={styles.descripcion}>{t.descripcion}</p>
              <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
              <div className={styles.actions}>
                {/* Botones para cambiar el estado de la tarea */}
                <button onClick={() => actualizarEstadoTarea(t.id, "en-progreso")}>▶ En progreso</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <h3>En progreso</h3>
          <div className={styles.scrollArea}>
            {tareasEnProgreso.map(t => (
              <div key={t.id} className={styles.taskCard}>
                <p>{t.titulo}</p>
                <p className={styles.descripcion}>{t.descripcion}</p>
                <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
                <div className={styles.actions}>
                  {/* Botones para cambiar el estado de la tarea */}
                  <button onClick={() => actualizarEstadoTarea(t.id, "pendiente")}>⬅ Pendiente</button>
                  <button onClick={() => actualizarEstadoTarea(t.id, "completado")}>✅ Completado</button>
                  <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Completado</h3>
          {tareasCompletadas.map(t => (
            <div key={t.id} className={styles.taskCard}>
              <p>{t.titulo}</p>
              <p className={styles.descripcion}>{t.descripcion}</p>
              <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
              <div className={styles.actions}>
                {/* Botones para reabrir la tarea o moverla al backlog */}
                <button onClick={() => actualizarEstadoTarea(t.id, "en-progreso")}>🔄 Reabrir</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para crear una nueva tarea */}
      {showModal && (
        <TareaModal
          closeModal={() => setShowModal(false)}
          refreshTareas={fetchSprint}
          idSprint={id}
        />
      )}
    </div>
  );
};

export default SprintScreen;
