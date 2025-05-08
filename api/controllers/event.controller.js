import mysqlConnection from "../mysql.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const createEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create an event"));
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

  if (
    !title ||
    !description ||
    !start_date ||
    !end_date ||
    !image_url ||
    !category ||
    !location ||
    !location.name ||
    !location.address ||
    !location.city ||
    !location.country
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  try {
    const connection = mysqlConnection().promise();

    const [categoryRows] = await connection.query(
      `SELECT id FROM categories WHERE name = ?`,
      [category]
    );
    let categoryId;
    if (categoryRows.length === 0) {
      const [categoryInsert] = await connection.query(
        `INSERT INTO categories (name) VALUES (?)`,
        [category]
      );
      categoryId = categoryInsert.insertId;
    } else {
      categoryId = categoryRows[0].id;
    }

    const { name, address, city, country } = location;
    const [locationRows] = await connection.query(
      `SELECT id FROM location WHERE name = ? AND address = ? AND city = ? AND country = ?`,
      [name, address, city, country]
    );
    let locationId;
    if (locationRows.length === 0) {
      const [locationInsert] = await connection.query(
        `INSERT INTO location (name, address, city, country) VALUES (?, ?, ?, ?)`,
        [name, address, city, country]
      );
      locationId = locationInsert.insertId;
    } else {
      locationId = locationRows[0].id;
    }

    const [eventInsert] = await connection.query(
      `INSERT INTO events (title, description, start_date, end_date, image_url, category_id, location_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        start_date,
        end_date,
        image_url,
        categoryId,
        locationId,
      ]
    );

    res.status(201).json({
      id: eventInsert.insertId,
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
  const query = `
    SELECT 
      events.id, 
      events.title, 
      events.description, 
      events.start_date, 
      events.end_date, 
      events.image_url, 
      categories.name AS category_name, 
      location.name AS location_name, 
      location.address, 
      location.city, 
      location.country
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    LEFT JOIN location ON events.location_id = location.id
  `;

  try {
    const [results] = await mysqlConnection().promise().query(query);
    res.status(200).json(results);
  } catch (error) {
    return next(errorHandler(500, "Failed to fetch events"));
  }
};

export const getEvent = async (req, res, next) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT 
      events.id, 
      events.title, 
      events.description, 
      events.start_date, 
      events.end_date, 
      events.image_url, 
      categories.name AS category_name,
      location.name AS location_name, 
      location.address, 
      location.city, 
      location.country
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    LEFT JOIN location ON events.location_id = location.id
    WHERE events.id = ?
  `;

  try {
    const [results] = await mysqlConnection().promise().query(query, [eventId]);
    if (results.length === 0) {
      return next(errorHandler(404, "Event not found"));
    }
    res.status(200).json(results[0]);
  } catch (error) {
    return next(errorHandler(500, "Failed to fetch event"));
  }
};

export const deleteEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete an event"));
  }

  const eventId = req.params.eventId;

  try {
    const [results] = await mysqlConnection()
      .promise()
      .query(`DELETE FROM events WHERE id = ?`, [eventId]);

    if (results.affectedRows === 0) {
      return next(errorHandler(404, "Event not found"));
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, "Failed to delete event"));
  }
};

export const updateEvent = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update an event"));
  }

  const eventId = req.params.eventId;
  const { title, description, start_date, end_date, image_url } = req.body;

  try {
    const [results] = await mysqlConnection()
      .promise()
      .query(
        `UPDATE events 
         SET title = ?, description = ?, start_date = ?, end_date = ?, image_url = ? 
         WHERE id = ?`,
        [title, description, start_date, end_date, image_url, eventId]
      );

    if (results.affectedRows === 0) {
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
  } catch (error) {
    return next(errorHandler(500, "Failed to update event"));
  }
};

export const joinEvent = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found in MongoDB"));
    }

    const connection = mysqlConnection().promise();

    const [existing] = await connection.query(
      `SELECT * FROM attendees WHERE event_id = ? AND email = ?`,
      [eventId, user.email]
    );

    if (existing.length > 0) {
      return next(errorHandler(400, "You have already joined this event"));
    }

    await connection.query(
      `INSERT INTO attendees (event_id, username, email) VALUES (?, ?, ?)`,
      [eventId, user.username, user.email]
    );

    res.status(201).json({ message: "You have joined the event!" });
  } catch (error) {
    console.error(error);
    return next(errorHandler(500, "Failed to join event"));
  }
};

export const getAttendees = async (req, res, next) => {
  try {
    const [attendees] = await mysqlConnection().promise().query(`
        SELECT 
          attendees.username, 
          attendees.email, 
          events.title AS event_title
        FROM attendees
        JOIN events ON attendees.event_id = events.id
      `);

    res.status(200).json(attendees);
  } catch (error) {
    console.error("MySQL Error:", error);
    next(errorHandler(500, "Failed to fetch attendees"));
  }
};
