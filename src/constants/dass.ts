export const dassQuestions = [
  { id: 1, text: 'Saya merasa susah untuk beristirahat', category: 'stress' },
  { id: 2, text: 'Saya merasa mulut saya kering', category: 'anxiety' },
  { id: 3, text: 'Saya sama sekali tidak dapat merasakan perasaan positif', category: 'depression' },
  { id: 4, text: 'Saya mengalami kesulitan bernapas (misal: terengah-engah)', category: 'anxiety' },
  { id: 5, text: 'Saya merasa sulit untuk berinisiatif melakukan sesuatu', category: 'depression' },
  { id: 6, text: 'Saya cenderung bereaksi berlebihan terhadap situasi', category: 'stress' },
  { id: 7, text: 'Saya merasa gemetar (misalnya pada tangan)', category: 'anxiety' },
  { id: 8, text: 'Saya merasa menggunakan banyak energi gelisah', category: 'stress' },
  { id: 9, text: 'Saya khawatir akan situasi di mana saya mungkin menjadi panik', category: 'anxiety' },
  { id: 10, text: 'Saya merasa tidak ada hal yang dapat diharapkan', category: 'depression' },
  { id: 11, text: 'Saya mendapati diri saya semakin gelisah', category: 'stress' },
  { id: 12, text: 'Saya merasa sulit untuk bersantai', category: 'stress' },
  { id: 13, text: 'Saya merasa sedih dan tertekan', category: 'depression' },
  { id: 14, text: 'Saya tidak dapat memaklumi hal apa pun yang menghalangi saya', category: 'stress' },
  { id: 15, text: 'Saya merasa saya hampir panik', category: 'anxiety' },
  { id: 16, text: 'Saya tidak antusias dalam hal apa pun', category: 'depression' },
  { id: 17, text: 'Saya merasa saya tidak berharga sebagai seseorang', category: 'depression' },
  { id: 18, text: 'Saya merasa saya mudah tersinggung', category: 'stress' },
  { id: 19, text: 'Saya menyadari detak jantung saya (tanpa latihan fisik)', category: 'anxiety' },
  { id: 20, text: 'Saya merasa takut tanpa alasan yang jelas', category: 'anxiety' },
  { id: 21, text: 'Saya merasa hidup tidak berati', category: 'depression' },
]

// Helper untuk hitung score
export const calculateScore = (answers: Record<number, number>) => {
  let s = 0,
    a = 0,
    d = 0
  dassQuestions.forEach((q) => {
    const val = answers[q.id] || 0
    if (q.category === 'stress') s += val
    if (q.category === 'anxiety') a += val
    if (q.category === 'depression') d += val
  })
  // DASS-21 dikali 2 untuk menyamakan dengan DASS-42 full version
  return { stress: s * 2, anxiety: a * 2, depression: d * 2 }
}
