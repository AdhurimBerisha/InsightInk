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
    !req.body.descriptionOption
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
    descriptionOption,
  } = req.body;

  try {
    // Check if the category already exists
    const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
    const [categoryResults] = await mysqlConnection()
      .promise()
      .query(categoryQuery, [category]);

    let categoryId;
    if (categoryResults.length === 0) {
      // Insert the new category into the categories table
      const insertCategoryQuery = `INSERT INTO categories (name) VALUES (?)`;
      const [categoryInsertResults] = await mysqlConnection()
        .promise()
        .query(insertCategoryQuery, [category]);
      categoryId = categoryInsertResults.insertId;
    } else {
      categoryId = categoryResults[0].id; // Use existing category ID
    }

    // Insert the event with the existing or new category and description option
    const insertEventQuery = `
      INSERT INTO events (title, description, start_date, end_date, image_url, category_id, description_option) 
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
        categoryId, // Use the correct categoryId here
        descriptionOption,
      ]);

    res.status(201).json({
      id: eventResults.insertId,
      title,
      description,
      start_date,
      end_date,
      image_url,
      category_id: categoryId,
      description_option: descriptionOption,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
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
