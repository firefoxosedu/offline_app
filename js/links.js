/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict'

// Setup the links to the app project using web activities
// to launch the browser.
document.querySelector('.title').addEventListener('click', launchBrowser);
document.querySelector('.footer-logo').addEventListener('click', launchBrowser);

function launchBrowser(evt) {
  evt.preventDefault();

  var src = evt.target.href;

  if (!src) {
    return;
  }

  new MozActivity({
    name: 'view',
    data: {
      type: 'url',
      url: src
    }
  });
}
