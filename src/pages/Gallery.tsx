import { Upload, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MOCK_GALLERY } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'

export default function Gallery() {
  const { toast } = useToast()

  const handleUpload = () => {
    toast({
      title: 'Upload de Obra',
      description: 'Selecione um arquivo de imagem para adicionar à galeria.',
    })
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border border-border/60 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Galeria de Arte
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Exposição dos melhores trabalhos de nossos alunos.
          </p>
        </div>
        <Button onClick={handleUpload} className="w-full sm:w-auto shadow-sm">
          <Upload className="mr-2 h-4 w-4" /> Adicionar Obra
        </Button>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pb-8">
        {MOCK_GALLERY.map((artwork) => (
          <div
            key={artwork.id}
            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm border border-border/40 hover:shadow-xl transition-all duration-300 bg-muted/20"
          >
            <img
              src={artwork.img}
              alt={artwork.title}
              className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <h3 className="text-white font-bold text-xl tracking-tight leading-tight">
                {artwork.title}
              </h3>
              <p className="text-gray-200 font-medium text-sm mt-1.5">{artwork.artist}</p>
              <div className="flex items-center justify-between mt-4">
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 font-medium shadow-sm"
                >
                  {artwork.technique}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-white hover:text-primary hover:bg-white/90 rounded-full transition-colors"
                >
                  <Heart className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
