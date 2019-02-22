# SciChat

[![Build Status](https://travis-ci.org/SciCatProject/SciChat.svg?branch=master)](https://travis-ci.org/SciCatProject/SciChat)

Chat logging

To run using node, additional authentication info is needed. The simplest way is to create a file "AuthData.js" in /src containing the following lines:

module.exports = {
  baseUrl: 'your-domain.com',
  accessToken: 'your-access-token',
  userId: '@your-user-id:your-domain.com'
};
