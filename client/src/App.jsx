import { useEffect, useState } from 'react';
import logo from './logo.svg';
import close from './close.png';
import s from './App.module.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBreed, setLoadingBreed] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState('');
  const [newImage, getNewImage] = useState(false);
  const [config, openConfig] = useState(true);
  const [breedOptions, setBreedOptions] = useState([]);
  const [subBreedOptions, setSubBreedOptions] = useState([]);
  const [breed, setBreed] = useState('');
  const [subBreed, setSubBreed] = useState('');
  const [subreedExists, setSubreedExist] = useState(false);
  let liked = [];
  /**
   * Initizalization Related functions
   */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(`/api/dog?breed=${breed}&subreed=${subBreed}`);
        const j = await r.json();
        setData(j.message);
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isError, newImage]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const r = await fetch('/api/breeds');
        const j = await r.json();
        setBreedOptions(j.message);
      } catch (error) {
        setIsError(true)
      }
      setLoadingBreed(false)
    };
    fetchOptions();
  }, []);

  function changeConfig() {
    if (config) {
      const configPage = document.getElementById('config');
      configPage.style.visibility = "visible";
      configPage.style.opacity = "1";
      const body = document.getElementById('body');
      body.style.overflow = "hidden";
      const configopener = document.getElementById('configopener');
      configopener.style.visibility = "hidden";
    } else {
      const configPage = document.getElementById('config');
      configPage.style.visibility = "hidden";
      configPage.style.opacity = "0";
      const body = document.getElementById('body');
      body.style.overflow = "visible";
      const configopener = document.getElementById('configopener');
      configopener.style.visibility = "visible";
      getNewImage(!newImage);
    }
    openConfig(!config);
  }

  function likeImage() {
    const currentLikes = JSON.parse(localStorage.getItem('myDogs'));
    const imageID = data.replace(/https:\/\/.{1,}\/breeds\/.{1,}\//gm, '');
    if (currentLikes) {
      const input = [...currentLikes, imageID];
      localStorage.setItem('myDogs', JSON.stringify(input));
    } else {
      let input = [imageID];
      localStorage.setItem('myDogs', JSON.stringify(input));
    }
    getNewImage(!newImage);
  }

  function breedSelect(e) {
    const { value } = e.target;
    setBreed(value);
    if (breedOptions[value].length > 0) {
      setSubBreedOptions(breedOptions[value]);
      setSubreedExist(true);
    } else {
      setSubreedExist(false);
    }
  }

  function subBreedSelect(e) {
    const { value } = e.target;
    setSubBreed(value);
  }
  return (

    <div className={s.container}>
      <div className={s.header}>
        <input id="configopener" type="image" src={logo} onClick={() => changeConfig()} />
      </div>
      <div id="config" className={s.config}>
        <div className={s.config__halfUp} onClick={() => changeConfig()} />
        <div className={s.config__halfDown}>
          <div className={s.header}>
            <input id="configopener" type="image" src={close} onClick={() => changeConfig()} />
          </div>
          Select a specific breed you would like to match with:
          {loadingBreed ? (
            <p>Loading</p>
          ) : (
            <>
              <select onChange={breedSelect} value={breed}>
                {Object.keys(breedOptions).map((keyName, i) =>
                  <option value={keyName}>
                    {keyName}
                  </option>
                )}
              </select>
              {subreedExists &&
                <>
                  <>Select a sub-breed:</>
                  <select onChange={subBreedSelect}>
                    {subBreedOptions.map((keyName, i) =>
                      <option value={keyName}>
                        {keyName}
                      </option>
                    )}
                  </select>
                </>
              }
            </>
          )}

        </div>
      </div>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className={s.container__card}>
          <img src={data} alt=""></img>
          <div className={s.container__card__bottom}>
            <button onClick={() => getNewImage(!newImage)}>Next</button>
            {JSON.parse(localStorage.getItem('myDogs')).includes(data.replace(/https:\/\/.{1,}\/breeds\/.{1,}\//gm, '')) ? (
              <button disabled>Liked Dog!</button>
            ) : (
              <button onClick={() => likeImage()}>Like</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
