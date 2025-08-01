import { useEffect, useState } from "react";
import Game2, { type KeyEvent } from "./Learning";

function App() {
  // return <Game1 />;
  const [customKey, setCustomKey] = useState<KeyEvent | null>(null);
  useEffect(() => {
    setTimeout(() => {
      console.log("first");

      setCustomKey({ key: "ArrowDown", keyCode: 1, virtualKey: "adsnkajdn" });
    }, 1000);

    setTimeout(() => {
      console.log("second");

      setCustomKey({ key: "Enter", keyCode: 1, virtualKey: "adsnkajdn" });
    }, 3000);
  }, []);

  return <Game2 customKey={customKey} />;
}

export default App;
