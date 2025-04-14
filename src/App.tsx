import { Routes, Route } from "react-router-dom";
import BacklogScreen from "./components/screens/BacklogScreen/screens/screens/BacklogScreen";
import SprintScreen from "./components/screens/BacklogScreen/screens/screens/Sprint/SprintScreen";
import {Header} from "./components/ui/Header/Header";
import SprintsAside from "./components/ui/SprintsAside/SprintsAside";
import "./index.css"; // tus estilos globales

function App() {
  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <SprintsAside />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<BacklogScreen />} />
            <Route path="/sprint/:id" element={<SprintScreen />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;

