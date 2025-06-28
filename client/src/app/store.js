import { configureStore } from "@reduxjs/toolkit"; 
import rootReducer from "./rooteReducer";
import { authApi } from "../features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { apiSlice } from "../features/api/apiSlice";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(DefaultMiddleware) => DefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
      apiSlice.middleware
    ),
});  
export default appStore;

// const initializeApp=async()=>{
//     await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
// }


