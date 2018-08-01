/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
//import notFundImg from './images/404.gif';

export default function NotFound() {
  const LayoutContentBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 480,
    marginTop: 64,
  };
  const imgStyle = {
    maxWidth: '100%',
  };
  return (
    <div style={LayoutContentBoxStyle}>
      {/*
       <img alt="404" style={imgStyle} src={notFundImg} />
       */}
    </div>
  );
}
