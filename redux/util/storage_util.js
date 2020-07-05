import { AsyncStorage } from 'react-native';


// Root Storage: Store All
export const storeAllData = async (faves, orderedFaves) => {
  faves = JSON.stringify(faves);
  orderedFaves = JSON.stringify(orderedFaves);
  await AsyncStorage.multiSet([["faves", faves], ["orderedFaves", orderedFaves]]);

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
// returns { faves: {}, orderedFaves: [{ key: "", text: "" }] }
export const retrieveAllData = async () => {
  const allKeys = await AsyncStorage.getAllKeys().then(res => res);
  
  if (allKeys.length < 2) { // No faves yet:
    return { "faves": {}, "orderedFaves": [] };
  } 
  
  const allData = await AsyncStorage.multiGet(["faves", "orderedFaves"]).then(res => res);

  const faves = JSON.parse(allData[0][1]);
  const orderedFaves = JSON.parse(allData[1][1]);
  
  return { faves, orderedFaves };
};


// Check for dups / missing faves on init 
export const configureFavesOnInit = async () => {
  let allData = await retrieveAllData().then(data => data);

  let newFaves = Object.assign({}, allData["faves"]);
  let orderedFaves = allData["orderedFaves"];
  let newOrderedFaves = [];
  let dupCheck = new Set();

  // do not include objects in ordered faves that aren't in faves 
  if (orderedFaves) {
    orderedFaves.forEach(item => {
      // if newFaves has the item AND its not a duplicate 
      if (newFaves[item.key] && !dupCheck.has(item.key)) {
        dupCheck.add(item.key)
        newOrderedFaves.push(item);
      } 
    });
  }
  if (allData["faves"]) {
    Object.keys(allData["faves"]).forEach(key => {
      if (!dupCheck.has(key)) {
        delete newFaves[key];
      }
    });
  }
  
  

  const newData = await storeAllData(newFaves, newOrderedFaves)
    .then(data => data);
  return newData;
}


export const deleteAllData = async () => {
  await AsyncStorage.removeItem("faves");
  // await AsyncStorage.removeItem("favesPos");
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
  allData["orderedFaves"].push({ key, text: val });

  const newData = await storeAllData(allData["faves"], allData["orderedFaves"])
    .then(data => data);
  return newData;
}

// Update Fave Order  (save favesPos array)
export const updateFaveOrder = async (orderedFaves) => {
  let allData = await retrieveAllData().then(data => data);
  let dupFaves = allData["faves"];
  
  const newData = await storeAllData(dupFaves, orderedFaves)
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


  const orderedFaves = newData["orderedFaves"].filter(item => item.key !== key);
  newData["orderedFaves"] = orderedFaves;

  const returnVal = await storeAllData(newData["faves"], newData["orderedFaves"]).then(data => data);
  return returnVal;
}