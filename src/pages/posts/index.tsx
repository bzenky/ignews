import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic'

import styles from './styles.module.scss'

type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    // pu = Posts - API ID Prismic
    Prismic.predicates.at('document.type', 'pu')
  ], {
    fetch: ['pu.title', 'pu.content'],
    pageSize: 100,
  })

  const posts = response.results.map(pu => {
    return {
      slug: pu.uid,
      title: RichText.asText(pu.data.title),
      excerpt: pu.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(pu.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}