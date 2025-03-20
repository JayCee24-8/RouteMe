import axios from "axios";

const fetchRelationsByNode = async (nodeId) => {
  const overpassQuery = `
    [out:json];
    (
      node(${nodeId});  // Get the node
      <;                // Find all relations referencing this node
    );
    out body;
  `;

  console.log("Fetching relations for node:", nodeId);
  console.log("Query:", overpassQuery);

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Full API Response:", response.data);

    // Extract only relation IDs
    const relationIds = response.data.elements
      .filter((el) => el.type === "relation")
      .map((rel) => rel.id);

    console.log("Extracted Relation IDs:", relationIds);
    return relationIds;
  } catch (error) {
    console.error("Error fetching Overpass API:", error);
    return [];
  }
};

export default fetchRelationsByNode;
