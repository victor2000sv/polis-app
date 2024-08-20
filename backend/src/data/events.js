module.exports = function ({ db }) {
  async function getAll(date = null) {
    const startDate = date !== null ? new Date(date) : new Date();

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const events = await db.query(
      "SELECT * FROM events WHERE date >= ? AND date < ?;",
      [startDate.toJSON().slice(0, 10), endDate.toJSON().slice(0, 10)]
    );

    return events;
  }
  async function listAll(perPage, page) {
    const events = await db.query(
      "SELECT * FROM events ORDER BY DATE(date) DESC LIMIT ? OFFSET ?;",
      [parseInt(perPage), (parseInt(page) - 1) * parseInt(perPage)]
    );

    return events;
  }
  async function getTypes() {
    const types = await db.query("SELECT * FROM types;");
    return types;
  }
  async function getById(id) {
    const eventData = await db.query(
      "SELECT events.*, types.title AS type_title FROM events JOIN types ON types.type_id = events.type WHERE event_id = ? LIMIT 1",
      [id]
    );

    const thisYear = parseInt(new Date().getFullYear());
    const event = eventData && eventData[0];

    const statistics = {
      numberOfOccurencesInTheArea: await getNumberOfOccurencesByRadius(id, 2),
      eventRank: await getTypeRankByYear(id, thisYear),
      occurencesOfTypeByYear: await getOccurencesOfTypeByYear(
        event.type,
        thisYear
      ),
    };

    event["statistics"] = statistics;

    return event;
  }

  async function getNumberOfOccurencesByRadius(eventId, radius = 2) {
    const statsData = await db.query(
      `
        SELECT 
            e1.event_id,
            COUNT(*) AS occurrence_count
        FROM 
            events e1
        JOIN 
            events e2 ON e1.event_id = e2.event_id
        WHERE 
            e1.event_id = ? AND
            (6371 * ACOS(
                COS(RADIANS(e1.latitude)) * COS(RADIANS(e2.latitude)) * 
                COS(RADIANS(e2.longitude) - RADIANS(e1.longitude)) + 
                SIN(RADIANS(e1.latitude)) * SIN(RADIANS(e2.latitude))
            )) <= ?
        GROUP BY 
            e1.event_id;

      `,
      [eventId, radius]
    );

    return statsData && parseInt(statsData[0].occurrence_count);
  }

  async function getTypeRankByYear(eventId, year) {
    const statsData = await db.query(
      `
      WITH TypeCounts AS (
        SELECT 
          type, 
          COUNT(*) AS occurrence_count
        FROM 
          events
        WHERE
          YEAR(date) = ?
        GROUP BY 
          type
      ),
      RankedTypes AS (
        SELECT 
          type, 
          occurrence_count,
          RANK() OVER (ORDER BY occurrence_count DESC) AS rank
        FROM 
          TypeCounts
      )
      SELECT 
        rank 
      FROM 
        RankedTypes
      WHERE 
          type = (SELECT type FROM events WHERE event_id = ? LIMIT 1);
      `,
      [year, eventId]
    );

    return statsData && parseInt(statsData[0].rank);
  }

  async function getTypeRankByAllTime(typeId) {
    const statsData = await db.query(
      `
        WITH TypeCounts AS (
            SELECT 
                type,
                COUNT(*) AS occurrence_count
            FROM 
                events
            GROUP BY 
                type
        ),
        RankedTypes AS (
            SELECT 
                type, 
                occurrence_count,
                RANK() OVER (ORDER BY occurrence_count DESC) AS rank
            FROM 
                TypeCounts
        )
        SELECT 
            rank 
        FROM 
            RankedTypes
        WHERE 
            type = ?;
        `,
      [typeId]
    );

    return statsData && parseInt(statsData[0].rank);
  }

  async function getOccurencesOfTypeByYear(typeId, year) {
    const statsData = await db.query(
      "SELECT COUNT(event_id) AS count FROM events WHERE type = ? AND YEAR(date) >= ? AND YEAR(date) < ? + 1;",
      [typeId, year, year]
    );

    return statsData && parseInt(statsData[0].count);
  }

  return {
    getAll,
    getTypes,
    listAll,
    getById,
    getNumberOfOccurencesByRadius,
    getTypeRankByYear,
    getTypeRankByAllTime,
    getOccurencesOfTypeByYear,
  };
};
