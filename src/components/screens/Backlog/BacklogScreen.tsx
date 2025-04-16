
import Backlog from "../../ui/Backlog/Backlog";

import styles from "./BacklogScreen.module.css";

const BacklogScreen = () => {
  return (
    <>
      <div className={styles.container}>
        <Backlog/>
      </div>
    </>
  );
};

export default BacklogScreen;