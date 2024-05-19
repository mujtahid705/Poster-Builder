import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <>
      <Link to="/editor">
        <button>EDITOR</button>
      </Link>
    </>
  );
};

export default HomePage;
