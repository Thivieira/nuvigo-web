export interface ChatSession {
  id: string
  title: string
  location: string
  createdAt: Date
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
  }>
}

export const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Previsão para o fim de semana",
    location: "São Paulo",
    createdAt: new Date("2024-03-15T10:30:00"),
    messages: [
      {
        id: "1-1",
        role: "user",
        content: "Como será o clima em São Paulo no fim de semana?",
      },
      {
        id: "1-2",
        role: "assistant",
        content: "Para o fim de semana em São Paulo, a previsão indica céu parcialmente nublado com possibilidade de chuva isolada. As temperaturas devem variar entre 20°C e 28°C.",
      },
    ],
  },
  {
    id: "2",
    title: "Temperatura em Rio de Janeiro",
    location: "Rio de Janeiro",
    createdAt: new Date("2024-03-14T15:45:00"),
    messages: [
      {
        id: "2-1",
        role: "user",
        content: "Qual a temperatura atual no Rio de Janeiro?",
      },
      {
        id: "2-2",
        role: "assistant",
        content: "A temperatura atual no Rio de Janeiro é de 32°C, com sensação térmica de 35°C. O dia está ensolarado com umidade do ar em 65%.",
      },
    ],
  },
  {
    id: "3",
    title: "Chuva em Curitiba",
    location: "Curitiba",
    createdAt: new Date("2024-03-13T09:15:00"),
    messages: [
      {
        id: "3-1",
        role: "user",
        content: "Vai chover em Curitiba hoje?",
      },
      {
        id: "3-2",
        role: "assistant",
        content: "Sim, há 80% de probabilidade de chuva em Curitiba hoje. A previsão indica períodos de chuva moderada, com temperaturas entre 15°C e 20°C.",
      },
    ],
  },
] 