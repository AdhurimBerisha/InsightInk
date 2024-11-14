import mysqlConnection from "../mysql.js";
import { errorHandler } from "../utils/error.js";

export const createEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create an event"));
  }

  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.start_date ||
    !req.body.end_date ||
    !req.body.image_url ||
    !req.body.category ||
    !req.body.location
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const {
    title,
    description,
    start_date,
    end_date,
    image_url,
    category,
    location,
  } = req.body;

  try {
    const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
    const [categoryResults] = await mysqlConnection()
      .promise()
      .query(categoryQuery, [category]);

    let categoryId;
    if (categoryResults.length === 0) {
      const insertCategoryQuery = `INSERT INTO categories (name) VALUES (?)`;
      const [categoryInsertResults] = await mysqlConnection()
        .promise()
        .query(insertCategoryQuery, [category]);
      categoryId = categoryInsertResults.insertId;
    } else {
      categoryId = categoryResults[0].id;
    }

    const { name, address, city, country } = location;
    const insertLocationQuery = `INSERT INTO location (name, address, city, country) VALUES (?, ?, ?, ?)`;
    const [locationResults] = await mysqlConnection()
      .promise()
      .query(insertLocationQuery, [name, address, city, country]);
    const locationId = locationResults.insertId;

    const insertEventQuery = `
      INSERT INTO events (title, description, start_date, end_date, image_url, category_id, location_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [eventResults] = await mysqlConnection()
      .promise()
      .query(insertEventQuery, [
        title,
        description,
        start_date,
        end_date,
        image_url,
        categoryId,
        locationId,
      ]);

    res.status(201).json({
      id: eventResults.insertId,
      title,
      description,
      start_date,
      end_date,
      image_url,
      category_id: categoryId,
      location_id: locationId,
    });
  } catch (error) {
    console.error(error);
    return next(errorHandler(500, "Something went wrong"));
  }
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
  mysqlConnection().query(
    query,
    [title, description, start_date, end_date, image_url, eventId],
    (error, results, fields) => {
      if (error || results.affectedRows === 0) {
        return next(errorHandler(404, "Event not found"));
      }
      res.status(200).json({
        id: eventId,
        title,
        description,
        start_date,
        end_date,
        image_url,
      });
    }
  );
};
