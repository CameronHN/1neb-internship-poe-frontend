import { Button } from "@fluentui/react-components";
import { ArrowRight12Regular } from "@fluentui/react-icons";

interface CustomProceedButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CustomProceedButton: React.FC<CustomProceedButtonProps> = ({
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  children,
  className = "custom-proceed-button",
  style,
}) => {
  return (
    <Button
      type={type}
      appearance="primary"
      className={className}
      icon={<ArrowRight12Regular />}
      style={{ 
        marginTop: 8,
        width: "fit-content",
        minWidth: "auto",
        maxWidth: "none",
        alignSelf: "center",
        ...style 
      }}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : children || "Let's move on"}
    </Button>
  );
};

export default CustomProceedButton;
