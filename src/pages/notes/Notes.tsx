import { useState, useEffect } from 'react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { Plus, Search, Trash2, Edit2, Save, X, StickyNote } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { storageService } from '@/services/storage'

interface Note {
  id: string
  title: string
  content: string
  color: string
  createdAt: string
  updatedAt: string
}

const COLORS = [
  { name: 'Jaune', value: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300' },
  { name: 'Rose', value: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300' },
  { name: 'Bleu', value: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300' },
  { name: 'Vert', value: 'bg-green-100 dark:bg-green-900/30 border-green-300' },
  { name: 'Violet', value: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300' },
  { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300' },
]

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: COLORS[0].value })

  // Load notes from storage
  useEffect(() => {
    const savedNotes = storageService.get<Note[]>('notes') || []
    setNotes(savedNotes)
  }, [])

  // Save notes to storage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes)
    storageService.set('notes', updatedNotes)
  }

  const createNote = () => {
    if (!newNote.title.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveNotes([note, ...notes])
    setNewNote({ title: '', content: '', color: COLORS[0].value })
    setIsCreating(false)
  }

  const updateNote = () => {
    if (!editingNote) return

    const updatedNotes = notes.map(n =>
      n.id === editingNote.id
        ? { ...editingNote, updatedAt: new Date().toISOString() }
        : n
    )

    saveNotes(updatedNotes)
    setEditingNote(null)
  }

  const deleteNote = (id: string) => {
    if (confirm('Supprimer cette note?')) {
      saveNotes(notes.filter(n => n.id !== id))
    }
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Personnel</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Mes Notes</span>
          </h1>
          <p className="text-gray-500 mt-2">
            {notes.length} note(s) sauvegardée(s)
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle note
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Rechercher dans mes notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      {/* Create Note Modal */}
      {isCreating && (
        <Card hover={false} className="border-2 border-gold">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Nouvelle note</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Titre de la note"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-dark-card min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Contenu de ta note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />

            {/* Color Selection */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Couleur:</p>
              <div className="flex gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setNewNote({ ...newNote, color: color.value })}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      color.value.split(' ')[0],
                      newNote.color === color.value ? 'ring-2 ring-gold ring-offset-2' : ''
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
              <Button onClick={createNote} leftIcon={<Save className="w-4 h-4" />}>Sauvegarder</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={cn(
                'p-5 rounded-xl border-2 transition-all hover:shadow-lg',
                note.color
              )}
            >
              {editingNote?.id === note.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-card min-h-[100px] resize-none"
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setEditingNote({ ...editingNote, color: color.value })}
                        className={cn(
                          'w-6 h-6 rounded-full border',
                          color.value.split(' ')[0],
                          editingNote.color === color.value ? 'ring-2 ring-gold' : ''
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={updateNote}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{note.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="p-1 hover:bg-white/50 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 hover:bg-white/50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                    {note.content || 'Pas de contenu'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(note.updatedAt)}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            {searchTerm ? 'Aucune note trouvée' : 'Aucune note'}
          </h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'Essaie avec d\'autres mots-clés' : 'Crée ta première note!'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Créer une note
            </Button>
          )}
        </div>
      )}

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-2">
          Idées de notes à prendre
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card p-3 rounded-lg">
            <p className="font-semibold">Idées de produits</p>
            <p className="text-sm text-gray-500">Note les produits qui te semblent prometteurs</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-3 rounded-lg">
            <p className="font-semibold">Contacts fournisseurs</p>
            <p className="text-sm text-gray-500">Garde trace des bons contacts</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-3 rounded-lg">
            <p className="font-semibold">Résumés de modules</p>
            <p className="text-sm text-gray-500">Résume ce que tu apprends</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
