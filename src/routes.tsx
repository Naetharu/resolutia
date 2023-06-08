import { Route } from "@tanstack/react-location";
import Create from "./pages/Create/Create";
import Home from "./pages/Home/Home";
import Track from "./pages/Track/Track";

export const routes: Route[] = [
    { path: "/", element: <Home /> },
    { path: "/create", element: <Create /> },
    { path: "/track", element: <Track /> },
]