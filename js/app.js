/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var debug = false;
var initialized = false;
var refreshButton;

window.addEventListener('localized', function localized() {
  debug && console.log('We have l10n working!');
  if (initialized) {
    return;
  }

  refreshButton = document.getElementById('refreshButton');
  refreshButton.addEventListener('click', fetchRss);
  if (navigator.onLine === 'offline') {
    refreshButton.classList.add('offline');
  }

  initialized = true;
});


// Listen for connectivity changes
window.addEventListener('online', function() {
  if (refreshButton) {
    refreshButton.classList.remove('offline');
  }
});

window.addEventListener('offline', function() {
  if (refreshButton) {
    refreshButton.classList.add('offline');
  }
});

// Fetch and parse the RSS feed
function fetchRss() {
  if (!navigator.onLine) {
    localforage.get('cache', drawNews);
    return;
  }

  var script = document.createElement('script');
  script.src = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%" +
    "20rss%20where%20url%3D'http%3A%2F%2Fwww.gazzetta.it%2Frss%2Fhome.xml'&" +
    "format=json&callback=parseRss";
  document.head.appendChild(script);
}

// Fetch the response information that we need and cached it in indexeddb
function parseRss(data) {
  var items = data.query.results.item;
  localforage.setItem('cache', items).then(drawNews);
}

// Given an array of new items, shows them in the app
function drawNews(news) {
}
