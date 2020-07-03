import { AsyncStorage } from 'react-native';


// Root Storage: Store All
export const storeAllData = async (faves, favesPos, orderedFaves) => {
  faves = JSON.stringify(faves);
  favesPos = JSON.stringify(favesPos);
  orderedFaves = JSON.stringify(orderedFaves);
  await AsyncStorage.multiSet([["faves", faves], ["favesPos", favesPos], ["orderedFaves", orderedFaves]]);

  const newData = await retrieveAllData().then(res => res); 
  return newData;
};

// export const updateFaveData = async (favesArr) => {
//   const newFaves = JSON.stringify(favesArr);
//   try {
//     await AsyncStorage.setItem(
//       '@owoticon:faves', newFaves
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }
// export const retrieveFaveData = async () => {
//   try {
//     const faves = await AsyncStorage.getItem('@owoticon:faves');
//     if (faves) {
//       console.log(faves);
//       return JSON.parse(faves);
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.log(err);
//   }
  
// }

// Root Storage: Retrieve All 
// returns { faves: {}, favesPos: [] }
export const retrieveAllData = async () => {
  const allKeys = await AsyncStorage.getAllKeys().then(res => res);
  
  if (allKeys.length === 0) { // No faves yet:
    return { "faves": {}, "favesPos": [], "orderedFaves": [] };
  } 
  
  const allData = await AsyncStorage.multiGet(["faves", "favesPos", "orderedFaves"]).then(res => res);
  

  const faves = JSON.parse(allData[0][1]);
  const favesPos = JSON.parse(allData[1][1]);
  const orderedFaves = JSON.parse(allData[2][1]);

  //console.log({ faves, favesPos, orderedFaves });
  return { faves, favesPos, orderedFaves };
};


export const deleteAllData = async () => {
  await AsyncStorage.removeItem("faves");
  await AsyncStorage.removeItem("favesPos");
  await AsyncStorage.removeItem("orderedFaves");
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
  allData["orderedFaves"].push({ key, text: val });

  const newData = await storeAllData(allData["faves"], allData["favesPos"], allData["orderedFaves"])
    .then(data => data);
  return newData;
}

// Update Fave Order  (save favesPos array)
export const updateFaveOrder = async (orderedFaves) => {
  let allData = await retrieveAllData().then(data => data);
  let dupFaves = allData["faves"];
  let newFavesPos = orderedFaves.map(item => item.key);
  

  const newData = await storeAllData(dupFaves, newFavesPos, orderedFaves)
    .then(data => data)
    .catch(err => console.log(err));
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

  const orderedFaves = newData["orderedFaves"].filter(item => item.key !== key);
  newData["orderedFaves"] = orderedFaves;

  const returnVal = await storeAllData(newData["faves"], newData["favesPos"], newData["orderedFaves"]).then(data => data);
  return returnVal;
}