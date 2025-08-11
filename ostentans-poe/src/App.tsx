import { useState } from 'react';
import {
  Button,
  Input,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { WeatherMoon20Filled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #004e92, #ff512f)',
    padding: '1rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    minWidth: '300px',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: tokens.fontWeightBold,
    fontFamily: 'serif',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  darkModeToggle: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
});

export default function App() {
  const styles = useStyles();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div
      className={styles.root}
      style={{
        background: darkMode
          ? 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'
          : 'linear-gradient(to bottom, #004e92, #ff512f)',
      }}
    >
      <div className={styles.darkModeToggle}>
        <Text>Too much light? Go dark</Text>
        <Button
          icon={<WeatherMoon20Filled />}
          onClick={() => setDarkMode(!darkMode)}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.title}>Ostentans</div>

        <label>
          <Text>Email:</Text>
          <Input type="email" />
        </label>

        <label>
          <Text>Password:</Text>
          <Input type="password" />
        </label>

        <div className={styles.actions}>
          <Button appearance="primary">Register</Button>
          <Button>Login</Button>
        </div>
      </div>
    </div>
  );
}
