function normalizeWord(wordText) {
  return wordText
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Segmentación fonética para fusión de sonidos (ch, ll, rr, h muda, qu…)
export function segmentWordForBlend(wordText) {
  const word = normalizeWord(wordText);
  const segments = [];
  let i = 0;

  while (i < word.length) {
    const rest = word.slice(i);

    if (rest[0] === 'h') {
      i += 1;
      continue;
    }

    if (rest.startsWith('rr')) {
      segments.push('rr');
      i += 2;
      continue;
    }

    if (rest.startsWith('ch')) {
      segments.push('ch');
      i += 2;
      continue;
    }

    if (rest.startsWith('ll')) {
      segments.push('ll');
      i += 2;
      continue;
    }

    if (rest.startsWith('qu')) {
      segments.push('k');
      i += 2;
      if (rest[2] === 'u' && 'ei'.includes(rest[3])) {
        i += 1;
      }
      continue;
    }

    if (rest.startsWith('gu') && 'ei'.includes(rest[2])) {
      segments.push('g');
      i += 2; // g + u muda; la vocal e/i se procesa en el siguiente ciclo
      continue;
    }

    if (rest.startsWith('g') && rest[1] === 'u' && 'ei'.includes(rest[2])) {
      segments.push('g');
      i += 2;
      continue;
    }

    segments.push(rest[0]);
    i += 1;
  }

  return segments.length ? segments : [word];
}

/**
 * Fonema inicial normalizado: grafemas distintos que suenan igual devuelven el mismo id.
 * c+a/o/u, k, q(u) → 'k' · c+e/i → 'z' · v → 'b' · g+e/i → 'j' · y+vocal → 'll'
 * r inicial → 'rr' (vibrante múltiple) · x → 's' (xilófono) · w → 'g' (≈/gu/) · h muda se salta.
 * Evita que un niño oiga /k/ y tenga dos opciones válidas (Conejo y Quiosco).
 */
export function getInitialPhoneme(wordText) {
  let word = normalizeWord(wordText);
  if (word.startsWith('h')) {
    word = word.slice(1);
  }
  if (!word) {
    return '';
  }
  if (word.startsWith('qu')) return 'k';
  if (word.startsWith('ch')) return 'ch';
  if (word.startsWith('ll')) return 'll';
  if (word.startsWith('rr')) return 'rr';

  const first = word[0];
  const next = word[1] ?? '';

  if (first === 'c') return 'ei'.includes(next) ? 'z' : 'k';
  if (first === 'k' || first === 'q') return 'k';
  if (first === 'v') return 'b';
  if (first === 'w') return 'g';
  if (first === 'x') return 's';
  if (first === 'y') return 'aeiou'.includes(next) ? 'll' : 'i';
  if (first === 'g') return 'ei'.includes(next) ? 'j' : 'g';
  if (first === 'r') return 'rr';
  return first;
}

export function buildBlendLabelFromPhonemes(wordText) {
  return segmentWordForBlend(wordText).join(' · ');
}

export function buildBlendSpeechFromPhonemes(wordText) {
  return segmentWordForBlend(wordText).join(', ');
}

// Hueco en el centro: prioriza ñ interior (grafema poco inicial), luego vocales
export function getMiddleGapIndex(wordText) {
  const word = wordText.trim();
  if (word.length <= 2) return 1;

  const start = 1;
  const end = word.length - 2;

  // Piñata → Pi_ata; Muñeca → Mu_eca (enseña ñ donde suele aparecer)
  for (let i = start; i <= end; i += 1) {
    if (word[i].toLowerCase() === 'ñ') return i;
  }

  const mid = Math.floor(word.length / 2);
  const isVowel = (ch) => /[aeiouáéíóúü]/i.test(ch);

  for (let distance = 0; distance <= Math.max(mid - start, end - mid); distance += 1) {
    const left = mid - distance;
    const right = mid + distance;
    if (left >= start && left <= end && isVowel(word[left])) return left;
    if (distance > 0 && right >= start && right <= end && isVowel(word[right])) return right;
  }

  let index = mid;
  if (index < start) index = start;
  if (index > end) index = end;
  return index;
}

// Opciones numéricas alrededor del conteo correcto
export function buildSyllableCountOptions(correctCount) {
  const candidates = new Set([correctCount]);
  if (correctCount > 1) candidates.add(correctCount - 1);
  candidates.add(correctCount + 1);
  if (correctCount >= 3) candidates.add(correctCount - 2);
  if (correctCount <= 3) candidates.add(correctCount + 2);

  const sorted = [...candidates].filter((n) => n >= 1 && n <= 5).sort((a, b) => a - b);
  const result = [correctCount];

  for (const n of sorted) {
    if (n !== correctCount && result.length < 3) {
      result.push(n);
    }
  }

  while (result.length < 3) {
    const extra = result[result.length - 1] + 1;
    if (extra <= 5 && !result.includes(extra)) {
      result.push(extra);
    } else {
      break;
    }
  }

  return result.slice(0, 3);
}
