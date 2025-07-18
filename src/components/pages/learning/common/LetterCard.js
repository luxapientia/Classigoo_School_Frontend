'use client';

import Link from 'next/link';
import styles from './LetterCard.module.css';

export default function LetterCard({ letter }) {
  return (
    <Link href={`/learning/writing-letters/${letter.toLowerCase()}`}>
      <button className={styles.letterCard}>
        {letter}
      </button>
    </Link>
  );
} 