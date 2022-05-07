import { useEffect, useState } from 'react';
import logo from './logo.svg';
import s from './App.module.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [newImage, getNewImage] = useState(true)
  /**
   * Initizalization Related functions
   */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch('/api/dog');
        const j = await r.json();
        setData(j);
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isError, newImage]);

  return (
    <div className={s.container}>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className={s.container__card}>
          <img src={data.message} alt=""></img>
          <div>
          <button onClick={() => getNewImage(!newImage)} >Next</button>
          <button>Like</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
