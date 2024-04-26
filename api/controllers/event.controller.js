import mysqlConnection from '../mysql.js';
import { errorHandler } from '../utils/error.js';

export const createEvent = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create an event"));
    }
    if (!req.body.title || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.image_url) {
      return next(errorHandler(400, "Please provide all required fields"));
    }
    const { title, description, start_date, end_date, image_url } = req.body;
    const query = `INSERT INTO events (title, description, start_date, end_date, image_url) VALUES (?, ?, ?, ?, ?)`;
    mysqlConnection().query(query, [title, description, start_date, end_date, image_url], (error, results, fields) => {
      if (error) {
        return next(errorHandler(500, "Failed to create event"));
      }
      res.status(201).json({ id: results.insertId, title, description, start_date, end_date, image_url });
    });
  };

export const getEvents = async (req, res, next) => {
  const query = `SELECT * FROM events`;
  mysqlConnection().query(query, (error, results, fields) => {
    if (error) {
      return next(errorHandler(500, "Failed to fetch events"));
    }
    res.status(200).json(results);
  });
};

export const getEvent = async (req, res, next) => {
  const eventId = req.params.eventId;
  const query = `SELECT * FROM events WHERE id = ?`;
  mysqlConnection().query(query, [eventId], (error, results, fields) => {
    if (error) {
      return next(errorHandler(500, "Failed to fetch event"));
    }
    if (results.length === 0) {
      return next(errorHandler(404, "Event not found"));
    }
    res.status(200).json(results[0]);
  });
};


export const deleteEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete an event"));
  }
  const eventId = req.params.eventId;
  const query = `DELETE FROM events WHERE id = ?`;
  mysqlConnection().query(query, [eventId], (error, results, fields) => {
    if (error || results.affectedRows === 0) {
      return next(errorHandler(404, "Event not found"));
    }
    res.status(200).json({ message: "Event deleted successfully" });
  });
};

export const updateEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update an event"));
  }
  const eventId = req.params.eventId;
  const { title, description, start_date, end_date, image_url } = req.body;
  const query = `UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, image_url = ? WHERE id = ?`;
  mysqlConnection().query(query, [title, description, start_date, end_date, image_url, eventId], (error, results, fields) => {
    if (error || results.affectedRows === 0) {
      return next(errorHandler(404, "Event not found"));
    }
    res.status(200).json({ id: eventId, title, description, start_date, end_date, image_url });
  });
};


