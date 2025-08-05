import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Form from "../pages/Form";
import Display from "../pages/Display";
import FormSousStation from "../pages/FormSousStation";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/form',
        element:<Form/>
    },
    {
        path:'/display',
        element:<Display/>
    },
    {
        path:'/form-sous-station',
        element:<FormSousStation/>
    }
])
export default router
