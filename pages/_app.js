import "../styles/globals.css";
import GlobalContextProvider from "../context/global";
import { Provider } from "react-redux";
import store from "../context/store";

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </GlobalContextProvider>
  );
}

export default MyApp;
