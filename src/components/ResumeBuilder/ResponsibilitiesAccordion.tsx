import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
} from "@fluentui/react-components";
import { subInformationStyle } from "../../styles/constants/textStyling";
import {
  responsibilityBulletStyle,
  responsibilityItemStyle,
  responsibilityListStyle,
} from "../../styles/constants/builderStyling";

interface ResponsibilitiesAccordionProps {
  responsibilities: string[];
  value: string;
}

export const ResponsibilitiesAccordion = ({
  responsibilities,
  value,
}: ResponsibilitiesAccordionProps) => (
  <Accordion multiple collapsible>
    <AccordionItem value={value}>
      <AccordionHeader size="small" style={subInformationStyle}>
        {responsibilities.length} responsibilities
      </AccordionHeader>
      <AccordionPanel>
        <List
          style={{ ...responsibilityListStyle, ...subInformationStyle }}
        >
          {responsibilities.map((responsibility, index) => (
            <ListItem key={index} style={responsibilityItemStyle}>
              <span style={responsibilityBulletStyle}>•</span>
              {responsibility}
            </ListItem>
          ))}
        </List>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
