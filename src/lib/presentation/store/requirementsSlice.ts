"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Requirement } from "@/smartspecs/lib/domain";

interface RequirementsState {
  requirements: Requirement[];
  selectedRequirement: Requirement | null;
}

const initialState: RequirementsState = {
  requirements: [],
  selectedRequirement: null,
};

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState,
  reducers: {
    setRequirements(state, action: PayloadAction<Requirement[]>) {
      state.requirements = action.payload;
    },
    setSelectedRequirement(state, action: PayloadAction<Requirement | null>) {
      state.selectedRequirement = action.payload;
    },
  },
});

export const { setRequirements, setSelectedRequirement } = requirementsSlice.actions;
export default requirementsSlice.reducer; 