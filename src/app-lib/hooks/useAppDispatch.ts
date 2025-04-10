import { useDispatch } from "react-redux";
import { AppDispatch } from "@/smartspecs/app-lib/redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>(); 