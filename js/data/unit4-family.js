window.UNIT_4 = {
  id: 4,
  subtitle: 'Family Members',
  lesson: {
    title: 'Família',
    sections: [
      {
        heading: 'Immediate Family',
        body: 'In Portuguese, family nouns are gendered. Many have distinct male/female forms.',
        examples: [
          { pt: 'a mãe', en: 'mother', phonetic: 'ah mayn' },
          { pt: 'o pai', en: 'father', phonetic: 'oo pie' },
          { pt: 'os pais', en: 'parents', phonetic: 'oosh piesh' },
          { pt: 'o filho / a filha', en: 'son / daughter', phonetic: 'oo FEE-lyoo / ah FEE-lyah' },
          { pt: 'o irmão / a irmã', en: 'brother / sister', phonetic: 'oo eer-MOW / ah eer-MAH' },
          { pt: 'o marido / a mulher', en: 'husband / wife', phonetic: 'oo mah-REE-doo / ah moo-LYEHR' },
        ]
      },
      {
        heading: 'Extended Family',
        body: 'Extended family terms are important for describing your family tree.',
        examples: [
          { pt: 'o avô / a avó', en: 'grandfather / grandmother', phonetic: 'oo ah-VOH / ah ah-VOH' },
          { pt: 'os avós', en: 'grandparents', phonetic: 'oosh ah-VOSH' },
          { pt: 'o neto / a neta', en: 'grandson / granddaughter', phonetic: 'oo NEH-too / ah NEH-tah' },
          { pt: 'o tio / a tia', en: 'uncle / aunt', phonetic: 'oo TEE-oo / ah TEE-ah' },
          { pt: 'o primo / a prima', en: 'male/female cousin', phonetic: 'oo PREE-moo / ah PREE-mah' },
          { pt: 'o sobrinho / a sobrinha', en: 'nephew / niece', phonetic: 'oo soo-BREEN-yoo / ah soo-BREEN-yah' },
        ]
      },
      {
        heading: 'Talking About Family',
        body: 'Use "ter" (to have) to describe your family members.',
        examples: [
          { pt: 'Tenho dois irmãos.', en: 'I have two brothers.', phonetic: '' },
          { pt: 'A minha família é grande.', en: 'My family is big.', phonetic: '' },
          { pt: 'O meu pai chama-se Carlos.', en: 'My father\'s name is Carlos.', phonetic: '' },
          { pt: 'Tenho três filhos.', en: 'I have three children.', phonetic: '' },
          { pt: 'A minha avó tem oitenta anos.', en: 'My grandmother is eighty years old.', phonetic: '' },
          { pt: 'Não tenho irmãs.', en: 'I do not have sisters.', phonetic: '' },
        ]
      }
    ]
  },
  flashcards: [
    { id: '4-001', front: 'a mãe', back: 'mother', phonetic: 'ah mayn' },
    { id: '4-002', front: 'o pai', back: 'father', phonetic: 'oo pie' },
    { id: '4-003', front: 'o filho', back: 'son', phonetic: 'oo FEE-lyoo' },
    { id: '4-004', front: 'a filha', back: 'daughter', phonetic: 'ah FEE-lyah' },
    { id: '4-005', front: 'o irmão', back: 'brother', phonetic: 'oo eer-MOW' },
    { id: '4-006', front: 'a irmã', back: 'sister', phonetic: 'ah eer-MAH' },
    { id: '4-007', front: 'o marido', back: 'husband', phonetic: 'oo mah-REE-doo' },
    { id: '4-008', front: 'a mulher', back: 'wife', phonetic: 'ah moo-LYEHR' },
    { id: '4-009', front: 'o avô', back: 'grandfather', phonetic: 'oo ah-VOH' },
    { id: '4-010', front: 'a avó', back: 'grandmother', phonetic: 'ah ah-VOH' },
    { id: '4-011', front: 'o neto', back: 'grandson', phonetic: 'oo NEH-too' },
    { id: '4-012', front: 'a neta', back: 'granddaughter', phonetic: 'ah NEH-tah' },
    { id: '4-013', front: 'o tio', back: 'uncle', phonetic: 'oo TEE-oo' },
    { id: '4-014', front: 'a tia', back: 'aunt', phonetic: 'ah TEE-ah' },
    { id: '4-015', front: 'o primo', back: 'male cousin', phonetic: 'oo PREE-moo' },
    { id: '4-016', front: 'a prima', back: 'female cousin', phonetic: 'ah PREE-mah' },
    { id: '4-017', front: 'os pais', back: 'parents', phonetic: 'oosh piesh' },
    { id: '4-018', front: 'a família', back: 'family', phonetic: 'ah fah-MEE-lyah' },
  ],
  quiz: [
    { type: 'mc', question: 'What is "mother" in Portuguese?', options: ['o pai', 'a mãe', 'a avó', 'a tia'], correct: 'a mãe', xp: 10 },
    { type: 'mc', question: '"O irmão" means:', options: ['uncle', 'father', 'brother', 'son'], correct: 'brother', xp: 10 },
    { type: 'fill', question: 'Translate "grandmother" into Portuguese:', answer: ['a avó', 'avó'], xp: 10 },
    { type: 'fill', question: 'How do you say "wife" in Portuguese?', answer: ['a mulher', 'mulher'], xp: 10 },
    {
      type: 'match', question: 'Match family members:',
      pairs: [{ pt: 'o pai', en: 'father' }, { pt: 'a filha', en: 'daughter' }, { pt: 'o tio', en: 'uncle' }, { pt: 'a prima', en: 'female cousin' }],
      xp: 20
    },
    { type: 'mc', question: '"Tenho dois irmãos" means:', options: ['I have two sisters', 'I have two brothers', 'I have two parents', 'I have two uncles'], correct: 'I have two brothers', xp: 10 },
    { type: 'fill', question: 'Translate "son" into Portuguese:', answer: ['o filho', 'filho'], xp: 10 },
  ],
  conversations: [
    {
      title: 'My Family',
      subtitle: 'Describing your family',
      lines: [
        { speaker: 'Luísa', text: 'Tens irmãos?', en: 'Do you have brothers or sisters?' },
        { speaker: 'Miguel', text: 'Sim, tenho um irmão e uma irmã.', en: 'Yes, I have one brother and one sister.' },
        { speaker: 'Luísa', text: 'E os teus pais?', en: 'And your parents?' },
        { speaker: 'Miguel', text: 'O meu pai chama-se António e a minha mãe chama-se Maria.', en: 'My father\'s name is António and my mother\'s name is Maria.' },
        { speaker: 'Luísa', text: 'Que família grande!', en: 'What a big family!' },
        { speaker: 'Miguel', text: 'Sim! E tenho quatro primos também.', en: 'Yes! And I have four cousins too.' },
      ]
    },
    {
      title: 'Meeting the Family',
      subtitle: 'Introducing family members',
      lines: [
        { speaker: 'Carlos', text: 'Esta é a minha avó, a Dona Rosa.', en: 'This is my grandmother, Dona Rosa.' },
        { speaker: 'Sara', text: 'Muito prazer, Dona Rosa!', en: 'Nice to meet you, Dona Rosa!' },
        { speaker: 'Avó', text: 'Igualmente, minha querida.', en: 'Likewise, my dear.' },
        { speaker: 'Carlos', text: 'E este é o meu tio Pedro.', en: 'And this is my uncle Pedro.' },
        { speaker: 'Sara', text: 'Boa tarde! Que família simpática!', en: 'Good afternoon! What a nice family!' },
      ]
    }
  ]
};
