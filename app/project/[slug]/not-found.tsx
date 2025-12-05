import Link from 'next/link'
import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Ce projet n'existe pas</p>
      <Link href="/gallery" className={styles.link}>
        Retour à la galerie
      </Link>
    </div>
  )
}

