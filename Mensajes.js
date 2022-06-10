const { sqlite } = require('./database/config');
const knex = require('knex')(sqlite);

class Mensajes {
  async save(newData) {
    try {
      await knex('messages').insert({
        email: newData.email,
        message: newData.message,
        date: newData.date,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getById(id) {
    try {
      const msg = await knex('messages').where({ id });

      return msg;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    try {
      const data = await knex('messages');

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteById(id) {
    try {
      await knex('messages').where({ id }).del();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await knex('messages').del();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Mensajes;
