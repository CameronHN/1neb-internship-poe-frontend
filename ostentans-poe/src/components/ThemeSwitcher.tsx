import { Button } from '@fluentui/react-components';
import { WeatherSunny24Regular, WeatherMoon24Regular } from '@fluentui/react-icons';

type ThemeSwitcherProps = {
  isDarkTheme: boolean;
  setIsDarkTheme: (val: boolean) => void;
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkTheme, setIsDarkTheme }) => {
  return (
    <Button
      appearance="primary"
      icon={isDarkTheme ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
      onClick={() => setIsDarkTheme(!isDarkTheme)}
    >
      {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </Button>
  );
};

export default ThemeSwitcher;