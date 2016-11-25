'use strict';

angular.module('rDApp.auth', ['rDApp.constants', 'rDApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
