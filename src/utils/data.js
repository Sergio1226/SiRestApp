import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  Api  from "../api/SiRestApi.js";

const api = new Api()

export async function getApi(date,type){
    try {
      const data = await api.sirest(date.getMonth()+1, date.getDate(),Number(type));
      
      if (data) {
        let dataMenu = getMenu(data);
        Alert.alert("Menú del día", dataMenu);
      } else {
        Alert.alert("Sin menú", "No hay menú disponible para esta fecha.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener el menú.");
    }
};

export async function saveData(key, value){
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
};

export async function loadData({setUser, setPassword}){
    const storedUser = await AsyncStorage.getItem("user");
    const storedPassword = await AsyncStorage.getItem("password");
    if (storedUser) setUser(storedUser);
    if (storedPassword) setPassword(storedPassword);
};