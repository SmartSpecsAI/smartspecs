"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app-lib/redux/store";
import { Requirement } from "@/smartspecs/app-lib/interfaces/requirement";

interface RequirementsState {
  requirements: Requirement[];
  selectedRequirement: Requirement | null;
}

const initialState: RequirementsState = {
  requirements: [],
  selectedRequirement: null,
};

const requirementsSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {
    setRequirements: (state, action: PayloadAction<Requirement[]>) => {
      state.requirements = action.payload;
    },
    setSelectedRequirement: (
      state,
      action: PayloadAction<Requirement | null>
    ) => {
      state.selectedRequirement = action.payload;
    },
  },
});

export const { setRequirements, setSelectedRequirement } =
  requirementsSlice.actions;

export const selectRequirements = (state: RootState) =>
  state.requirements.requirements;
export const selectSelectedRequirement = (state: RootState) =>
  state.requirements.selectedRequirement;

export const useRequirements = () => {
  const dispatch = useDispatch();
  const requirements = useSelector(selectRequirements);
  const selectedRequirement = useSelector(selectSelectedRequirement);

  const updateRequirements = (requirements: Requirement[]) => {
    dispatch(setRequirements(requirements));
  };

  const updateSelectedRequirement = (requirement: Requirement | null) => {
    dispatch(setSelectedRequirement(requirement));
  };

  return {
    requirements,
    selectedRequirement,
    updateRequirements,
    updateSelectedRequirement,
  };
};

export default requirementsSlice.reducer;
