import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ISprint } from "../../../types/ISprint";

import styles from "./SprintScreen.module.css";

const SprintScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [sprint, setSprint] = useState<ISprint | null>(null);
  const [allSprints, setAllSprints] = useState<ISprint[]>([]); // 🔹 Lista completa

  // 🔹 Cargar sprint desde la lista general
  useEffect(() => {
    const fetchSprint = async () => {
      try {
        const response = await axios.get<{ listSprints: ISprint[] }>("http://localhost:3000/Sprints");
        const sprints = response.data.listSprints;
        const sprintEncontrado = sprints.find(s => s.id === id);

        setAllSprints(sprints);
        if (sprintEncontrado) setSprint(sprintEncontrado);
        else console.warn("⚠ Sprint no encontrado");
      } catch (error) {
        console.error("❌ Error cargando sprint:", error);
      }
    };

    fetchSprint();
  }, [id]);

  // 🔹 Actualizar estado de una tarea dentro del sprint
  const actualizarEstadoTarea = async (
    tareaId: number,
    nuevoEstado: "pendiente" | "en-progreso" | "completado" | "backlog"
  ) => {
    if (!sprint) return;

    const nuevasTareas = sprint.tareas.map(t =>
      t.id === tareaId ? { ...t, estado: nuevoEstado } : t
    );
    const sprintActualizado = { ...sprint, tareas: nuevasTareas };

    const nuevosSprints = allSprints.map(s =>
      s.id === sprint.id ? sprintActualizado : s
    );

    try {
      await axios.put("http://localhost:3000/Sprints", {
        listSprints: nuevosSprints
      });

      setSprint(sprintActualizado);
      setAllSprints(nuevosSprints);
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
    }
  };

  if (!sprint) return <p>Cargando sprint...</p>;

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
        <button className={styles.createButton}>+ Crear tarea</button>
      </div>

      <div className={styles.columns}>
        {/* 🔸 Pendiente */}
        <div className={styles.column}>
          <h3>Pendiente</h3>
          {tareasPendientes.map(t => (
            <div key={t.id} className={styles.taskCard}>
              <p>{t.titulo}</p>
              <p className={styles.descripcion}>{t.descripcion}</p>
              <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
              <div className={styles.actions}>
                <button onClick={() => actualizarEstadoTarea(t.id, "en-progreso")}>▶ En progreso</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔸 En progreso */}
        <div className={styles.column}>
          <h3>En progreso</h3>
          {tareasEnProgreso.map(t => (
            <div key={t.id} className={styles.taskCard}>
              <p>{t.titulo}</p>
              <p className={styles.descripcion}>{t.descripcion}</p>
              <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
              <div className={styles.actions}>
                <button onClick={() => actualizarEstadoTarea(t.id, "pendiente")}>⬅ Pendiente</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "completado")}>✅ Completado</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔸 Completado */}
        <div className={styles.column}>
          <h3>Completado</h3>
          {tareasCompletadas.map(t => (
            <div key={t.id} className={styles.taskCard}>
              <p>{t.titulo}</p>
              <p className={styles.descripcion}>{t.descripcion}</p>
              <p className={styles.fecha}>Fecha límite: {t.fechaLimite}</p>
              <div className={styles.actions}>
                <button onClick={() => actualizarEstadoTarea(t.id, "en-progreso")}>🔄 Reabrir</button>
                <button onClick={() => actualizarEstadoTarea(t.id, "backlog")}>⬅ Backlog</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SprintScreen;
