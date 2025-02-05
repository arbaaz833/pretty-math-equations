import { useLang, useThemeMode } from "@/lib/contexts/root.context";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useAuth } from "@/modules/auth/hooks/auth.hooks";
import { authActions } from "@/modules/auth/slices/auth.slice";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useResponsive } from "ahooks";
import { Avatar, Dropdown, Layout, Select, Space, Tooltip } from "antd";
import { useCallback } from "react";
import { Logo } from "./sidebar";

const { Header: AntdHeader } = Layout;

function Header() {
  const dispatch = useAppDispatch();
  const { themeMode, toggleThemeMode, _themeMode } = useThemeMode();
  const { translations, lang, setLang } = useLang();
  const { md } = useResponsive();
  const collapsed = useAppSelector((state) => state.auth.sidebarCollapsed);
  const { logoutLoading } = useAuth();
  const isDarkTheme = themeMode === "dark";

  const toggleCollapsed = useCallback(() => {
    dispatch(authActions.toggleSidebarCollapsed());
  }, []);

  return (
    <AntdHeader className="justify-between">
      {md ? (
        <div />
      ) : (
        <Space align="center" size={20}>
          <Logo collapsed={collapsed} />
          <div className="mt-1">
            <MenuOutlined onClick={toggleCollapsed} className="text-[18px]" />
          </div>
        </Space>
      )}

      <Space size={20}>
        <Select
          className="w-24"
          options={Object.keys(translations).map((lang) => ({
            value: lang,
            label: translations[lang as keyof typeof translations].title,
          }))}
          value={lang}
          onChange={(value) => setLang(value)}
        />
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "system",
                label: "System",
                onClick: () => toggleThemeMode("system"),
              },
              {
                key: "light",
                label: "Light",
                onClick: () => toggleThemeMode("light"),
              },
              {
                key: "dark",
                label: "Dark",
                onClick: () => toggleThemeMode("dark"),
              },
            ],
            selectedKeys: [_themeMode],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Tooltip title="Change theme" placement="left">
              <img
                alt={`Curren Theme: ${isDarkTheme ? "dark" : "light"}`}
                src={isDarkTheme ? "/sun.png" : "/night.png"}
                width={24}
                height={24}
                className="mt-1"
              />
            </Tooltip>
          </a>
        </Dropdown>

        <Dropdown
          menu={{
            items: [
              {
                key: "settings",
                label: "Settings",
              },
              {
                key: "logout",
                label: "Logout",
                disabled: logoutLoading,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Space align="center" className="cursor-pointer">
            <Avatar />
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </AntdHeader>
  );
}

export default Header;
