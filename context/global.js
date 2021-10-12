import { useState, createContext, useContext } from "react"; // import useContext
const AAA = createContext();
export const useCustomContext = () => useContext(AAA) // export custom hook

export default function GlobalContextProvider(props) {
  const [count, setCount] = useState(110);
  const increaseCount = () => setCount(count + 1);
  const decreaseCount = () => setCount(count - 1);
  const distribution = { count, increaseCount, decreaseCount };
  return (
    <AAA.Provider value={distribution}>
      {props.children}
    </AAA.Provider>
  );
}