import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface TemplateType {
  id: number;
  editorHeight: string | null;
  editorWidth: string | null;
  foregroundSec: {
    id: number;
    image: string;
    width: number;
    position: {
      x: number;
      y: number;
    };
  }[];
  imageSec: {
    image: string;
    width: number;
    zIndex: number;
    position: {
      x: number;
      y: number;
    };
  };
  textSec: {
    color: string;
    description: string;
    descriptionFontSize: string;
    title: string;
    titleFontSize: string;
    position: {
      x: number;
      y: number;
    };
  };
}

interface TemplateState {
  template: TemplateType[];
  id: number;
}

const initialState: TemplateState = {
  template: [],
  id: 0,
};

export const templateSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<TemplateType>) => {
      state.template.push(action.payload);
      state.id += 1;
    },

    // updateTemplate: (
    //   state,
    //   action: PayloadAction<{ id: number; templateItem: TemplateType }>
    // ) => {
    //   state.template = state.template.filter(
    //     (item) => item.id !== action.payload.id
    //   );
    //   state.template.push(action.payload.templateItem);
    //   state.id += 1;
    // },
  },
});

// export const { addTemplate, updateTemplate } = templateSlice.actions;
export const { addTemplate } = templateSlice.actions;

export const selectTemplates = (state: RootState) => state.templates.template;
export const getId = (state: RootState) => state.templates.id;

export default templateSlice.reducer;
