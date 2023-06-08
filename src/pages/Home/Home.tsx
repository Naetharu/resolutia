import { Group } from '@mantine/core';
import { Link } from '@tanstack/react-location';

const Home = () => {

  return (
    <Group>
      <Link to='/create'>CREATE</Link>
      <Link to='/track'>TRACK</Link>
    </Group>
  );
};

export default Home;
