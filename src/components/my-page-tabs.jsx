import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NoteCard } from '@/components/note-card'
import { fetchUserNotes } from '@/services/api'
import { useAuth } from '@/context/AuthContext.jsx'

export function MyPageTabs() {
  const { user } = useAuth()
  const [library, setLibrary] = useState({
    myNotes: [],
    likedNotes: [],
    bookmarkedNotes: [],
    downloadedNotes: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setIsLoading(true)

    // 내 필기만 실제 API 연동
    fetchUserNotes(user.id)
      .then((notes) => {
        setLibrary(prev => ({
          ...prev,
          myNotes: notes,
          // 나머지는 아직 백엔드 미구현이므로 빈 배열 유지 (또는 필요시 mock 유지 가능)
        }))
      })
      .catch(err => console.error("Failed to fetch user notes:", err))
      .finally(() => setIsLoading(false))
  }, [user?.id])

  const sections = [
    { value: 'my-notes', label: '내 필기', key: 'myNotes', description: '내가 업로드한 필기 목록입니다.' },
    { value: 'liked', label: '좋아요', key: 'likedNotes', description: '좋아요를 누른 필기 목록입니다.' },
    { value: 'bookmarked', label: '스크랩', key: 'bookmarkedNotes', description: '북마크한 필기 목록입니다.' },
    { value: 'downloaded', label: '다운로드', key: 'downloadedNotes', description: '다운로드한 필기 목록입니다.' },
  ]

  return (
    <Tabs defaultValue="my-notes" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
        {sections.map((section) => (
          <TabsTrigger key={section.value} value={section.value}>
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => {
        const notes = library[section.key] || []
        return (
          <TabsContent key={section.value} value={section.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>
                  {section.description} 총 {notes.length}개
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`${section.value}-skeleton-${index}`} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : notes.length ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {notes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                    아직 {section.label.toLowerCase()} 필기가 없습니다.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

