import { AsyncStorage } from 'react-native';


// Root Storage: Store All
export const storeAllData = async (data) => {
  data = JSON.stringify(data);
  try {
    const newData = await AsyncStorage.setItem("root", data);
    return JSON.parse(newData);
  } catch (error) {
    console.log(error);
  }
};


// Root Storage: Retrieve All 
export const retrieveAllData = async () => {
  try {
    const value = await AsyncStorage.getItem("root");
    if (value !== null) {
      console.log(JSON.parse(value));
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};



/*
  DATA EXAMPLE: 

  "root": {
    "happy-0": "<('v')>",
    "MOOD-IDX": "MOODSTR",     ==>  {"mood-i": "str"}
  }
*/

// Store One (STRING)
export const storeOne = async (moodName, idx, str) => {
  let allData = await retrieveAllData().then(data => data);
  const key = [moodName, idx].join("-");

  if (!allData) {
    allData = {};
  }
  allData[key] = str;
  const newData = await storeAllData(allData).then(data => data);
  return newData;
}

// Delete One (IDX)
export const deleteOne = async (moodName, idx) => {
  const key = [moodName, idx].join("-");
  let allData = await retrieveAllData().then(data => data);

  const newData = Object.assign({}, allData);
  delete newData[key];

  const returnVal = await storeAllData(newData).then(data => data);
  return returnVal;
}