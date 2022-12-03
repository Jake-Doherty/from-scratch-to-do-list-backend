const pool = require('../utils/pool.js');

class Todo {
  id;
  user_id;
  detail;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.detail = row.detail;
  }

  static async insert({ userId, detail }) {
    const { rows } = await pool.query(
      `
		insert into
			todos (user_id, detail)
		values
			($1, $2)
		returning 
			*
		`,
      [userId, detail]
    );
    return new Todo(rows[0]);
  }
}

module.exports = { Todo };
