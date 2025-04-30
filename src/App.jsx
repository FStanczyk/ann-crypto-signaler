import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MainPage from "./pages/MainPage";
import TrainModelMainPage from "./pages/trainModel/Main";
import TrainModelNew from "./pages/trainModel/New";
import LoadDataFile from "./pages/trainModel/LoadFile";
import urls from './urls'
import ChooseFile from "./pages/trainModel/ChooseFile";

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={urls.main.index} element={<AnimatedPage><MainPage /></AnimatedPage>} />
        <Route path={urls.trainModel.index}element={<AnimatedPage><TrainModelMainPage /></AnimatedPage>} />
        <Route path={urls.trainModel.new} element={<AnimatedPage><TrainModelNew /></AnimatedPage>} />
        <Route path={urls.trainModel.chooseFile} element={<AnimatedPage><ChooseFile /></AnimatedPage>} />
        <Route path={urls.trainModel.loadFile} element={<AnimatedPage><LoadDataFile /></AnimatedPage>} />
        <Route path={urls.trainModel.save} element={<AnimatedPage><TrainModelNew /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
