
import Backlog from "../../../../ui/Backlog/Backlog";
import { Header } from "../../../../ui/Header/Header";
import SprintsAside from "../../../../ui/SprintsAside/SprintsAside";
import styles from "./BacklogScreen.module.css";

const BacklogScreen = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <SprintsAside />
        <Backlog/>
      </div>
    </>
  );
};

export default BacklogScreen;