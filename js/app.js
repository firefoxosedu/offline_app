/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var debug = false;
var initialized = false;
var refreshButton;
var newsList;

window.addEventListener('localized', function localized() {
  //localforage.setDriver('localStorageWrapper');
  debug && console.log('We have l10n working!');
  if (initialized) {
    return;
  }

  refreshButton = document.getElementById('refreshButton');
  refreshButton.addEventListener('click', fetchRss);
  if (navigator.onLine !== 'online') {
    refreshButton.classList.add('offline');
  }

  newsList = document.querySelector('.news');

  fetchRss();

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
    localforage.getItem('cache', drawNews);
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
  localforage.setItem('cache', items, drawNews);
}

// Given an array of new items, shows them in the app
function drawNews(news) {
  newsList.innerHTML = '';
  news.forEach(function(article) {
    var li = document.createElement('li');
    // Add extra information to identify this li
    // with the contact object
    li.dataset.url = article.link;
    var aside = document.createElement('aside');
    aside.className = 'pack-end';
    var img = document.createElement('img');
    if (article.enclosure && article.enclosure.length > 1) {
      img.src = article.enclosure[1].url;
    }

    aside.appendChild(img);
    li.appendChild(aside);
    var a = document.createElement('a');
    var pDisplay = document.createElement('p');
    pDisplay.textContent = article.title;
    var pExtra = document.createElement('p');
    pExtra.textContent = article.description.replace(/<\/?[^>]+(>|$)/g, "");
    a.appendChild(pDisplay);
    a.appendChild(pExtra);

    li.appendChild(a);

    // Append to the list
    newsList.appendChild(li);
  });
}
