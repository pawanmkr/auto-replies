import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

interface ProfileProps {
  profile: {
    dp: string;
    fullName: string;
    email: string; 
  };
}

const Profile = ({ profile }: ProfileProps) => {
  const { dp, fullName, email } = profile;
  return (
    <div className="profile flex flex-col items-center">
      <div className="dp-container overflow-hidden rounded bg-black">
        <img src={dp} alt="Profile Picture" className="dp w-20 h-20" />
      </div>
      <div className="profile-details mt-2 text-center">
        <p className="fullname text-2xl">{fullName}</p>
        <p className="email text-m">{email}</p>
      </div>
    </div>
  );
};

interface MenuProps {
  menuOptions: object;
}

const menuOptions = {
  Dashboard: FiHome,
  Profile: FiUser,
  Settings: FiSettings,
  Logout: FiLogOut,
};

const Menu = ({ menuOptions }: MenuProps) => {
  return (
    <ul className="menu mt-4 w-[100%] flex flex-col items-center">
      {Object.entries(menuOptions).map(([option, Icon]) => {
        return (
          <li
            className="menu-option w-max rounded px-4 py-2 hover:bg-matte-blue1 hover:cursor-pointer mt-3 text-2xl font-bold flex items-center"
            key={option}
          >
            <span className="icon mr-2">{<Icon />}</span>
            {option}
          </li>
        );
      })}
    </ul>
  );
};

const Sidebar = ({ profile }: ProfileProps) => {
  return (
    <div className="sidebar p-4 bg-matte-blue text-gray-200 h-[100vh] w-[20%] flex flex-col items-center">
      <Profile profile={profile} />
      <Menu menuOptions={menuOptions} />
    </div>
  );
};

export default Sidebar;
