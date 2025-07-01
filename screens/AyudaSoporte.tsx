"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity, Alert, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "../context/NavigationContext"
import { Linking } from "expo"

// Componentes
import SectionHeader from "../components/SectionHeader"
import LoadingButton from "../components/LoadingButton"
import FAQItem from "../components/FAQItem"
import ContactInfoCard from "../components/ContactInfoCard"
import SystemStatusBanner from "../components/SystemStatusBanner"

interface ContactForm {
  asunto: string
  descripcion: string
}

const AyudaSoporte: React.FC = () => {
  const { navigate } = useNavigation()
  const [contactForm, setContactForm] = useState<ContactForm>({
    asunto: "",
    descripcion: "",
  })
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [systemStatus, setSystemStatus] = useState("")
  const token = "your_token_here" // Declare token variable
  const currentUser = { id: "user_id_here" } // Declare currentUser variable

  useEffect(() => {
    const cargarFAQs = async () => {
      const response = await fetch("/api/faqs")
      const data = await response.json()
      setFaqs(data.faqs)
    }
    cargarFAQs()
  }, [])

  useEffect(() => {
    const obtenerEstadoSistema = async () => {
      const response = await fetch("/api/sistema/estado")
      const data = await response.json()
      setSystemStatus(data.status)
    }
    obtenerEstadoSistema()
  }, [])

  const faqData = faqs

  const guideSteps = [
    "Inicia sesión con tu usuario institucional",
    "Crea un nuevo reporte desde el dashboard",
    "Espera notificaciones sobre el estado",
    "Consulta el historial en cualquier momento",
  ]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!contactForm.asunto.trim()) {
      Alert.alert("Error", "Por favor ingresa el asunto del mensaje")
      return false
    }
    if (!contactForm.descripcion.trim()) {
      Alert.alert("Error", "Por favor describe tu problema o consulta")
      return false
    }
    return true
  }

  const handleSendMessage = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Enviar mensaje de soporte via API
      const response = await fetch("/api/soporte/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asunto: contactForm.asunto,
          descripcion: contactForm.descripcion,
          usuario: currentUser.id,
        }),
      })
      const result = await response.json()

      console.log("Enviando mensaje de soporte:", contactForm)

      Alert.alert("Mensaje enviado", "Gracias por tu mensaje. El equipo de soporte te responderá pronto.", [
        {
          text: "OK",
          onPress: () => {
            setContactForm({ asunto: "", descripcion: "" })
          },
        },
      ])
    } catch (error) {
      console.error("Error enviando mensaje:", error)
      Alert.alert("Error", "No se pudo enviar el mensaje. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenGuide = async () => {
    // Abrir guía completa desde API o archivo
    const response = await fetch("/api/documentacion/guia-completa")
    const guideUrl = await response.json()
    Linking.openURL(guideUrl.url)

    Alert.alert(
      "Guía Completa",
      "Esta funcionalidad abriría un PDF o video tutorial completo sobre el uso de la aplicación.",
      [{ text: "OK" }],
    )
  }

  const volverAlDashboard = () => {
    navigate("Dashboard")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={volverAlDashboard}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda y Soporte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado del Sistema */}
        <SystemStatusBanner status={systemStatus} />

        {/* Preguntas Frecuentes */}
        <View style={styles.section}>
          <SectionHeader title="Preguntas Frecuentes" subtitle="Encuentra respuestas a las consultas más comunes" />

          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        {/* Formulario de Contacto */}
        <View style={styles.section}>
          <SectionHeader title="Contactar Soporte" subtitle="Envía tu consulta directamente al equipo técnico" />

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Asunto *</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe brevemente tu consulta"
                value={contactForm.asunto}
                onChangeText={(value) => handleInputChange("asunto", value)}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción del problema *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe detalladamente tu problema o consulta..."
                value={contactForm.descripcion}
                onChangeText={(value) => handleInputChange("descripcion", value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>{contactForm.descripcion.length}/500 caracteres</Text>
            </View>

            <LoadingButton
              title="Enviar mensaje"
              onPress={handleSendMessage}
              loading={loading}
              icon="send"
              backgroundColor="#2196F3"
              keepTextWhileLoading={true}
            />
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <SectionHeader title="Contacto Directo" subtitle="Otras formas de comunicarte con nosotros" />

          <ContactInfoCard />
        </View>

        {/* Guía Rápida */}
        <View style={styles.section}>
          <SectionHeader title="Guía Rápida de Uso" subtitle="Pasos básicos para usar la aplicación" />

          <View style={styles.guideContainer}>
            {guideSteps.map((step, index) => (
              <View key={index} style={styles.guideStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.guideButton} onPress={handleOpenGuide}>
              <Ionicons name="document-text" size={20} color="#2196F3" />
              <Text style={styles.guideButtonText}>Ver guía completa</Text>
              <Ionicons name="chevron-forward" size={16} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  guideContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guideStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  stepText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  guideButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  guideButtonText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 8,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default AyudaSoporte
