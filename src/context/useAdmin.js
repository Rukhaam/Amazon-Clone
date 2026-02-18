import { useContext } from "react";
import { AdminOrderContext } from "./AdminOrderContext";

export const useAdmin = () => useContext(AdminOrderContext);
