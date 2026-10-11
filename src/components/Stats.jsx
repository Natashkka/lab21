export default function Stats({ tests }) {
  const total = tests.length;
  const ready = tests.filter((t) => t.status === 'ready').length;
  const draft = tests.filter((t) => t.status === 'draft').length;
  const avgQuestions = total
    ? (tests.reduce((sum, t) => sum + t.questionsCount, 0) / total).toFixed(1)
    : 0;

  return (
    <div className="stats">
      Всего тестов: <b>{total}</b> | Готовых: <b>{ready}</b> | Черновиков:{' '}
      <b>{draft}</b> | Среднее вопросов: <b>{avgQuestions}</b>
    </div>
  );
}