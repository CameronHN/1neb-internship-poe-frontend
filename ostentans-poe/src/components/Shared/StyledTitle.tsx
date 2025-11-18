import { Title1, Title2, Title3 } from "@fluentui/react-components";
import "../App.css";

interface StyledTitleProps {
  text: string;
  style?: React.CSSProperties;
}

export const StyledTitle1: React.FC<StyledTitleProps> = ({ text, style }) => {
  if (!text || text.length === 0) return null;

  const firstChar = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <Title1 style={style}>
      <span className="font-kapakana">{firstChar}</span>
      <span className="font-katibeh">{restOfText}</span>
    </Title1>
  );
};

export const StyledTitle2: React.FC<StyledTitleProps> = ({ text, style }) => {
  if (!text || text.length === 0) return null;

  const firstChar = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <Title2 style={style}>
      <span className="font-kapakana">{firstChar}</span>
      <span className="font-katibeh">{restOfText}</span>
    </Title2>
  );
};

export const StyledTitle3: React.FC<StyledTitleProps> = ({ text, style }) => {
  if (!text || text.length === 0) return null;

  const firstChar = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <Title3 style={style}>
      <span className="font-kapakana">{firstChar}</span>
      <span className="font-katibeh">{restOfText}</span>
    </Title3>
  );
};
