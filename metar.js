export default async function handler(req, res) {

  const { icao } = req.query;
  const key = process.env.AVWX_API_KEY;

  if (!icao) {
    return res.status(400).json({ error: "ICAO required" });
  }

  try {
    const response = await fetch(
      `https://avwx.rest/api/metar/${icao}`,
      {
        headers: { Authorization: key }
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "METAR fetch failed" });
  }
}
