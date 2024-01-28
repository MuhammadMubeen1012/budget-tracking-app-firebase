import React from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/Menu";
import { Typography, Space} from "antd";

export default function Wrapper({children, title}) {
  return (
    <div className="dashboard">
      <Header title={title}/>
      <Space className="MenuAndContent">
        <SideMenu />
        {children}
      </Space>
      <Footer />
    </div>
  );
}
