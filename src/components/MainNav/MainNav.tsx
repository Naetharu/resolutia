import { Group } from "@mantine/core";
import { Link } from "@tanstack/react-location";

const MainNav = () => {
  return (
    <Group>
      <Link to='/'>Home</Link>
      <Link to='/create'>Create</Link>
      <Link to='/track'>Track</Link>
    </Group>
  );
};

export default MainNav;
