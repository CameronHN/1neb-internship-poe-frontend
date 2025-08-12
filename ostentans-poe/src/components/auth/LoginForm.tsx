import { useState } from 'react';
import { Button, Input, Label } from '@fluentui/react-components';
import { ArrowDown12Regular, ArrowRight12Regular, } from '@fluentui/react-icons';

const radius = { borderRadius: '7px' };
const buttonWidth = { width: '10vw' };

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Handle login logic here

        alert(`Email: ${email}\nPassword: ${password}`);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '20vw', }}>
            <Label htmlFor="email" size='large' >Email:</Label>
            <Input
                style={radius}
                id="email"
                type="email"
                value={email}
                onChange={(_, data) => setEmail(data.value)}
                required
            />
            <Label htmlFor="password" size='large'>Password:</Label>
            <Input
                style={radius}
                id="password"
                type="password"
                value={password}
                onChange={(_, data) => setPassword(data.value)}
                required
            />

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2vw' }}>
                <Button type="submit" appearance="primary" style={buttonWidth} icon={<ArrowDown12Regular />}>Register</Button>
                <Button type="submit" appearance="primary" style={buttonWidth} icon={<ArrowRight12Regular />}>Login</Button>
            </div>
        </form>
    );
};

export default LoginForm;