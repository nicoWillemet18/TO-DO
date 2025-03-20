import styles from "./Header.module.css";

export const Header = () => {
    return (
        <div className={styles.containerHeader}>
            <video autoPlay loop muted className={styles.videoBackground}>
                <source src="/header.mp4" type="video/mp4" />
                Tu navegador no soporta videos en HTML5.
            </video>
            <div className={styles.containerTitleHeader}>
                <h2>Registro de tareas</h2>
            </div>
        </div>
    );
};