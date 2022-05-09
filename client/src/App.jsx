import { useEffect, useState } from 'react';
import configIcon from './assets/logo.svg';
import closeIcon from './assets/close.png';
import s from './assets/App.module.scss';

function App() {
  // loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBreed, setLoadingBreed] = useState(true);
  // error states
  const [isError, setIsError] = useState(false);
  const [isErrorBreed, setIsErrorBreed] = useState(false);
  // data
  const [data, setData] = useState('');
  const [breedOptions, setBreedOptions] = useState([]);
  const [subBreedOptions, setSubBreedOptions] = useState([]);
  // refresh
  const [newImage, getNewImage] = useState(false);
  const [config, openConfig] = useState(true);
  // counters
  const [breed, setBreed] = useState('');
  const [subBreed, setSubBreed] = useState('');
  const [subreedExists, setSubreedExist] = useState(false);

  // Random image of x,y (optional) breed.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(`/api/dog?breed=${breed}&subreed=${subBreed}`);
        const j = await r.json();
        if (j.status !== 'success')
          setIsError(true);
        else
          setData(j.message);
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [newImage, breed, subBreed]);
  // types of breed
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const r = await fetch('/api/breeds');
        const j = await r.json();
        if (j.status !== 'success')
          setIsErrorBreed(true);
        else
          setBreedOptions(j.message);
      } catch (error) {
        setIsErrorBreed(true)
      }
      setLoadingBreed(false)
    };
    fetchOptions();
  }, []);

  // Open/Close config dialog
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
    }
    openConfig(!config);
  }
  // store Like
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
  // breed selection
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
  // SubBreed selection
  function subBreedSelect(e) {
    const { value } = e.target;
    setSubBreed(value);
  }
  return (
    <div className={s.container}>
      <div className={s.header}>
        <input id="configopener" type="image" src={configIcon} onClick={() => changeConfig()} alt="" />
      </div>
      <div id="config" className={s.config}>
        <div className={s.config__halfUp} onClick={() => changeConfig()} />
        <div className={s.config__halfDown}>
          <div className={s.header}>
            <input id="configopener" type="image" src={closeIcon} onClick={() => changeConfig()} alt="" />
          </div>
          Select a specific breed you would like to match with:
          {loadingBreed || isErrorBreed ? (
            <p>Loading or an Error has occurred</p>
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
      {isLoading || isError ? (
        <p>Loading or an Error has occurred</p>
      ) : (
        <div className={s.container__card}>
          {breed &&
            <p>You're currently browsing: <span>{subBreed && <>{subBreed}-</>}{breed}</span></p>}
          <div className={s.container__card__inner}>
            <img src={data} alt=""></img>
            <div className={s.container__card__inner__bottom}>
              <button onClick={() => getNewImage(!newImage)}>Next</button>
              {JSON.parse(localStorage.getItem('myDogs')).includes(data.replace(/https:\/\/.{1,}\/breeds\/.{1,}\//gm, '')) ? (
                <button disabled>Liked Dog!</button>
              ) : (
                <button onClick={() => likeImage()}>Like</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
