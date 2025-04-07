import express from "express";
import { getDb } from "../db/connection.js";
import fetch from "node-fetch";

const router = express.Router();
const GOOGLE_MAPS_API_KEY = "AIzaSyCDYh8FF5XE4rIJyzzLZKl - WyfzwRhRytw";

router.get("/", async (req, res) => {
  const { from, to, userLat, userLon } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing 'from' or 'to' parameter" });
  }

  try {
    const db = await getDb();

    const stops = await db.all(
      `SELECT stop_id, stop_name FROM stops WHERE stop_name LIKE ? OR stop_name LIKE ?`,
      [`%${from}%`, `%${to}%`]
    );

    const fromStops = stops.filter((s) =>
      s.stop_name.toLowerCase().includes(from.toLowerCase())
    );
    const toStops = stops.filter((s) =>
      s.stop_name.toLowerCase().includes(to.toLowerCase())
    );

    let results = [];
    const seen = new Set();

    for (const fromStop of fromStops) {
      for (const toStop of toStops) {
        const trips = await db.all(
          `SELECT t.trip_id, t.shape_id, r.route_id, r.route_short_name, r.route_long_name
           FROM stop_times st1
           JOIN stop_times st2 ON st1.trip_id = st2.trip_id
           JOIN trips t ON t.trip_id = st1.trip_id
           JOIN routes r ON r.route_id = t.route_id
           WHERE st1.stop_id = ? AND st2.stop_id = ? AND st1.stop_sequence < st2.stop_sequence
           GROUP BY r.route_id`,
          [fromStop.stop_id, toStop.stop_id]
        );

        for (const trip of trips) {
          const routeKey = `${trip.route_id}`;
          if (seen.has(routeKey)) continue;
          seen.add(routeKey);

          const shape = await db.all(
            `SELECT shape_pt_lat AS lat, shape_pt_lon AS lon, shape_pt_sequence
             FROM shapes WHERE shape_id = ? ORDER BY shape_pt_sequence`,
            [trip.shape_id]
          );

          const fromCoords = await db.get(
            `SELECT stop_lat AS lat, stop_lon AS lon FROM stops WHERE stop_id = ?`,
            [fromStop.stop_id]
          );
          const toCoords = await db.get(
            `SELECT stop_lat AS lat, stop_lon AS lon FROM stops WHERE stop_id = ?`,
            [toStop.stop_id]
          );

          const haversine = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };

          const closestIndex = (list, point) =>
            list.reduce((closestIdx, curr, i, arr) => {
              const dist = haversine(curr.lat, curr.lon, point.lat, point.lon);
              const closestDist = haversine(
                arr[closestIdx].lat,
                arr[closestIdx].lon,
                point.lat,
                point.lon
              );
              return dist < closestDist ? i : closestIdx;
            }, 0);

          const fromIdx = closestIndex(shape, fromCoords);
          const toIdx = closestIndex(shape, toCoords);
          const slicedShape = shape.slice(
            Math.min(fromIdx, toIdx),
            Math.max(fromIdx, toIdx) + 1
          );

          const seqs = await db.all(
            `SELECT stop_sequence FROM stop_times WHERE trip_id = ? AND stop_id IN (?, ?)`,
            [trip.trip_id, fromStop.stop_id, toStop.stop_id]
          );

          const [fromSeq, toSeq] = seqs.map((s) => s.stop_sequence);
          const tripStops = await db.all(
            `SELECT s.stop_name, s.stop_lat AS lat, s.stop_lon AS lon
             FROM stop_times st
             JOIN stops s ON s.stop_id = st.stop_id
             WHERE trip_id = ? AND stop_sequence BETWEEN ? AND ?
             ORDER BY stop_sequence`,
            [trip.trip_id, fromSeq, toSeq]
          );

          // 👉 Add walking directions if user location is provided
          let walkingDirections = null;
          if (userLat && userLon && GOOGLE_MAPS_API_KEY) {
            const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLat},${userLon}&destination=${fromCoords.lat},${fromCoords.lon}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

            try {
              const response = await fetch(directionsUrl);
              const data = await response.json();

              if (data.status === "OK" && data.routes.length > 0) {
                const route = data.routes[0];
                walkingDirections = {
                  distance: route.legs[0].distance.text,
                  duration: route.legs[0].duration.text,
                  steps: route.legs[0].steps.map((step) => ({
                    instruction: step.html_instructions,
                    distance: step.distance.text,
                    duration: step.duration.text,
                    polyline: step.polyline.points,
                  })),
                  polyline: route.overview_polyline.points,
                };
              }
            } catch (err) {
              console.error("Google Maps API error:", err.message);
            }
          }

          results.push({
            trip_id: trip.trip_id,
            shape_id: trip.shape_id,
            route_short_name: trip.route_short_name,
            route_long_name: trip.route_long_name,
            from_stop: fromStop.stop_name,
            to_stop: toStop.stop_name,
            from_stop_id: fromStop.stop_id,
            to_stop_id: toStop.stop_id,
            shape: slicedShape,
            stops: tripStops,
            walkingDirections, // 🚶‍♂️🗺️ Optional directions
          });
        }
      }
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
