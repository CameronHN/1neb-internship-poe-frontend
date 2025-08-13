import { Button } from "@fluentui/react-components";
import {
  WeatherSunny24Regular,
  WeatherMoon24Regular,
} from "@fluentui/react-icons";

type ThemeSwitcherProps = {
  isDarkTheme: boolean;
  setIsDarkTheme: (val: boolean) => void;
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkTheme,
  setIsDarkTheme,
}) => {
  return (
    <Button
      appearance="primary"
      shape="circular"
      size="large"
      style={{
        width: 48,
        height: 48,
        minWidth: 48,
        minHeight: 48,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDarkTheme ? "white" : "black",
        color: isDarkTheme ? "black" : "white",
      }}
      icon={isDarkTheme ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
      onClick={() => setIsDarkTheme(!isDarkTheme)}
      aria-label={
        isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"
      }
    />
  );
};

export default ThemeSwitcher;
