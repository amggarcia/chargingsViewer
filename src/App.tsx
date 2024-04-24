import "./App.css";
import FileViewer from "./components/FileViewer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileViewer></FileViewer>
      </header>
      <div style={{ display: "none" }}>Vite</div>
    </div>
  );
}

export default App;
