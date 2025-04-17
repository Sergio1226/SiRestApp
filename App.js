
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Text, View} from "react-native";
import { Styles } from "./style.js";
import { Input ,IconSelect , ImageIcon} from './src/components/index.js';
import { LinearGradient } from 'expo-linear-gradient';
import {loadData,getApi, saveData} from './src/utils/data.js';

const styles = Styles();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <AppLayout/>
    </View>
  );
}


function AppLayout(){
  const [menuSelect, setMenuSelect] = useState(0);
  return (
    <LinearGradient colors={["#fff3e0", "#ffe0b2", "#ffccbc"]}
    style={styles.container}>
      <View style={[styles.header]}>
        <Text style={styles.title}>SiRest</Text>
      </View>
      <View style={[styles.container, { flex: 1 }]}>
        {menuSelect === 2 && <RestMenu setMenu={setMenuSelect}/>}
        {menuSelect === 1 && <FormMenu setMenu={setMenuSelect}/>}
        {menuSelect === 0 && <MainMenu setMenu={setMenuSelect}/>}
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "black" }}>© By Sergio 2025</Text>
      </View>
    </LinearGradient>
  );
}

function MainMenu ({setMenu}){
  return (
    <View style={styles.menus}>
        <IconSelect source={"user"}  onPress={()=>setMenu(1)}/>
        <IconSelect source={"cutlery"} onPress={()=>setMenu(2)}/>     
    </View>
  );
}

function FormMenu({setMenu}){  
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    loadData({setUser, setPassword});
  }, []);

  return (
    <View style={[styles.flexH]}>
      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Usuario</Text>
          <Input
            value={user}
            key="user"
            saveKey={"user"}
            set={setUser}
            isSecure={false}
            placeholder="Usuario"
            />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Contraseña</Text>
          <Input
            value={password}
            key="password"
            saveKey={"password"}
            set={setPassword}
            isSecure={true}
            placeholder="Contraseña"
          />
        </View>
      </View>
      <IconSelect
        source={"arrow-right"}
        style={{ width: 38, height: 38 }}
        iconSize={18}
        onPress={() =>{ setMenu(0);
          saveData("user", user);
          saveData("password", password);
        }}
      />
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
    if (isLoading) return; 
    setIsLoading(true); 
    try {
      await getApi(time, selectedOption);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={[styles.flexH]}>
      <IconSelect
        source={"arrow-left"}
        style={{ width: 38, height: 38 }}
        iconSize={18}
        onPress={() => setMenu(0)}
      />
      <View >
        <View style={styles.row}>
          <IconSelect source={"calendar"} style={[{fontSize: 30,width: 40, height: 40}]} onPress={()=>setIsTime(true)}/>
          {isTime &&  <DateTimePicker value={time} mode="date" onChange={changeTime} />}
          <Text style={[styles.label,{position: "relative", right: 40}]}>{time.toLocaleDateString()}</Text>
        </View> 
        <View style={[styles.row]}>
          <ImageIcon source={"cutlery"}  style={{width: 40, height: 40}}/>
          <Services selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        </View> 
        <View style={{justifyContent: "center", alignItems: "center"}}>
          <IconSelect source={"search"} style={[{width: 40, height: 40,fontSize: 30}]} onPress={()=>handleSearch()}/>
        </View>
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


