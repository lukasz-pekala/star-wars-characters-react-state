import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import endpoint from './endpoint';

import './styles.scss';

const reducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const initialState = {
  error: null,
  loading: false,
  characters: [],
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const thunkDispatch = (action) => {
    console.log('Akcja: ', action);

    if (typeof action === 'function') {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return [state, thunkDispatch];
};

const fetchCharacters = (dispatch) => {
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) =>
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: { characters: response.characters },
      }),
    )
    .catch((error) => dispatch({ type: 'ERROR', payload: { error } }));
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
