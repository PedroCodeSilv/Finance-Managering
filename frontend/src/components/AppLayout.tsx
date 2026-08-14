import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  );
}
