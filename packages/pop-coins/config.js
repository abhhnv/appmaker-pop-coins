let settings = {};
const setSettings = (_settings) => {
  settings = _settings;
};
const getSettings = () => {
  return settings;
};
export { setSettings, getSettings, settings };
