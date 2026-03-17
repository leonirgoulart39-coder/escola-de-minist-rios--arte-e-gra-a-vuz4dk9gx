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
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Galeria de Arte</h1>
          <p className="text-muted-foreground mt-1">
            Exposição dos melhores trabalhos de nossos alunos.
          </p>
        </div>
        <Button onClick={handleUpload} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" /> Adicionar Obra
        </Button>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pb-8">
        {MOCK_GALLERY.map((artwork) => (
          <div
            key={artwork.id}
            className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={artwork.img}
              alt={artwork.title}
              className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-serif font-bold text-lg leading-tight">
                {artwork.title}
              </h3>
              <p className="text-gray-300 text-sm mt-1">{artwork.artist}</p>
              <div className="flex items-center justify-between mt-3">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none"
                >
                  {artwork.technique}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-accent hover:bg-white/20 rounded-full"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
