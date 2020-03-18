import { AsyncStorage } from 'react-native';


// Root Storage: Store All
export const storeAllData = async (faves, favesPos) => {
  faves = JSON.stringify(faves);
  favesPos = JSON.stringify(favesPos);
  await AsyncStorage.multiSet([["faves", faves], ["favesPos", favesPos]]);

  const newData = await retrieveAllData().then(res => res); 
  return newData;
};


// Root Storage: Retrieve All 
// returns { faves: {}, favesPos: [] }
export const retrieveAllData = async () => {
  const allKeys = await AsyncStorage.getAllKeys().then(res => res);
  
  if (allKeys.length === 0) { // No faves yet:
    return { "faves": {}, "favesPos": [] };
  } 
  
  const allData = await AsyncStorage.multiGet(["faves", "favesPos"]).then(res => res);
  const faves = JSON.parse(allData[0][1]);
  const favesPos = JSON.parse(allData[1][1]);
  return { faves, favesPos };
};

export const deleteAllData = async () => {
  await AsyncStorage.removeItem("faves");
  await AsyncStorage.removeItem("favesPos");
  return true;
}


/*
  DATA EXAMPLE: 

    "faves": {
      "happy-0": "<('v')>",
      "MOOD-IDX": "MOODSTR"
    }, 
    "favesPos": ["happy-0", "sad-3", "angry-5"]
*/


// Store One (STRING) => EXPECTS storeOne("funny-6", ">:D");
export const storeOne = async (key, val) => {
  let allData = await retrieveAllData().then(data => data);

  allData["faves"][key] = val;
  allData["favesPos"].push(key);

  const newData = await storeAllData(allData["faves"], allData["favesPos"])
    .then(data => data);
  return newData;
}


// Delete One (IDX) => EXPECTS deleteOne("friends-3");
export const deleteOne = async (key) => {
  let allData = await retrieveAllData().then(data => data);
  const newData = Object.assign({}, allData);

  const faves = newData["faves"];
  delete faves[key];
  newData["faves"] = faves;

  const favesPos = newData["favesPos"].filter(el => el !== key);
  newData["favesPos"] = favesPos;

  const returnVal = await storeAllData(newData["faves"], newData["favesPos"]).then(data => data);
  return returnVal;
}