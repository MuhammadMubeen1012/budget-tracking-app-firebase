import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { Badge, Button, Image, Space, Typography } from "antd";
import { MailOutlined, BellFilled, CloudFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/authSlice";
import { useDispatch } from "react-redux";
const { Title } = Typography;

function Header({ title }) {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async (e) => {
    try {
      navigate("/");
      await signOut(auth).then((res) => {
        dispatch(
          authActions.signOut()
        );
        console.log('Logout Successfully')    
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="Header">
      <Image
        width={40}
        src="https://cdn-icons-png.flaticon.com/128/781/781760.png"
      />
      <Title level={3}>{title}</Title>
      <Space>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </div>
  );
}

export default Header;
