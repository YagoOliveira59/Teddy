import { AppRouter } from "../main/router/AppRouter";
import { AuthProvider } from "../presentation/contexts/AuthProvider";
import { SelectedClientsProvider } from "../presentation/contexts/SelectedClientsProvider";

import { makeSelectedClientsDependencies } from "../main/factories/pages/selected-clients-page-with-dependences-factory";

import "./styles/index.css";
import "./styles/globals.css";

function App() {
  const dependences = makeSelectedClientsDependencies();

  return (
    <AuthProvider>
      <SelectedClientsProvider {...dependences}
      >
        <AppRouter />
      </SelectedClientsProvider>
    </AuthProvider>
  );
}

export default App;
