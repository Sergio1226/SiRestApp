import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export function IconSelect({ source, onPress, style,iconSize}) {
  return (
    <Pressable
      android_ripple={{ color: 'transparent' }}
      style={({ pressed }) => [
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
        },
        style,
        pressed && {
          opacity:1,
          transform: [{ scale: 0.95 }],
        },
      ]}
      onPress={onPress}
    >
      <Icon
        name={source}
        color="black"
        size={iconSize=== undefined ? 30 : iconSize}
      />
    </Pressable>
  );
}