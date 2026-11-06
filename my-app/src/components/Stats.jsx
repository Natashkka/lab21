
export default function Stats({ tests }) {
  const total = tests.length;
  const aiGenerated = tests.filter((t) => t.generatedByAI).length;
  const totalQuestions = tests.reduce(
    (sum, t) => sum + (t.questions?.length || 0),
    0
  );
  const avgQuestions = total
    ? (totalQuestions / total).toFixed(1)
    : 0;

  return (
    <div className="stats">
      <div className="stat-item">
        <span>Всего тестов</span>
        <b>{total}</b>
      </div>

      <div className="stat-item">
        <span>Готовые</span>
       <b>{tests.filter(t => (t.status || 'ready') === 'ready').length}</b>
      </div>
      
      
      <div className="stat-item">
        <span>Всего вопросов</span>
        <b>{totalQuestions}</b>
      </div>

      <div className="stat-item">
        <span>Среднее вопросов</span>
        <b>{avgQuestions}</b>
      </div>
    </div>
  );
}
