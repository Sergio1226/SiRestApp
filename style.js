import { StyleSheet } from "react-native";
export function Styles() {
    return StyleSheet.create({
    menus:{
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 20,
      width: "80%",
      alignItems: "center",
    },
    container: {
        width: "100%",
        flex: 1,
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
      fontSize: 60,
      fontWeight: "900",
      color: "#3e2723",
    },
  
    header: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderRadius: 10,
    },
    formUser: {
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    flexH:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems:"center",
      width: "100%",
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
    header : {
      alignItems: "center",
      justifyContent: "center",
      padding:20,
      borderRadius: 10,
      margin:10,
      marginTop:30,
  },
  row: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
})
}