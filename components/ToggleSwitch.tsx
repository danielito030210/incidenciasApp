"use client"

import type React from "react"
import { TouchableOpacity, StyleSheet, Animated } from "react-native"
import { useEffect, useRef } from "react"

interface ToggleSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  activeColor?: string
  inactiveColor?: string
  thumbColor?: string
  disabled?: boolean
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  activeColor = "#4CAF50",
  inactiveColor = "#ccc",
  thumbColor = "white",
  disabled = false,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [value, animatedValue])

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value)
    }
  }

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  })

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX: thumbPosition }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  disabled: {
    opacity: 0.5,
  },
})

export default ToggleSwitch
