import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// const codePushEnabled = config.ENABLE_CODE_PUSH === '1';
// const AppWithCodePush = codePushEnabled ? codePush(codePushOptions)(App) : App;
// AppRegistry.registerComponent(appName, () => AppWithCodePush);
AppRegistry.registerComponent(appName, () => App);
