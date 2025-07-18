'use client';

import Link from 'next/link';
import styles from './LetterCard.module.css';

export default function VowelCard({ vowel }) {
  return (
    <Link href={`/learning/long-vowels/${vowel.toLowerCase()}`}>
      <button className={styles.letterCard}>
        {vowel}
      </button>
    </Link>
  );
} 