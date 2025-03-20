import axios from "axios";

const fetchNearestNode = async (lat, lon) => {
  const overpassQuery = `
    [out:json];
    (
      node(around:100, ${lat}, ${lon}) ["public_transport"="stop_position"];
    );
    out body;
  `;

  console.log("Fetching nearest bus stop with query:", overpassQuery);

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("API Response Data:", response.data);

    if (response.data.elements.length > 0) {
      const node = response.data.elements[0];
      console.log("Retrieved Node:", node);

      return node; // Return the full node object
    } else {
      console.error("No bus stop found near this location.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Overpass API:", error);
    return null;
  }
};

export default fetchNearestNode;
