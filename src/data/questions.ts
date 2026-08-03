export interface QuestionData {
  categoryId: number;
  value: number;
  question: string;
  answer: string;
  options?: string[];
}

export const questions: QuestionData[] = [
  {
    categoryId: 1,
    value: 200,
    question: 'ما أكبر كوكب في المجموعة الشمسية؟',
    answer: 'كوكب المشتري',
    options: ['الأرض', 'المشتري', 'المريخ', 'زحل'],
  },
  {
    categoryId: 1,
    value: 400,
    question: 'كم عدد قارات العالم؟',
    answer: 'سبع قارات',
  },
  {
    categoryId: 1,
    value: 600,
    question: 'ما العنصر الكيميائي الذي رمزه O؟',
    answer: 'الأكسجين',
  },
  {
    categoryId: 2,
    value: 200,
    question: 'ما عاصمة سلطنة عمان؟',
    answer: 'مسقط',
    options: ['صلالة', 'صحار', 'مسقط', 'نزوى'],
  },
  {
    categoryId: 2,
    value: 400,
    question: 'في أي محافظة تقع ولاية صلالة؟',
    answer: 'محافظة ظفار',
  },
  {
    categoryId: 2,
    value: 600,
    question: 'ما اسم أعلى جبل في سلطنة عمان؟',
    answer: 'جبل شمس',
  },
  {
    categoryId: 3,
    value: 200,
    question: 'كم لاعبًا يبدأ المباراة مع كل فريق في كرة القدم؟',
    answer: '11 لاعبًا',
  },
  {
    categoryId: 3,
    value: 400,
    question: 'كم دقيقة مدة مباراة كرة القدم الأساسية؟',
    answer: '90 دقيقة',
  },
  {
    categoryId: 3,
    value: 600,
    question: 'ما اسم البطولة الأوروبية الأقوى للأندية؟',
    answer: 'دوري أبطال أوروبا',
  },
  {
    categoryId: 4,
    value: 200,
    question: 'ما اسم اللعبة المشهورة التي تحتوي على مكعبات وعالم مفتوح؟',
    answer: 'Minecraft',
  },
  {
    categoryId: 4,
    value: 400,
    question: 'ما الشركة المطورة للعبة Fortnite؟',
    answer: 'Epic Games',
  },
  {
    categoryId: 4,
    value: 600,
    question: 'في أي لعبة تظهر شخصية Kratos؟',
    answer: 'God of War',
  },
  {
    categoryId: 5,
    value: 200,
    question: 'ما اسم الشخصية الخضراء الشهيرة في فيلم Shrek؟',
    answer: 'شريك',
  },
  {
    categoryId: 5,
    value: 400,
    question: 'ما اسم مدرسة السحر في سلسلة Harry Potter؟',
    answer: 'هوغوورتس',
  },
  {
    categoryId: 5,
    value: 600,
    question: 'ما اسم المسلسل الذي تدور أحداثه حول والتر وايت؟',
    answer: 'Breaking Bad',
  },
  {
    categoryId: 6,
    value: 200,
    question: 'ما معنى الاختصار AI؟',
    answer: 'الذكاء الاصطناعي',
  },
  {
    categoryId: 6,
    value: 400,
    question: 'من الشركة المطورة لنظام Android؟',
    answer: 'Google',
  },
  {
    categoryId: 6,
    value: 600,
    question: 'ما اللغة الأساسية المستخدمة لبناء صفحات الويب؟',
    answer: 'HTML',
  },
];
