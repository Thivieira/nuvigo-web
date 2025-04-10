import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, History } from "lucide-react"
import ChatTab from "./chat-tab"
import HistoryTab from "./history-tab"

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  humidity: string;
  wind: string;
}

interface DashboardTabsProps {
  activeLocation: string;
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function DashboardTabs({ activeLocation, weatherData, loading }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="chat">
      <TabsList className="mb-4">
        <TabsTrigger value="chat" className="gap-2 cursor-pointer">
          <User className="h-4 w-4" /> Conversa
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2 cursor-pointer">
          <History className="h-4 w-4" /> Histórico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-4">
        <ChatTab
          activeLocation={activeLocation}
          weatherData={weatherData}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  )
} 