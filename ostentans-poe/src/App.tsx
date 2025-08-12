import './App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import LoginForm from './components/auth/LoginForm';
import { useState } from 'react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { Text } from "@fluentui/react-components";


const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <FluentProvider theme={isDarkTheme ? {
      ...webDarkTheme, colorNeutralBackground1: "#000029ff", colorNeutralForeground1: "#ffffffff"
    } :
      { ...webLightTheme, colorNeutralBackground1: "#FFFFFF", colorNeutralForeground1: "#000000" }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, minHeight: '100vh', justifyContent: 'center' }}>
        <ThemeSwitcher isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
        <Text as='h1' size={1000}>
          <span className="font-kapakana">O</span>
          <span className="font-katibeh">stentans</span>
        </Text>
        <LoginForm />
      </div>
    </FluentProvider>
  );
};

export default App;