window.UNIT_9 = {
  id: 9,
  subtitle: 'Shopping & Money',
  lesson: {
    title: 'Compras e Dinheiro',
    sections: [
      {
        heading: 'Shopping Vocabulary',
        body: 'Essential vocabulary for shopping in Portugal.',
        examples: [
          { pt: 'a loja', en: 'shop / store', phonetic: 'ah LOH-zhah' },
          { pt: 'o preço', en: 'price', phonetic: 'oo PREH-soo' },
          { pt: 'a caixa', en: 'till / cashier', phonetic: 'ah KIE-shah' },
          { pt: 'o saco', en: 'bag', phonetic: 'oo SAH-koo' },
          { pt: 'a roupa', en: 'clothes', phonetic: 'ah ROH-pah' },
          { pt: 'os sapatos', en: 'shoes', phonetic: 'oosh sah-PAH-toosh' },
          { pt: 'o tamanho', en: 'size', phonetic: 'oo tah-MAN-yoo' },
          { pt: 'a oferta / o desconto', en: 'offer / discount', phonetic: '' },
          { pt: 'caro / barato', en: 'expensive / cheap', phonetic: 'KAH-roo / bah-RAH-too' },
        ]
      },
      {
        heading: 'Money & Payment',
        body: 'Portugal uses the Euro. Learn to handle transactions.',
        examples: [
          { pt: 'o dinheiro', en: 'money', phonetic: 'oo deen-YAY-roo' },
          { pt: 'o euro', en: 'euro', phonetic: 'oo EH-oo-roo' },
          { pt: 'o cêntimo', en: 'cent', phonetic: 'oo SEN-tee-moo' },
          { pt: 'pagar', en: 'to pay', phonetic: 'pah-GAR' },
          { pt: 'o troco', en: 'change', phonetic: 'oo TROH-koo' },
          { pt: 'a nota', en: 'banknote', phonetic: 'ah NOH-tah' },
          { pt: 'o cartão de crédito', en: 'credit card', phonetic: '' },
          { pt: 'Posso pagar com cartão?', en: 'Can I pay by card?', phonetic: '' },
        ]
      },
      {
        heading: 'Useful Shopping Phrases',
        body: 'Phrases for interacting with shopkeepers.',
        examples: [
          { pt: 'Posso experimentar?', en: 'Can I try this on?', phonetic: 'POH-soo esh-peh-ree-men-TAR' },
          { pt: 'Tem noutro tamanho?', en: 'Do you have another size?', phonetic: '' },
          { pt: 'Quanto custa isto?', en: 'How much does this cost?', phonetic: 'KWAN-too KOOS-tah ISH-too' },
          { pt: 'É muito caro.', en: 'It is very expensive.', phonetic: '' },
          { pt: 'Levo este/esta.', en: 'I will take this one.', phonetic: '' },
          { pt: 'Não, obrigado.', en: 'No, thank you.', phonetic: '' },
        ]
      }
    ]
  },
  flashcards: [
    { id: '9-001', front: 'a loja', back: 'shop / store', phonetic: 'ah LOH-zhah' },
    { id: '9-002', front: 'o preço', back: 'price', phonetic: 'oo PREH-soo' },
    { id: '9-003', front: 'a caixa', back: 'cashier', phonetic: 'ah KIE-shah' },
    { id: '9-004', front: 'a roupa', back: 'clothes', phonetic: 'ah ROH-pah' },
    { id: '9-005', front: 'os sapatos', back: 'shoes', phonetic: 'oosh sah-PAH-toosh' },
    { id: '9-006', front: 'o tamanho', back: 'size', phonetic: 'oo tah-MAN-yoo' },
    { id: '9-007', front: 'caro', back: 'expensive', phonetic: 'KAH-roo' },
    { id: '9-008', front: 'barato', back: 'cheap', phonetic: 'bah-RAH-too' },
    { id: '9-009', front: 'o dinheiro', back: 'money', phonetic: 'oo deen-YAY-roo' },
    { id: '9-010', front: 'o euro', back: 'euro', phonetic: 'oo EH-oo-roo' },
    { id: '9-011', front: 'pagar', back: 'to pay', phonetic: 'pah-GAR' },
    { id: '9-012', front: 'o troco', back: 'change', phonetic: 'oo TROH-koo' },
    { id: '9-013', front: 'Quanto custa isto?', back: 'How much does this cost?', phonetic: '' },
    { id: '9-014', front: 'Posso experimentar?', back: 'Can I try this on?', phonetic: '' },
    { id: '9-015', front: 'Posso pagar com cartão?', back: 'Can I pay by card?', phonetic: '' },
    { id: '9-016', front: 'Levo este.', back: 'I will take this one.', phonetic: '' },
    { id: '9-017', front: 'o desconto', back: 'discount', phonetic: 'oo desh-KON-too' },
    { id: '9-018', front: 'a nota', back: 'banknote', phonetic: 'ah NOH-tah' },
    { id: '9-019', front: 'o cartão de crédito', back: 'credit card', phonetic: '' },
    { id: '9-020', front: 'Tem noutro tamanho?', back: 'Do you have another size?', phonetic: '' },
  ],
  quiz: [
    { type: 'mc', question: 'What does "barato" mean?', options: ['expensive', 'big', 'cheap', 'new'], correct: 'cheap', xp: 10 },
    { type: 'mc', question: '"Quanto custa isto?" means:', options: ['Do you have this?', 'How much does this cost?', 'Can I try this on?', 'I will take this'], correct: 'How much does this cost?', xp: 10 },
    { type: 'fill', question: 'Translate "money" into Portuguese:', answer: ['o dinheiro', 'dinheiro'], xp: 10 },
    { type: 'fill', question: 'How do you say "to pay" in Portuguese?', answer: 'pagar', xp: 10 },
    {
      type: 'match', question: 'Match shopping terms:',
      pairs: [{ pt: 'a loja', en: 'shop' }, { pt: 'o troco', en: 'change' }, { pt: 'caro', en: 'expensive' }, { pt: 'o preço', en: 'price' }],
      xp: 20
    },
    { type: 'mc', question: '"Posso experimentar?" means:', options: ['Can I pay?', 'Can I try this on?', 'Do you have a bag?', 'How much?'], correct: 'Can I try this on?', xp: 10 },
    { type: 'fill', question: 'Translate "clothes" into Portuguese:', answer: ['a roupa', 'roupa'], xp: 10 },
  ],
  conversations: [
    {
      title: 'At the Clothes Shop',
      subtitle: 'Trying on clothes',
      lines: [
        { speaker: 'Vendedora', text: 'Bom dia! Posso ajudar?', en: 'Good morning! Can I help?' },
        { speaker: 'Cliente', text: 'Sim, gosto desta camisola. Posso experimentar?', en: 'Yes, I like this sweater. Can I try it on?' },
        { speaker: 'Vendedora', text: 'Claro! Que tamanho usa?', en: 'Of course! What size do you use?' },
        { speaker: 'Cliente', text: 'Uso o tamanho médio. Quanto custa?', en: 'I use medium size. How much does it cost?' },
        { speaker: 'Vendedora', text: 'Custa trinta e cinco euros. Temos em oferta!', en: 'It costs 35 euros. We have it on offer!' },
        { speaker: 'Cliente', text: 'Perfeito! Levo esta. Posso pagar com cartão?', en: 'Perfect! I will take this one. Can I pay by card?' },
        { speaker: 'Vendedora', text: 'Sim, claro! Venha à caixa.', en: 'Yes, of course! Come to the till.' },
      ]
    },
    {
      title: 'At the Market',
      subtitle: 'Buying fresh produce',
      lines: [
        { speaker: 'Vendedor', text: 'O que deseja, senhora?', en: 'What would you like, madam?' },
        { speaker: 'Compradora', text: 'Quero um quilo de laranjas. Quanto custa?', en: 'I want a kilo of oranges. How much is it?' },
        { speaker: 'Vendedor', text: 'São dois euros o quilo.', en: 'It is two euros per kilo.' },
        { speaker: 'Compradora', text: 'Está bem. E as maçãs?', en: 'OK. And the apples?' },
        { speaker: 'Vendedor', text: 'As maçãs estão em oferta, um euro e meio.', en: 'The apples are on offer, one fifty.' },
        { speaker: 'Compradora', text: 'Levo tudo. Aqui tem, três euros e cinquenta.', en: 'I will take everything. Here you are, three fifty.' },
      ]
    }
  ]
};
