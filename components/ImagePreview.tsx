import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ImageData {
  uri: string
  name: string
}

interface ImagePreviewProps {
  image: ImageData
  onRemove: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  return (
    <View style={styles.imagePreview}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="image" size={40} color="#666" />
        <Text style={styles.imagePreviewText}>{image.name}</Text>
      </View>
      <TouchableOpacity style={styles.removeImageButton} onPress={onRemove}>
        <Ionicons name="close-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  imagePreview: {
    marginTop: 10,
    position: "relative",
  },
  imagePlaceholder: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  imagePreviewText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },
})

export default ImagePreview
