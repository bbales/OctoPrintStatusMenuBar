# OctoPrintStatusMenuBar

Manage OctoPrint from your menu bar.

<div style="text-align:center"><img src ="https://github.com/bbales/OctoPrintStatusMenuBar/blob/master/docs/progress.gif"></div>

<div style="text-align:center"><img src ="https://github.com/bbales/OctoPrintStatusMenuBar/blob/master/docs/upload.gif"></div>

This application provides a handy interface for controlling and monitoring OctoPrint right from your desktop menu bar. 

### Preamble

> This application is currently in development. Some feautres may not work properly or as expected. There are many loose ends so feel free to help out! If there is a feature that you would like to see, don't hesitate to make a feature request.
> Cheers,
> Ben

OctoPrintStatusMenuBar currently supports Linux (Ubuntu tested) and OS X.

### Prerequisites

 - [Electron](http://electron.atom.io/)
 - [NPM](https://www.npmjs.com/)

### Installation

    npm install

To run the **electron app**:

    npm start

### FAQ

#### How do I get this working with my OctoPrint installation

Setup is fairly straightforward. There are only two required settings, your **OctoPrint URL** and your **API Key**. My Installation of OctoPrint is located on a Raspberry Pi on my local network, so my URL is simply: `http://octopi.local/`. Your API key can be found by navigating to the OctoPrint web-app and following `Settings->Features->API`. Check **Enable** as well as `Allow Cross Origin Resource Sharing (CORS)` and copy your API key to the clipboard. You must then paste this information into the setup tab of the application:
<div style="text-align:center"><img src ="https://github.com/bbales/OctoPrintStatusMenuBar/blob/master/docs/setup.png"></div>

### Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

### License
OctoPrintStatusMenuBar is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
