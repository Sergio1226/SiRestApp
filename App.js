import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View, Image,TextInput,Pressable} from "react-native";
import ApiRest from "./Api.js";
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';



const api = new ApiRest();

const getApi = async (date,type) => {
  try {
    const data = await api.sirest(date.getMonth()+1, date.getDate(),Number(type));
    if (data) {
      let dataMenu = getMenu(data);
      Alert.alert("Menú del día", dataMenu);
    } else {
      Alert.alert("Sin menú", "No hay menú disponible para esta fecha.");
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Ocurrió un error al obtener el menú.");
  }
};

const fixEncoding = (text) => {
    if (text.startsWith("Prote")) {
      return "Proteínico";
    }else if(text.startsWith("Fari")) {
        return text.endsWith("2") ? "Farináceo No. 2" : text.endsWith("1") ? "Farináceo No. 1" : text;
    }
    return text;
};

const getMenu = (data) => {
  let menu = data.descripcionMenu + "\n\n";
  data.detallesMenus.forEach(element => {
    const tipo = fixEncoding(element.tiposProducto?.nombreTipoProducto || "Tipo desconocido");
    const ingrediente = element.descripcionIngrediente;
    menu += `${tipo} - ${ingrediente}\n`;
  });
  menu += `\n${data.restaurantes.nombreRestaurante}`;
  return menu;
};
const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export default function App() {
  const [menuSelect, setMenuSelect] = useState(0);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>SiRest</Text>
      </View>     
      {menuSelect === 1 ? <FormMenu setMenu={setMenuSelect}/>: menuSelect === 2 ? <RestMenu setMenu={setMenuSelect}/>: <MainMenu setMenu={setMenuSelect}/>}
    </View>
  );
}


function RestMenu({setMenu}){  
  const [time, setTime] = useState(new Date()); 
  const [isTime, setIsTime] = useState(false);
  const [selectedOption, setSelectedOption] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const changeTime = (event, selectedDate) => {
    if (selectedDate) {
      setTime(selectedDate);
    }
    setIsTime(false); 
  };

  const handleSearch = async () => {
    console.log(time, selectedOption, isLoading);
    if (isLoading) return; 
    setIsLoading(true); 
    try {
      await getApi(time, selectedOption);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={[styles.flexH,{position: "relative",right: 20}]}>
      <ImageButton source={"arrow-left"} iconStyle={{ fontSize: 18}} buttonStyle={{width: 38, height: 38}} onPress={()=>setMenu(0)}/>
      <View  style={[styles.form,{marginStart: 0}]}>
        <View style={styles.flexH}>
          <ImageButton source={"calendar"} iconStyle={[{fontSize: 30,width: 40, height: 40},styles.border]} onPress={()=>setIsTime(true)}/>
          {isTime &&  <DateTimePicker value={time} mode="date" onChange={changeTime} />}
          <Text style={styles.label}>{time.toLocaleDateString()}</Text>
        </View> 
        <View style={[styles.flexH]}>
          <ImageICon source={"cutlery"}  iconStyle={{width: 40, height: 40}}/>
          <Services selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        </View> 
      <ImageButton source={"search"} iconStyle={[{width: 40, height: 40,fontSize: 30},styles.border] } onPress={()=>handleSearch()}/>
      </View>
    </View>)
}

function Services({selectedOption, setSelectedOption}){
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={styles.picker}
        dropdownIconColor="#000"
      >
        <Picker.Item label="Almuerzo" value="2" />
        <Picker.Item label="Cena" value="3" />
      </Picker>
    </View>
  );
}
function MainMenu ({setMenu}){
  return (
    <View style={styles.flexH}>
        <ImageButton source={"user"} iconStyle={{fontSize: 40}} onPress={()=>setMenu(1)}/>
        <ImageButton source={"cutlery"} iconStyle={{fontSize: 40}} onPress={()=>setMenu(2)}/>     
    </View>
  );
}
function FormMenu({setMenu}){  
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedUser) setUser(storedUser);
      if (storedPassword) setPassword(storedPassword);
    };
    loadData();
  }, []);
  

  return (
    <View style={[styles.flexH,{position: "relative",left: 20}]}>
      <View  style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Usuario</Text>
          <Input value={user} key="user" saveKey={"user"} set={setUser} isSecure={false} placeholder="Usuario"/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>password</Text>
          <Input value={password} saveKey={"password"} key="password" set={setPassword} isSecure={true} placeholder="Contraseña"/>
        </View>
      </View>
      <ImageButton source={"arrow-right"} iconStyle={{ fontSize: 18}} buttonStyle={{width: 38, height: 38}} onPress={()=>setMenu(0)}/>
    </View>)
}

function Input({set,placeholder,saveKey,value,isSecure}){
  return (
    <TextInput
      onChangeText={(text)=>{
        set(text),
        saveData(saveKey,text)}}
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={isSecure}
      value={value}
    />
  )
}
function ImageButton({source, onPress,iconStyle,buttonStyle}){
  return (
    <Pressable  style={({ pressed }) => [
      styles.button,buttonStyle,
      pressed && styles.buttonPressed, 
    ]} onPress={onPress}>
      <Icon name={source} style={[styles.icon,iconStyle]} color="black"/>
    </Pressable>
  );
}
function ImageICon({source,iconStyle}){
  return (
    <View  style={[
      styles.button,iconStyle]}>
      <Icon style={[[styles.icon],{fontSize: 18}]} name={source}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003984",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#282828",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 60,
    fontWeight: "bold",
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 90,
    padding: 20,
    borderRadius: 10,
  },
  form: {
    padding: 20,
    backgroundColor: "#ffab40",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginStart: 20,
  },
  input:{
    minWidth : 100,
    maxWidth: 250,
    borderBottomColor: "#000",
    color: "#282828",
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  flexH:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffab40",
    width: 60,
    height: 60,
    padding: 10,
    margin:10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  icon: {
    color: "black",
    textAlign: "center",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#e6951e",
    transform: [{ scale: 0.95 }], 
  },
  border: {
    borderColor: "#282828",
    borderWidth: 1,
    borderRadius: 10, 
  },
  pickerContainer: {
    backgroundColor: "#eee",
    borderRadius: 5,
    width: 150,         
    overflow: "hidden",
    marginLeft: 10,
    marginRight: 10,
  },
  picker: {
    width: "100%",
    color: "#000",
    backgroundColor: "#eee",
  },
  inputWrapper: {
    width: 180, 
  },
  
});
