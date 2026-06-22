import BottomNav from "./components/BottomNav";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";

function App() {


  return (
    <div className="flex flex-col">
      <Header/>
      <div className="app-container">
        <Sidebar />
      </div>
      <BottomNav/>
    </div>
  )
}

export default App
