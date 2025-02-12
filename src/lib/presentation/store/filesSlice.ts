import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define un nuevo tipo que incluya las propiedades necesarias
interface CustomFile {
    uid: string;
    name: string;
    lastModified: number;
}

const filesSlice = createSlice({
    name: 'files',
    initialState: {
        file: null as CustomFile | null,
    },
    reducers: {
        setFile: (state, action: PayloadAction<CustomFile>) => {
            const { uid, name, lastModified } = action.payload;
            state.file = { uid, name, lastModified }; // Almacena solo las propiedades necesarias
        },
        // otros reducers...
    },
});

export const { setFile } = filesSlice.actions;
export default filesSlice.reducer;