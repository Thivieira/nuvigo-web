import { Cloud, Sun, Umbrella } from "lucide-react"
import AuthButtons from "@/components/auth-buttons"
import AuthCTAButton from "@/components/auth-cta-button"
import { AuthWrapper } from "@/components/auth-wrapper"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background md:static">
        <div className="container flex items-center justify-between py-4 px-2 mx-auto overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap cursor-default">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Nuvigo</span>
          </div>
          <AuthWrapper>
            <AuthButtons />
          </AuthWrapper>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="container max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Insights do Clima, <span className="text-primary">Reimaginados</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Pergunte sobre o clima em linguagem natural e receba respostas com IA que são úteis e informativas.
            </p>
            <AuthWrapper>
              <AuthCTAButton />
            </AuthWrapper>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Como o Nuvigo Funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Cloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Clima em Tempo Real</h3>
                <p className="text-muted-foreground">
                  Alimentado pela Tomorrow.io, obtenha dados meteorológicos precisos para qualquer local do mundo.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Sun className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Conversas com IA</h3>
                <p className="text-muted-foreground">
                  Faça perguntas em linguagem natural e receba respostas inteligentes e conversacionais.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Umbrella className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Insights Personalizados</h3>
                <p className="text-muted-foreground">
                  Salve seus locais e histórico de conversas para uma experiência meteorológica personalizada.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Nuvigo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

