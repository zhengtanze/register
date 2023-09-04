import { BrowserRouter, useRoutes } from "react-router-dom";
import App from "./App";
import Edit from "./Edit";

const GetRoutes = () => {
    const routes = useRoutes(
        [{
            index: true,
            element: <App />
        }, {
            path: '/edit/:id',
            element: <Edit />
        }]
    );
    return routes;
}

const InitRoutes = () => {
    return (
        <BrowserRouter>
            <GetRoutes />
        </BrowserRouter>
    )
}

export default InitRoutes;