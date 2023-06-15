import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import logo from "../../assets/icons/responder-pro.png";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  profile: {
    dp: string;
    fullName: string;
    email: string;
  };
}

const Logo = () => {
  return (
    <div className="logo flex w-full items-center justify-center mt-[-20px]">
      <img src={logo} className="w-20 h-20 rounded" />
      <p className="name text-gray-300 flex flex-col">
        <span className="text-xl font-bold">Responder</span>
        <span className="text-xs">Pro</span>
      </p>
    </div>
  );
};

const Profile = ({ profile }: ProfileProps) => {
  const { dp, fullName, email } = profile;
  return (
    <div className="profile flex flex-col w-max p-2">
      <div className="dp-container overflow-hidden rounded w-max">
        <img src={dp} alt="Profile Picture" className="dp w-12 h-12" />
      </div>
      <div className="profile-details mt-2">
        <p className="fullname text-xl">{fullName}</p>
        <p className="email text-sm">{email}</p>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}

const MenuItem = ({ icon, text, onClick }: MenuItemProps) => (
  <li
    className="menu-option w-max rounded px-2 py-2 hover:bg-matte-blue1 hover:cursor-pointer mt-3 text-2xl font-bold flex items-center"
    onClick={onClick}
  >
    <span className="icon mr-2">{icon}</span>
    {text}
  </li>
);

const Menu = () => {
  const navigate = useNavigate();
  const logout = () => {
    googleLogout();
    navigate("/");
  };

  const menuItems = [
    { key: "dashboard", icon: <FiHome />, text: "Dashboard" },
    { key: "profile", icon: <FiUser />, text: "Profile" },
    { key: "settings", icon: <FiSettings />, text: "Settings" },
    { key: "logout", icon: <FiLogOut />, text: "Logout", onClick: logout },
  ];

  return (
    <ul className="menu mt-4 w-[100%] flex flex-col ">
      {menuItems.map((item) => (
        <MenuItem
          key={item.key}
          icon={item.icon}
          text={item.text}
          onClick={item.onClick}
        />
      ))}
    </ul>
  );
};

const Sidebar = ({ profile }: ProfileProps) => {
  return (
    <div
      className="sidebar bg-matte-blue text-gray-200 
      h-[100vh] w-max flex flex-col items-center justify-between px-2 py-4"
    >
      <div className="upper">
        <Logo />
        <Menu />
      </div>
      <Profile profile={profile} />
    </div>
  );
};

export default Sidebar;
