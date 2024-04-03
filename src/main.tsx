import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from "react-router-dom";
import "./index.css";

import Login from "./components/routes/Login";
import HomeTemplate from "./components/routes/HomeTemplate";
import App from "./App";
import Services from "./components/routes/Services";
import User from "./components/routes/User";
import Home from "./components/routes/Home";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<HomeTemplate />}>
                <Route index element={<Home />} />
                <Route path="/users" element={<User />} />
                <Route path="/services" element={<Services />} />
            </Route>
            <Route path="/login" element={<Login />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
