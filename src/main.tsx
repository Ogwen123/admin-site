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
import HomeTemplate from "./components/HomeTemplate";
import App from "./App";
import Services from "./components/routes/Services";
import Users from "./components/routes/Users";
import Home from "./components/routes/Home";
import AddService from "./components/routes/AddService";
import NotFound from "./components/NotFound";
import Statistics from "./components/routes/Statistics";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<HomeTemplate />}>
                <Route index element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/add" element={<AddService />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)

document.body.classList.add("overflow-y-hidden")
