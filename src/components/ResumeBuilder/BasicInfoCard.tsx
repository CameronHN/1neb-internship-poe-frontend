import {
  Card,
  CardHeader,
  CardPreview,
  Subtitle1,
} from "@fluentui/react-components";
import {
  basicInfoGridStyle,
  cardPreviewStyle,
} from "../../styles/constants/builderStyling";

interface BasicInfoCardProps {
  name: string;
  email: string;
  phoneNumber: string;
}

export const BasicInfoCard = ({
  name,
  email,
  phoneNumber,
}: BasicInfoCardProps) => (
  <Card>
    <CardHeader
      header={<Subtitle1>Basic Information (Always Included)</Subtitle1>}
    />
    <CardPreview style={cardPreviewStyle}>
      <div style={basicInfoGridStyle}>
        <div>
          <strong>Name:</strong> {name}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>Phone:</strong> {phoneNumber}
        </div>
      </div>
    </CardPreview>
  </Card>
);
