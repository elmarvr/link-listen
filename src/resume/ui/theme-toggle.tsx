import { Link, useTheme } from "./theme";
import moon from "~/icons/moon.svg?raw";
import sun from "~/icons/sun.svg?raw";
import { Icon } from "./icon";

export const ThemeToggle = () => {
  const { name } = useTheme();

  return (
    <Link
      src={`http://localhost:4321/en/resume?theme=${
        name === "light" ? "dark" : "light"
      }`}
    >
      {name === "light" ? (
        <Icon size={16} svg={moon} />
      ) : (
        <Icon size={16} svg={sun} />
      )}
    </Link>
  );
};
