import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export function ImageIcon({source,style}){
    return (
      <View  style={[
        { 
            borderRadius: 12,
            backgroundColor: "rgb(255, 112, 67)",
            opacity: 0.7,
            elevation: 4,
            overflow: 'hidden',
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
          },style]}>
        <Icon name={source} color="black" size={30}/>    
      </View>
    );
  }
  