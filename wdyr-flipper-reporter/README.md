# wdyr-flipper-reporter

## Installation

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

## Usage

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
