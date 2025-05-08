import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  joinEvent,
  updateEvent,
  getAttendees,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createEvent);
router.get("/attendees", getAttendees);
router.get("/getevents", getEvents);
router.get("/:eventId", getEvent);
router.delete("/deleteevent/:eventId/:userId", verifyToken, deleteEvent);
router.put("/updateevent/:eventId/:userId", verifyToken, updateEvent);
router.post("/join/:eventId", verifyToken, joinEvent);

export default router;
