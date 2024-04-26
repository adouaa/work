// useNavigateTo.js
import { useNavigate } from 'react-router-dom';

const useNavigateTo = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return navigateTo;
};

export default useNavigateTo;
