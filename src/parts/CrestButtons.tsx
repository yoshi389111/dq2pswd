import React from 'react';

interface Props {
  sun: boolean;
  star: boolean;
  moon: boolean;
  water: boolean;
  life: boolean;
  setSun?: (state: boolean) => void;
  setStar?: (state: boolean) => void;
  setMoon?: (state: boolean) => void;
  setWater?: (state: boolean) => void;
  setLife?: (state: boolean) => void;
}

const COLOR_ON = '#ffffff';
const COLOR_OFF = '#888888';

const CrestButtons: React.FC<Props> = (props) => {
  // https://fonts.google.com/icons
  // Apache License, Version 2.0
  // https://www.apache.org/licenses/LICENSE-2.0.html
  return (
    <div className='row-line'>
      <span className='label'>入手した紋章</span>
      <div className='value'>
        <svg
          height='1.2em'
          width='1.2em'
          viewBox='0 0 24 24'
          fill={props.sun ? COLOR_ON : COLOR_OFF}
          onClick={() => props.setSun?.(!props.sun)}
        >
          <path d='M0 0h24v24H0z' fill='none' />
          {props.sun ? (
            <path d='M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z' />
          ) : (
            <path d='M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115l1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41 1.79-1.8-1.41-1.41z' />
          )}
        </svg>
        &emsp;
        <svg
          height='1.2em'
          width='1.2em'
          viewBox='0 0 24 24'
          fill={props.star ? COLOR_ON : COLOR_OFF}
          onClick={() => props.setStar?.(!props.star)}
        >
          <path d='M0 0h24v24H0z' fill='none' />
          {props.star ? (
            <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
          ) : (
            <path d='M12 7.13l.97 2.29.47 1.11 1.2.1 2.47.21-1.88 1.63-.91.79.27 1.18.56 2.41-2.12-1.28-1.03-.64-1.03.62-2.12 1.28.56-2.41.27-1.18-.91-.79-1.88-1.63 2.47-.21 1.2-.1.47-1.11.97-2.27M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' />
          )}
        </svg>
        &emsp;
        <svg
          height='1.2em'
          width='1.2em'
          viewBox='0 0 24 24'
          fill={props.moon ? COLOR_ON : COLOR_OFF}
          onClick={() => props.setMoon?.(!props.moon)}
        >
          <path d='M0 0h24v24H0z' fill='none' />
          {/* 月は左右反転する */}
          <g transform='translate(24 0) scale(-1 1)'>
            {props.moon ? (
              <path d='M14,2c1.82,0,3.53,0.5,5,1.35C16.01,5.08,14,8.3,14,12s2.01,6.92,5,8.65C17.53,21.5,15.82,22,14,22C8.48,22,4,17.52,4,12 S8.48,2,14,2z' />
            ) : (
              <path d='M14,4c0.34,0,0.68,0.02,1.01,0.07C13.1,6.23,12,9.05,12,12s1.1,5.77,3.01,7.93C14.68,19.98,14.34,20,14,20 c-4.41,0-8-3.59-8-8S9.59,4,14,4 M14,2C8.48,2,4,6.48,4,12s4.48,10,10,10c1.82,0,3.53-0.5,5-1.35c-2.99-1.73-5-4.95-5-8.65 s2.01-6.92,5-8.65C17.53,2.5,15.82,2,14,2L14,2z' />
            )}
          </g>
        </svg>
        &emsp;
        <svg
          height='1.2em'
          width='1.2em'
          viewBox='0 0 24 24'
          fill={props.water ? COLOR_ON : COLOR_OFF}
          onClick={() => props.setWater?.(!props.water)}
        >
          <path d='M0 0h24v24H0z' fill='none' />
          {props.water ? (
            <path d='M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M7.83,14 c0.37,0,0.67,0.26,0.74,0.62c0.41,2.22,2.28,2.98,3.64,2.87c0.43-0.02,0.79,0.32,0.79,0.75c0,0.4-0.32,0.73-0.72,0.75 c-2.13,0.13-4.62-1.09-5.19-4.12C7.01,14.42,7.37,14,7.83,14z' />
          ) : (
            <path d='M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M12,20c-3.35,0-6-2.57-6-6.2 c0-2.34,1.95-5.44,6-9.14c4.05,3.7,6,6.79,6,9.14C18,17.43,15.35,20,12,20z M7.83,14c0.37,0,0.67,0.26,0.74,0.62 c0.41,2.22,2.28,2.98,3.64,2.87c0.43-0.02,0.79,0.32,0.79,0.75c0,0.4-0.32,0.73-0.72,0.75c-2.13,0.13-4.62-1.09-5.19-4.12 C7.01,14.42,7.37,14,7.83,14z' />
          )}
        </svg>
        &emsp;
        <svg
          height='1.2em'
          width='1.2em'
          viewBox='0 0 24 24'
          fill={props.life ? COLOR_ON : COLOR_OFF}
          onClick={() => props.setLife?.(!props.life)}
        >
          <path d='M0 0h24v24H0z' fill='none' />
          {props.life ? (
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
          ) : (
            <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' />
          )}
        </svg>
      </div>
    </div>
  );
};

export default CrestButtons;
