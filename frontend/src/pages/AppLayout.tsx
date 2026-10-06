import { Outlet } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { Sidebar, type Tab } from "../components/Sidebar";

export function AppLayout() {
  return (
    <>
      <Topbar />
      <Sidebar
        activeTab={"overview"}
        onTabChange={function (tab: Tab): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="app-layout">
        <div className="app-body">
          <Outlet />
        </div>
      </div>
    </>
  );
}
