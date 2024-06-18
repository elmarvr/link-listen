import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
  type SVGProps,
} from "@react-pdf/renderer";
import { parse, type Node } from "svg-parser";
import { useTheme } from "./theme";

export interface IconProps extends SVGProps {
  svg: string;
  size?: number | string;
  color?: string;
}

export function Icon({ svg, color, ...props }: IconProps) {
  const { theme } = useTheme();

  const icon = parse(
    svg.replace(/currentColor/g, color ?? theme.colors.foreground)
  );

  const width = props.size ?? props?.width ?? 12;
  const height = props.size ?? props?.height ?? 12;

  return (
    <InnerIcon
      id="svg"
      icon={icon.children[0]}
      width={width}
      height={height}
      {...props}
    />
  );
}

interface InnerIconProps {
  icon: Node | string;
  id: string;
}
function InnerIcon({ icon, id, ...properties }: InnerIconProps) {
  if (typeof icon === "string") {
    return <Text>{icon}</Text>;
  }

  if (icon.type === "text") {
    return <Text>{icon.value}</Text>;
  }

  if (icon.type === "element") {
    if (!isValidTag(icon.tagName)) {
      return null;
    }

    const Element = elementMap[icon.tagName] as any;

    return (
      <Element {...icon.properties} {...properties}>
        {icon.children.map((child, index) => {
          const next = `${id}:${tagName(child)}_${index}`;

          return (
            <InnerIcon key={next} id={next} icon={child} {...properties} />
          );
        })}
      </Element>
    );
  }

  return null;
}

function tagName(node: Node | string): string {
  if (typeof node === "string") {
    return "text";
  }

  if (node.type === "text") {
    return "text";
  }

  return node.tagName!;
}

function isValidTag(tag: string | undefined): tag is keyof typeof elementMap {
  return !!tag && tag in elementMap;
}

const elementMap = {
  svg: Svg,
  line: Line,
  Polyline: Polyline,
  Polygon: Polygon,
  path: Path,
  rect: Rect,
  circle: Circle,
  ellipse: Ellipse,
  span: Tspan,
  g: G,
  stop: Stop,
  defs: Defs,
  clippath: ClipPath,
  lineargradient: LinearGradient,
  radialgradient: RadialGradient,
};
