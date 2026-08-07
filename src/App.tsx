import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LeverStoreProvider } from "./store/LeverStore";
import { Shell } from "./components/layout/Shell";
import { BacklogView } from "./components/backlog/BacklogView";
import { DetailView } from "./components/detail/DetailView";
import { SubmitForm } from "./components/submit/SubmitForm";
import { StalledView } from "./components/dashboard/StalledView";
import { PortfolioView } from "./components/dashboard/PortfolioView";
import { MatrixView } from "./components/dashboard/MatrixView";
import { AboutView } from "./components/about/AboutView";

function App() {
  return (
    <LeverStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<AboutView />} />
            <Route path="/backlog" element={<BacklogView />} />
            <Route path="/use-cases/:id" element={<DetailView />} />
            <Route path="/submit" element={<SubmitForm />} />
            <Route path="/stalled" element={<StalledView />} />
            <Route path="/portfolio" element={<PortfolioView />} />
            <Route path="/matrix" element={<MatrixView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LeverStoreProvider>
  );
}

export default App;
