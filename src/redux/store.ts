import { configureStore,combineReducers } from '@reduxjs/toolkit'; 
import MenReducer from "./MenReducer/reducer"
import cartReducer from "./cartReducer/reducer"


// Kết hợp reducer
const rootReducer = combineReducers({
  MenReducer,
  cartReducer,
});


// Xuất ra store type
export type StoreType = ReturnType<typeof rootReducer>;


export const store = configureStore({
  reducer: rootReducer,
  })

