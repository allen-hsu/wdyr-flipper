# wdyr-flipper

There are two packages in this repo:

- [wdyr-flipper-reporter](#wdry-flipper-reporter)
- [flipper-plugin-why-did-you-render](#flipper-plugin-why-did-you-render)

## wdry-flipper-reporter

It's a Flipper plugin to report why-did-you-render results to Flipper Desktop app.

### Installation

you need to install [wdyr-flipper](https://github.com/welldone-software/why-did-you-render) first

and then

```
npm install --save-dev wdyr-flipper-reporter
```

or

```
yarn add --dev wdyr-flipper-reporter
```

or

```
pnpm add --save-dev wdyr-flipper-reporter
```

### Usage

in your `wdyr.js` config file

```js
if (__DEV__) {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  const defaultNotifier = whyDidYouRender.defaultNotifier;
  const wdyrStore = whyDidYouRender.wdyrStore;
  const wdyrFlipper =
    require("wdyr-flipper-reporter").setupDefaultFlipperReporter(wdyrStore);

  whyDidYouRender(React, {
    ...options,
    notifier: (updateInfo) => {
      // if you want to see more details, please use the defaultNotifier
      // defaultNotifier(updateInfo)
      wdyrFlipper.addUpdateInfo(updateInfo);
    },
  });
}
```

## flipper-plugin-why-did-you-render

A Flipper desktop extension to get why-did-you-render results from your React Native app.

### Installation

you need to install wdry-flipper-reporter in your React Native app and setup first

and then to pack this plugin file

```
yarn pack
```

will create a `flipper-plugin-why-did-you-render-0.0.1.tgz` file in the root folder.

Then, in your Flipper desktop app, go to `Manage Plugins` and click on `Install Plugins` and select the `flipper-plugin-why-did-you-render-0.0.1.tgz` file.
