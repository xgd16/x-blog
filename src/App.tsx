import React, {JSX} from 'react';
import './App.css';
import LeftView from "./components/leftView/LeftView";
import {RouterProvider} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import './scss/Content.scss'
import {ConfigProvider} from "antd";
import Blog from "./pages/Blog";


// 创建路由
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/blog",
        element: <Blog />,
    }
]);
function App():JSX.Element {
    return (
        <ConfigProvider theme={{
            components: {
                Pagination: {
                    itemSize: 24,
                    itemActiveBg: "#0d1116",
                    colorText: "#fff",
                    colorTextDisabled: "#4f4f4f",
                    colorPrimaryBorder: "#4f4f4f",
                    colorBgTextActive: "#fff",
                    colorPrimary: "#fff",
                    colorPrimaryHover: "#0d1116",
                }
            }
        }}>
            <div className={"view-box"}>
                <LeftView
                    image="./IMG_4622.jpeg"
                    username="XGD16"
                    iconList={[{iconName: 'github', href: 'https://github.com/xgd16'}]}
                />
                <div className={"content-box"} id={"content-box-id"}>
                    <RouterProvider router={router}/></div>
            </div>
        </ConfigProvider>
  );
}

export default App;
