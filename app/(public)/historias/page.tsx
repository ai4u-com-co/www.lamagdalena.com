import BlogCard from '@/components/molecules/BlogCard'
import { storiesData } from '@/data/stories'

export default function HistoriasPage() {
  return (
    <div className="historias-page" style={{ paddingTop: '120px' }}>
      <section className="blog-section">
        <div className="container-fluid" style={{ padding: '0 2rem' }}>
          <div className="blog-grid">
            {storiesData.map(story => (
              <BlogCard key={story.id} {...story} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
