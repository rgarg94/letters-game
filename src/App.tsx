import { useEffect, useState } from "react";
import Game2, { type KeyEvent } from "./Learning";
import Application from "./Application";

function App() {
  const [customKey, setCustomKey] = useState<KeyEvent | null>(null);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      setCustomKey(e);
    });
  }, []);

  return <Game2 customKey={customKey} />;
  // return <Application eventKeyDown={customKey} />;
}

export default App;
