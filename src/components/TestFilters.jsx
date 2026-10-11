export default function TestFilters({
  statusFilter,
  onStatusChange,
  difficultyFilter,
  onDifficultyChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="filters">
      <label>
        Статус:
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">Все</option>
          <option value="draft">Черновики</option>
          <option value="ready">Готовые</option>
          <option value="archived">В архиве</option>
        </select>
      </label>

      <label>
        Сложность:
        <select
          value={difficultyFilter}
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="easy">Лёгкие</option>
          <option value="medium">Средние</option>
          <option value="hard">Сложные</option>
        </select>
      </label>

      <label>
        Сортировка:
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="date-desc">Сначала новые</option>
          <option value="date-asc">Сначала старые</option>
          <option value="topic-asc">Тема A→Z</option>
          <option value="topic-desc">Тема Z→A</option>
          <option value="questions-desc">Больше вопросов</option>
          <option value="questions-asc">Меньше вопросов</option>
        </select>
      </label>
    </div>
  );
}