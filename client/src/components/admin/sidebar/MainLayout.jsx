import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiFillDashboard,
  AiFillFolderAdd,
  AiOutlineUserAdd,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import "./MainLayout.css";
import { Link, Outlet } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCommentMedical,
  FaSignOutAlt,
  FaStar,
  FaThumbsUp,
  FaListUl,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../../redux/features/authSlice";
import { FaSun, FaMoon } from "react-icons/fa";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
    toast.success("logout successfully!");
  };
  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <h2 className="text-white fs-5 text-center py-3 mb-0">
              <span className="sm-logo">HS</span>
              <span className="lg-logo">𝓗𝓪𝓶𝓻𝓸 𝓢𝓱𝓸𝓹</span>
            </h2>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[""]}
            onClick={({ key }) => {
              if (key === "signout") {
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: "",
                icon: <AiFillDashboard className="fs-4" />,
                label: "Dashboard",
              },
              {
                key: "customers",
                icon: <AiOutlineUserAdd className="fs-4" />,
                label: "Customers",
                children: [
                  {
                    key: "customer-list",
                    icon: <AiOutlineUnorderedList className="fs-4" />,
                    label: "customers",
                  },
                ],
              },
              {
                key: "catalog",
                icon: <AiFillFolderAdd className="fs-4" />,
                label: "Catalog",
                children: [
                  {
                    key: "product-list",
                    icon: <AiOutlineUnorderedList className="fs-4" />,
                    label: "products",
                  },
                ],
              },
              {
                key: "orders",
                icon: <FaClipboardList className="fs-4" />,
                label: "Orders",
                children: [
                  {
                    key: "order-list",
                    icon: <FaListUl className="fs-4" />,
                    label: "Orders",
                  },
                ],
              },
              {
                key: "reviews",
                icon: <FaStar className="fs-4" />,
                label: "Reviews",
                children: [
                  {
                    key: "reviews-list",
                    icon: <FaThumbsUp className="fs-4" />,
                    label: "Reviews",
                  },
                ],
              },
              {
                key: "enquiries",
                icon: <FaCommentMedical className="fs-4" />,
                label: "Enquiries",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="d-flex justify-content-between ps-1 pe-5"
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <div className="d-flex gap-4 align-items-center">
              <div className="position-relative">
                <button
                  style={{
                    color: "black",
                    outline: "none",
                    border: "none",
                    background: "transparent",
                  }}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                </button>
              </div>
              <div className="d-flex gap-3 align-items-center dropdown">
                <Link to="/profile">
                  <div>
                    <img
                      height={32}
                      width={32}
                      objectFit="cover"
                      style={{ borderRadius: "50%" }}
                      src={user.user?.avatar.url}
                      alt="captain"
                    />
                  </div>
                </Link>
                <div
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h5 className="mb-0">{user.user?.fullName}</h5>
                  <p className="mb-0">{user.user?.email}</p>
                </div>
                <div
                  className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}
                >
                  <button
                    style={{
                      outline: "none",
                      border: "none",
                      background: "transparent",
                    }}
                    onClick={handleThemeChange}
                  >
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                  </button>
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <Link
                      className="dropdown-item py-1 mb-1"
                      style={{ height: "auto", lineHeight: "20px" }}
                      to=""
                    >
                      Action
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-1 mb-1"
                      style={{ height: "auto", lineHeight: "20px" }}
                      to=""
                    >
                      Another Action
                    </Link>
                  </li>
                </div>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default MainLayout;
