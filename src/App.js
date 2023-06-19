import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimaryLayout from "./Components/Layout/PrimaryLayout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./Components/Redux/store";
import AdminPage from "./Pages/PublicPages/AdminPage/AdminPage";
import SelectContract from "./Pages/PublicPages/SelectContract/SelectContract";

let persistor = persistStore(store);

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NotificationContainer />
          <BrowserRouter>
            <PrimaryLayout>
              <Routes>
                <Route path="/mint" element={<AdminPage />} />
                <Route path="/" element={<SelectContract />} />
                <Route path={"*"} />
              </Routes>
            </PrimaryLayout>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
