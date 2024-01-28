import { Menu } from "antd";
import {
  AppstoreOutlined,
  PlusCircleFilled,
  MinusCircleFilled,
  CheckCircleFilled
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function SideMenu() {
  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        onClick={(item) => {
          navigate(item.key);
        }}
        items={[
          {
            label: "Dashboard",
            icon: <AppstoreOutlined />,
            key: "/dashboard",
          },
          {
            label: "Income",
            icon: <PlusCircleFilled />,
            key: "/income",
          },
          {
            label: "Expenses",
            icon: <MinusCircleFilled />,
            key: "/expenses",
          },
          {
            label: "Savings",
            key: "/savings",
            icon: <CheckCircleFilled />,
          },
        ]}
      ></Menu>
    </div>
  );
}

export default SideMenu;
