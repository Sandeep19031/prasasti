import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const sbtaction = createSlice({
  name: "stake",
  initialState: {
    address: "",
    hash:"",
    loader: false,
  },
  reducers: {
    ownerAddress: (state, action) => {
      state.address = action.payload;
    },
    txnHash :(state,action)=>{
     state.hash = action.payload;
    },
  },
});

export const { ownerAddress,txnHash } = sbtaction.actions;

export default sbtaction.reducer;
