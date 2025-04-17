import { TextInput} from 'react-native';

export function Input({set,placeholder,saveKey,value,isSecure}){
  return (
    <TextInput
      onChangeText={(text)=>{
        set(text)}}
      style={{minWidth : 100,
        maxWidth: 250,
        borderBottomColor: "#000",
        color: "#282828",
        borderBottomWidth: 2,
        marginBottom: 20,}}
      placeholder={placeholder}
      secureTextEntry={isSecure}
      value={value}
    />
  )
}

